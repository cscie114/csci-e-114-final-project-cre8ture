import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

// Register the Quill modules
Quill.register('modules/cursors', QuillCursors);

const CollaborativeEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current) {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(
        // 'wss://demos.yjs.dev/ws',
        // 'quill-demo-doog',
        'ws://localhost:1234', // Local WebSocket server URL
        'quill-demo-5', // Room name, keep or change as needed
        ydoc
      );

      const ytext = ydoc.getText('quill');
      const editor = new Quill(editorRef.current, {
        modules: {
          cursors: true,
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ],
          history: {
            userOnly: true
          }
        },
        placeholder: 'Start collaborating...',
        theme: 'snow'
      });

      new QuillBinding(ytext, editor, provider.awareness);

      // Cleanup function to disconnect the provider when component unmounts
      return () => {
        provider.disconnect();
      };
    }
  }, []);

  return (
    <div ref={editorRef} id="editor" style={{ height: '400px' }} />
  );
};

export default CollaborativeEditor;
