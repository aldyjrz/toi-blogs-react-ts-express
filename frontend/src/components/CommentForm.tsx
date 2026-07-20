import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Comment } from '@/types';
import { Input, Textarea, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export function CommentForm({ postId, comments }: { postId: string; comments: Comment[] }) {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch(`/content/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ authorName, content }),
      });
      setDone(true);
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-2xl font-bold">Comments</h2>
      {done && <p className="mb-4 rounded-md bg-muted p-3 text-sm">Thanks! Your comment is awaiting moderation.</p>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label>Name</Label>
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
        </div>
        <div>
          <Label>Comment</Label>
          <Textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <Button type="submit" disabled={submitting}>{submitting ? 'Posting…' : 'Post comment'}</Button>
      </form>
      <ul className="mt-6 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="rounded-md border border-border p-3">
            <div className="mb-1 text-sm font-medium">{c.authorName ?? 'Anonymous'}</div>
            <p className="text-sm">{c.content}</p>
            <div className="mt-1 text-xs text-foreground/50">{formatDate(c.createdAt)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
