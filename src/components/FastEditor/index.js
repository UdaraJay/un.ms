import { useRef, useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { debounce } from 'lodash';
import MenuBar from './MenuBar';
import styles from './editor.module.scss';
import { useRouter } from 'next/router';

const FastEditor = (props) => {
  const {
    id,
    content = { type: 'doc', content: [] },
    onChange = () => {},
    editable = false,
  } = props;

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    autofocus: true,
    editable: editable,
    extensions: [
      Link,
      Placeholder,
      StarterKit.configure({
        placeholder: 'ello',
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: {
          levels: [2, 3, 4],
          HTMLAttributes: {
            class: 'font-medium',
          },
        },
      }),
      Typography,
    ],
    content: content,
    onUpdate({ editor }) {
      emitChange(editor);
    },
  });

  const emitChange = useCallback(
    debounce(
      async (editor) => {
        const content = editor.getJSON();
        await onChange(content);
      },
      750,
      { leading: true }
    ),
    []
  );

  return (
    <div key={id}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default FastEditor;
