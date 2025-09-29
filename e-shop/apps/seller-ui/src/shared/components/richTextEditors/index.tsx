'use client';

import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  console.log('RichTextEditor rendered with value:', value);

  // Toolbar modules
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }], // font family
        [{ size: [] }], // font size
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ color: [] }, { background: [] }], // text & highlight
        [{ align: [] }], // alignment
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        ['clean'], // remove formatting
      ],
    }),
    []
  );

  // Allowed formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'color',
    'background',
    'align',
    'list',
    'indent',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="w-full mt-4">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="rich-text-editor"
        placeholder="Write something amazing..."
      />

      {/* Inline Styling */}
      <style jsx global>{`
        /* Dark Mode Rich Text Editor */
        .rich-text-editor {
          background: #111827; /* gray-900 */
          border-radius: 0.75rem;
          border: 1px solid #1f2937; /* gray-800 */
          min-height: 200px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          color: #f3f4f6; /* gray-100 */
        }

        /* No focus border */
        .rich-text-editor:focus-within {
          border-color: #1f2937;
          box-shadow: none;
        }

        /* Toolbar */
        .rich-text-editor .ql-toolbar {
          border-radius: 0.75rem 0.75rem 0 0;
          border: none;
          border-bottom: 1px solid #1f2937;
          background: #1f2937; /* gray-800 */
          padding: 0.5rem;
        }

        .rich-text-editor .ql-toolbar button {
          color: #d1d5db; /* gray-300 */
        }
        .rich-text-editor .ql-toolbar button:hover {
          color: #60a5fa; /* blue-400 */
        }

        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #d1d5db;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #d1d5db;
        }
        .rich-text-editor .ql-toolbar .ql-picker {
          color: #d1d5db;
        }

        /* ✅ Heading & font dropdowns visible */
        .rich-text-editor .ql-toolbar .ql-picker-options {
          background: #f9fafb; /* light bg */
          color: #111827; /* black text */
        }
        .rich-text-editor .ql-toolbar .ql-picker-options .ql-picker-item {
          color: #111827 !important;
        }
        .rich-text-editor .ql-toolbar .ql-picker-label::before {
          color: #d1d5db;
        }

        /* Content Area */
        .rich-text-editor .ql-container {
          border: none !important;
          flex: 1;
          font-size: 0.95rem;
          line-height: 1.6;
          font-family: system-ui, Inter, Roboto, 'Times New Roman', Courier,
            sans-serif;
          color: #f3f4f6; /* gray-100 */
          min-height: 180px;
          overflow-y: auto;
          background: #111827; /* gray-900 */
        }

        .rich-text-editor .ql-editor {
          padding: 1rem;
          word-break: break-word;
          white-space: pre-wrap;
        }

        /* Fix placeholder cursor alignment */
        .rich-text-editor .ql-editor.ql-blank::before {
          left: 1rem !important; /* aligns with padding */
          color: #6b7280; /* gray-500 */
          font-style: normal;
        }

        /* ✅ Headings always visible */
        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3,
        .rich-text-editor .ql-editor h4,
        .rich-text-editor .ql-editor h5,
        .rich-text-editor .ql-editor h6 {
          color: #000 !important; /* strong black */
        }

        /* Links */
        .rich-text-editor .ql-editor a {
          color: #60a5fa;
          text-decoration: underline;
        }

        /* Blockquotes */
        .rich-text-editor .ql-editor blockquote {
          border-left: 3px solid #374151;
          margin: 0.5rem 0;
          padding-left: 0.75rem;
          color: #d1d5db;
          font-style: italic;
        }

        /* Code blocks */
        .rich-text-editor .ql-editor pre {
          background: #1f2937;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-family: monospace;
          font-size: 0.85rem;
          color: #f9fafb;
          overflow-x: auto;
        }

        /* Lists */
        .rich-text-editor .ql-editor ol,
        .rich-text-editor .ql-editor ul {
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
