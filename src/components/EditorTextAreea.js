import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';

const LoadableAutomerge = loadable(() => import('@automerge/automerge'), {
  ssr: false  // This will disable server-side rendering for Automerge
});

const EditorTextAreea = () => {
  const [Automerge, setAutomerge] = useState(null);
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    LoadableAutomerge.load().then((Automerge) => {
      setAutomerge(Automerge);
      console.log("i am automerge", Automerge);
      const initialDoc = Automerge.from({ text: "" });
      setDoc(initialDoc);
    });
  }, []);

  useEffect(() => {
    if (!Automerge || !doc) return;
    const savedDoc = localStorage.getItem('automerge-doc');
    if (savedDoc) {
      const loadedDoc = Automerge.load(savedDoc);
      setDoc(loadedDoc);
    }
  }, [Automerge, doc]);

  const handleTextChange = (event) => {
    if (!Automerge || !doc) return;
    const newText = event.target.value;
    const updatedDoc = Automerge.change(doc, doc => {
      doc.text = newText;
    });
    setDoc(updatedDoc);
    localStorage.setItem('automerge-doc', Automerge.save(updatedDoc));
  };

  // ...

  return (
    <div>
      <textarea
        value={doc?.text}
        onChange={handleTextChange}
        style={{ width: '100%', height: '200px' }}
        placeholder="Type here..."
      />
    </div>
  );
};

export default EditorTextAreea;