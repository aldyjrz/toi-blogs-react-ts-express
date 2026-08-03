import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import YouTube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
 import EditorToolbar from './EditorToolbar';
import { DOMParser } from 'prosemirror-model';
interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichEditor({ value, onChange }: Props) {
  const isUpdatingFromEditor = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      YouTube.configure({
        controls: true,
        modestBranding: true,
        rel: 0,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Tulis konten di sini...',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none p-4 min-h-[300px]',
      },
     handlePaste(view, event) {
  const clipboardData = event.clipboardData;
  if (!clipboardData) return false;

  const html = clipboardData.getData('text/html');
  const plain = clipboardData.getData('text/plain');

  // Gunakan HTML jika ada, jika tidak gunakan teks biasa
  const source = html || plain;
  if (!source) return false;

  // Melakukan unescape HTML Entities yang ter-encode
  const unescaped = source
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  // Jika setelah di-unescape tidak ada tag HTML, biarkan ProseMirror menangani paste biasa
  if (!unescaped.includes('<')) return false;

  // 1. Buat elemen DOM sementara untuk memuat HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = unescaped;

  // 2. Gunakan DOMParser (BUKAN DOMSerializer) untuk parse dari DOM ke Slice ProseMirror
  const parser = DOMParser.fromSchema(view.state.schema);
  const slice = parser.parseSlice(tempDiv);

  // 3. Masukkan content slice jika ada reflects isi
  if (slice.content.size > 0) {
    const tr = view.state.tr.replaceSelection(slice);
    view.dispatch(tr);
    return true; // Berhasil di-handle
  }

  return false;
},
    },
    onUpdate({ editor }) {
      isUpdatingFromEditor.current = true;
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !isUpdatingFromEditor.current && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
    isUpdatingFromEditor.current = false;
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}