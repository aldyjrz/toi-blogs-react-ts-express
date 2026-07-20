import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { usePosts, useCreatePost, useDeletePost } from '@/hooks/usePosts';
import { useCategories, useTags } from '@/hooks/useTaxonomy';
import { apiFetch } from '@/lib/api';
import { Input, Textarea, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

export function AdminPostsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = usePosts({ limit: 50 });
  const { data: cats } = useCategories();
  const { data: tags } = useTags();
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    tagIds: [] as string[],
    status: 'DRAFT',
  });
  const [saving, setSaving] = useState(false);
  const [seo, setSeo] = useState({ metaTitle: '', metaDescription: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createPost.mutateAsync({
        ...form,
        tagIds: form.tagIds,
      });
      const postId = (res as { data: { id: string } }).data.id;
      await apiFetch(`/content/posts/${postId}/seo`, {
        method: 'PUT',
        body: JSON.stringify({ metaTitle: seo.metaTitle, metaDescription: seo.metaDescription }),
      });
      setShowForm(false);
      setForm({ title: '', content: '', excerpt: '', featuredImage: '', categoryId: '', tagIds: [], status: 'DRAFT' });
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: string) => {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter((t) => t !== id) : [...f.tagIds, id],
    }));
  };

  return (
    <>
      <Seo title="Manage Posts" noindex />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'New Post'}</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Excerpt</Label>
                <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div>
                <Label>Featured Image URL</Label>
                <Input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Content (HTML supported)</Label>
              <Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <select className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">None</option>
                  {(cats?.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Status</Label>
                <select className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {(tags?.data ?? []).map((t) => (
                  <button type="button" key={t.id} onClick={() => toggleTag(t.id)} className={`rounded-full border px-3 py-1 text-sm ${form.tagIds.includes(t.id) ? 'bg-primary text-background' : ''}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="mb-2 font-semibold">SEO</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Meta Title</Label>
                  <Input value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Input value={seo.metaDescription} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} />
                </div>
              </div>
            </div>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Post'}</Button>
          </form>
        </Card>
      )}

      {isLoading ? <p>Loading…</p> : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-2">{p.title}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">{p.createdAt ? formatDate(p.createdAt) : ''}</td>
                  <td className="px-4 py-2">
                    <button className="text-primary hover:underline" onClick={() => navigate(`/blog/${p.slug}`)}>View</button>
                    <button className="ml-3 text-red-600 hover:underline" onClick={() => deletePost.mutate(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
