import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link2,
  Image as ImageIcon,
  Code2,
  Table2,
  CheckSquare,
  Highlighter,
  Youtube,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';

interface Props {
  editor: Editor;
}

export default function EditorToolbar({ editor }: Props) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showYouTubeDialog, setShowYouTubeDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  if (!editor) return null;

  const handleLinkSubmit = () => {
    if (!linkUrl) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setShowLinkDialog(false);
  };

  const handleImageSubmit = () => {
    if (!imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setShowImageDialog(false);
  };

  const handleYouTubeSubmit = () => {
    if (!youtubeUrl) return;
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
    setYoutubeUrl('');
    setShowYouTubeDialog(false);
  };

  const Button = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded hover:bg-muted transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-foreground/70 hover:text-foreground'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 border-b p-2 items-center">
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive('paragraph')}
        title="Paragraph"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive('taskList')}
        title="Checklist"
      >
        <CheckSquare className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <div className="w-4 h-px bg-current" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <Code2 className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      <Button
        onClick={() => setShowLinkDialog(true)}
        active={editor.isActive('link')}
        title="Insert Link"
      >
        <Link2 className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => setShowImageDialog(true)}
        title="Insert Image"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => setShowYouTubeDialog(true)}
        title="Insert YouTube Video"
      >
        <Youtube className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="Insert Table"
      >
        <Table2 className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        active={editor.isActive({ textAlign: 'justify' })}
        title="Align Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </Button>

      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkDialog(false)}>
          <div className="bg-background border border-border rounded-lg p-4 w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-2">Insert Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mb-3"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSubmit(); }}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowLinkDialog(false)} className="px-3 py-1.5 text-sm rounded-md hover:bg-muted">Cancel</button>
              <button type="button" onClick={handleLinkSubmit} className="px-3 py-1.5 text-sm rounded-md bg-primary text-background">Insert</button>
            </div>
          </div>
        </div>
      )}

      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageDialog(false)}>
          <div className="bg-background border border-border rounded-lg p-4 w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-2">Insert Image</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mb-3"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleImageSubmit(); }}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowImageDialog(false)} className="px-3 py-1.5 text-sm rounded-md hover:bg-muted">Cancel</button>
              <button type="button" onClick={handleImageSubmit} className="px-3 py-1.5 text-sm rounded-md bg-primary text-background">Insert</button>
            </div>
          </div>
        </div>
      )}

      {showYouTubeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowYouTubeDialog(false)}>
          <div className="bg-background border border-border rounded-lg p-4 w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-2">Insert YouTube Video</h3>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mb-3"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleYouTubeSubmit(); }}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowYouTubeDialog(false)} className="px-3 py-1.5 text-sm rounded-md hover:bg-muted">Cancel</button>
              <button type="button" onClick={handleYouTubeSubmit} className="px-3 py-1.5 text-sm rounded-md bg-primary text-background">Insert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}