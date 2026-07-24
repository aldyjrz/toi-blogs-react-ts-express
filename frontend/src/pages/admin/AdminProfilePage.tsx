import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/stores/auth.store';
import { Seo } from '@/components/Seo';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';

export function AdminProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
      await qc.invalidateQueries({ queryKey: ['auth/me'] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo title="Profile" noindex />
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <Card className="max-w-lg space-y-4">
        <div>
          <Label>Email</Label>
          <Input value={user?.email ?? ''} disabled />
        </div>
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</Button>
      </Card>
    </>
  );
}
