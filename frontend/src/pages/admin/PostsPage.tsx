import { useState, useEffect, useRef, useCallback } from 'react';
import { Seo } from '@/components/Seo';
import { usePosts, useCreatePost, useDeletePost, useUpdatePost } from '@/hooks/usePosts';
import { useCategories, useTags, useCreateCategory, useCreateTag } from '@/hooks/useTaxonomy';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/api';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';

function slugify(input: string): string {
  return input.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 120);
}

export function AdminPostsPage() {
  //const navigate = useNavigate();
  const { data, isLoading } = usePosts({ limit: 50 });
  const { data: cats } = useCategories();
  const { data: tags } = useTags();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const createCategory = useCreateCategory();
  const createTag = useCreateTag();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    tagIds: [] as string[],
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED',
  });
  const [saving, setSaving] = useState(false);
  const [seo, setSeo] = useState({ metaTitle: '', metaDescription: '' });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createCategoryAndSelect = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const res = await createCategory.mutateAsync({ name, slug: slugify(name) });
    const cat = (res as unknown as { data: { id: string } }).data;
    setForm((f) => ({ ...f, categoryId: cat.id }));
    setNewCategoryName('');
  };

  const createTagAndAdd = async () => {
    const name = newTagName.trim();
    if (!name) return;
    const res = await createTag.mutateAsync({ name, slug: slugify(name) });
    const tag = (res as unknown as { data: { id: string } }).data;
    setForm((f) => ({ ...f, tagIds: [...new Set([...f.tagIds, tag.id])] }));
    setNewTagName('');
  };

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditor();
  };

  const syncEditor = useCallback(() => {
    if (editorRef.current) {
      setForm((f) => ({ ...f, content: editorRef.current!.innerHTML }));
    }
  }, []);

  const handleEditorPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await uploadAndInsertImage(file);
        return;
      }
    }
  };

  const uploadAndInsertImage = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('files', file);
      const res = await fetch('/api/v1/media', {
        method: 'POST',
        body: fd,
        headers: { Authorization: `Bearer ${getToken() ?? '' }` },
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const url = data?.data?.[0]?.url;
      if (url) {
        exec('insertImage', url);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAndInsertImage(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openEdit = async (post: Post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      content: post.htmlContent ?? post.content,
      excerpt: post.excerpt ?? '',
      featuredImage: post.featuredImage ?? '',
      categoryId: post.category?.id ?? '',
      tagIds: post.postTags.map((pt) => pt.tag.id),
      status: post.status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED',
    });
    setSeo({ metaTitle: post.seo?.metaTitle ?? '', metaDescription: post.seo?.metaDescription ?? '' });
    setShowForm(true);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = post.htmlContent ?? post.content;
      }
    }, 0);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setForm({ title: '', content: '', excerpt: '', featuredImage: '', categoryId: '', tagIds: [], status: 'DRAFT' });
    setSeo({ metaTitle: '', metaDescription: '' });
    setNewCategoryName('');
    setNewTagName('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let postId = editingId;
      let res;
      if (editingId) {
        res = await updatePost.mutateAsync({ id: editingId, payload: form });
      } else {
        res = await createPost.mutateAsync(form) as { data: { id: string } };
        postId = res.data.id;
      }
      if (postId) {
        await apiFetch(`/content/posts/${postId}/seo`, {
          method: 'PUT',
          body: JSON.stringify({ metaTitle: seo.metaTitle, metaDescription: seo.metaDescription }),
        });
      }
      resetForm();
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

  useEffect(() => {
    if (!showForm) {
      setEditingId(null);
      resetForm();
    }
  }, [showForm]);

  return (
    <>
      <Seo title={editingId ? 'Edit Post' : 'Manage Posts'} noindex />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{editingId ? 'Edit Post' : 'Posts'}</h1>
        {!editingId && <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'New Post'}</Button>}
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
                <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Auto-generated from content if empty" />
              </div>
              <div>
                <Label>Featured Image URL</Label>
                <Input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Content</Label>
              <div className="mt-1 flex flex-wrap gap-1 rounded-md border border-border bg-muted/30 p-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('bold')} title="Bold">B</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('italic')} title="Italic"><i>I</i></Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('underline')} title="Underline"><u>U</u></Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('strikeThrough')} title="Strike"><s>S</s></Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('formatBlock', 'H2')} title="Heading 2">H2</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('formatBlock', 'H3')} title="Heading 3">H3</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('formatBlock', 'P')} title="Paragraph">P</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('formatBlock', 'BLOCKQUOTE')} title="Quote">“</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('insertHorizontalRule')} title="Divider">—</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { const url = prompt('Image URL:'); if (url) exec('insertImage', url); }} title="Insert Image URL">🖼</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="Upload Image">📁</Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Button type="button" variant="ghost" size="sm" onClick={() => exec('insertHTML', '<pre><code>code</code></pre>')} title="Code Block">{"</>"}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { const url = prompt('YouTube URL:'); if (url) exec('insertHTML', `<iframe width="560" height="315" src="${url}" title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`); }} title="Youtube Embed">▶</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { const html = prompt('Embed HTML:'); if (html) exec('insertHTML', html); }} title="HTML Embed">"{'</>'}{"'"}</Button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                onInput={syncEditor}
                onPaste={handleEditorPaste}
                suppressContentEditableWarning
                className="min-h-[200px] rounded-md border border-border bg-background px-3 py-2 prose-editor focus:outline-none focus:ring-2 focus:ring-primary"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <div className="flex gap-2">
                  <select className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">None</option>
                    {(cats?.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="mt-2 flex gap-2">
                  <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" />
                  <Button type="button" size="sm" onClick={createCategoryAndSelect} disabled={!newCategoryName.trim()}>Add</Button>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <select className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {(tags?.data ?? []).map((t) => (
                  <button type="button" key={t.id} onClick={() => toggleTag(t.id)} className={`rounded-full border px-3 py-1 text-sm ${form.tagIds.includes(t.id) ? 'bg-primary text-background' : ''}`}>
                    {t.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tagIds.map((id) => {
                  const tag = (tags?.data ?? []).find((t) => t.id === id);
                  if (!tag) return null;
                  return (
                    <span key={id} className="flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-sm">
                      {tag.name}
                      <button type="button" onClick={() => toggleTag(id)} className="text-xs text-foreground/60 hover:text-red-500">×</button>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Add tag (type + Enter or comma)</Label>
                <div className="flex gap-2">
                  <Input value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="Tag name" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); createTagAndAdd(); } }} />
                  <Button type="button" size="sm" onClick={createTagAndAdd} disabled={!newTagName.trim()}>Add</Button>
                </div>
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
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : (editingId ? 'Update Post' : 'Save Post')}</Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
            </div>
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
                    <button className="text-primary hover:underline" onClick={() => openEdit(p)}>Edit</button>
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
