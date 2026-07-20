import sharp from 'sharp';
import { env } from '@/config/env';

interface UploadResult {
  url: string;
  width: number;
  height: number;
  size: number;
}

export async function uploadImageToSupabase(buffer: Buffer, fileName: string): Promise<UploadResult> {
  const image = sharp(buffer, { failOn: 'none' });
  const metadata = await image.metadata();
  const resized = await image
    .resize(1600, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82 })
    .toBuffer();
  const path = `uploads/${Date.now()}-${fileName.replace(/\s+/g, '-')}.webp`;

  if (env.supabaseUrl && env.supabaseSecretKey) {
    const res = await fetch(`${env.supabaseUrl}/storage/v1/object/${env.supabaseStorageBucket}/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.supabaseSecretKey}`,
        'Content-Type': 'image/webp',
        'x-upsert': 'true',
      },
      body: resized,
    });
    if (!res.ok) {
      throw new Error(`Supabase storage upload failed: ${res.status}`);
    }
    const base = env.supabaseUrl.replace(/\/$/, '');
    return {
      url: `${base}/storage/v1/object/public/${env.supabaseStorageBucket}/${path}`,
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      size: resized.length,
    };
  }

  throw new Error('Supabase storage credentials not configured');
}
