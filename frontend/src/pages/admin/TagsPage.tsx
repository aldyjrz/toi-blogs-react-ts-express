import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { useTags, useCreateTag } from '@/hooks/useTaxonomy';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';

export function AdminTagsPage() {
  const { data, isLoading } = useTags();
  const createTag = useCreateTag();
  const [name, setName] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTag.mutateAsync({ name });
    setName('');
  };

  return (
    <>
      <Seo title="Tags" noindex />
      <h1 className="mb-6 text-2xl font-bold">Tags</h1>
      <Card className="mb-6">
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </Card>
      {isLoading ? <p>Loading…</p> : (
        <div className="flex flex-wrap gap-2">
          {(data?.data ?? []).map((t) => (
            <span key={t.id} className="rounded-full border border-border px-3 py-1 text-sm">#{t.name}</span>
          ))}
        </div>
      )}
    </>
  );
}
