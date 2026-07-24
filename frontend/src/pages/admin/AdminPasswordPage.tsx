import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';

export function AdminPasswordPage() {
  const qc = useQueryClient();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const change = useMutation({
    mutationFn: () => apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setError('');
      qc.invalidateQueries({ queryKey: ['auth/me'] });
    },
    onError: (err: { message?: string }) => setError(err?.message ?? 'Failed to change password'),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    change.mutate();
  };
  return (
    <>
      <Seo title="Change Password" noindex />
      <h1 className="mb-6 text-2xl font-bold">Change Password</h1>
      <Card className="max-w-lg space-y-4">
        {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={change.status === 'pending'}>{change.status === 'pending' ? 'Updating…' : 'Update Password'}</Button>
        </form>
      </Card>
    </>
  );
}
