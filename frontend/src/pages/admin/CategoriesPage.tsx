import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { useCategories, useCreateCategory } from '@/hooks/useTaxonomy';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';

export function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory.mutateAsync({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <>
      <Seo title="Categories" noindex />
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>
      <Card className="mb-6">
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex-1">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </Card>
      {isLoading ? <p>Loading…</p> : (
        <ul className="space-y-2">
          {(data?.data ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-foreground/50">/{c.slug}</p>
              </div>
              <span className="text-xs text-foreground/50">{c._count?.posts ?? 0} posts</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
