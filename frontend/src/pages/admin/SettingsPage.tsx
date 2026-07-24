import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';

export function AdminSettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch<{ data: Array<{ key: string; value: string; group: string }> }>('/admin/settings'),
  });

  const update = useMutation({
    mutationFn: (payload: { key: string; value: string; group: string }) =>
      apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });

  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data?.data) return;
    const map = new Map(data.data.map((s) => [s.key, s.value]));
    if (map.has('siteName')) setSiteName(map.get('siteName')!);
    if (map.has('siteDescription')) setSiteDescription(map.get('siteDescription')!);
  }, [data?.data]);

  const save = async (key: string, value: string) => {
    setSaving(true);
    try {
      await update.mutateAsync({ key, value, group: 'general' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo title="Settings" noindex />
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      {isLoading ? <p>Loading…</p> : (
        <Card className="max-w-lg space-y-4">
          <div>
            <Label>Site Name</Label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            <Button className="mt-2" size="sm" onClick={() => save('siteName', siteName)} disabled={saving}>{saving ? 'Saving…' : 'Save Site Name'}</Button>
          </div>
          <div>
            <Label>Site Description</Label>
            <Input value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} />
            <Button className="mt-2" size="sm" onClick={() => save('siteDescription', siteDescription)} disabled={saving}>{saving ? 'Saving…' : 'Save Description'}</Button>
          </div>
        </Card>
      )}
    </>
  );
}
