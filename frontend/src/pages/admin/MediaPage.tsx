import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, getToken } from '@/lib/api';
import { API_URL } from '@/lib/constants';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';

export function AdminMediaPage() {
  const qc = useQueryClient();
  const [files, setFiles] = useState<FileList | null>(null);
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => apiFetch<{ data: Array<{ id: string; url: string; fileName: string; altText?: string }> }>('/media'),
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!files) return;
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('files', f));
      fd.append('altText', alt);
      const token = getToken();
      const res = await fetch(`${API_URL}/media`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? 'Upload failed');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
      setFiles(null);
      setError('');
    },
    onError: (err: { message?: string }) => setError(err?.message ?? 'Upload failed'),
  });

  return (
    <>
      <Seo title="Media" noindex />
      <h1 className="mb-6 text-2xl font-bold">Media Library</h1>
      {error && <p className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>}
      <Card className="mb-6">
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="mb-3 block w-full text-sm" />
        <input placeholder="Alt text" value={alt} onChange={(e) => setAlt(e.target.value)} className="mb-3 w-full rounded-md border border-border px-3 py-2 text-sm" />
        <Button onClick={() => upload.mutate()} disabled={!files || upload.isPending}>{upload.isPending ? 'Uploading…' : 'Upload'}</Button>
      </Card>
      {isLoading ? <p>Loading…</p> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(data?.data ?? []).map((m) => (
            <div key={m.id} className="overflow-hidden rounded-md border border-border">
              <img src={m.url} alt={m.altText ?? m.fileName} className="aspect-square w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
