import { useState } from 'react';
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

  const save = (key: string, value: string) => update.mutate({ key, value, group: 'general' });

  const get = (key: string) => data?.data.find((s) => s.key === key)?.value ?? '';
  const [siteName, setSiteName] = useState('');

  return (
    <>
      <Seo title="Settings" noindex />
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      {isLoading ? <p>Loading…</p> : (
        <Card className="max-w-lg space-y-4">
          <div>
            <Label>Site Name</Label>
            <Input defaultValue={get('siteName') || siteName} onChange={(e) => setSiteName(e.target.value)} />
            <Button className="mt-2" size="sm" onClick={() => save('siteName', siteName)}>Save Site Name</Button>
          </div>
          <div>
            <Label>Site Description</Label>
            <Input defaultValue={get('siteDescription')} onBlur={(e) => save('siteDescription', e.target.value)} />
          </div>
        </Card>
      )}
    </>
  );
}
