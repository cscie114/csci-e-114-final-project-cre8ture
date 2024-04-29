import * as Automerge from '@automerge/automerge';

let doc = Automerge.from({ poems: [] }); // This initializes your Automerge document with an empty array of poems

export const applyChanges = (changes) => {
  doc = Automerge.applyChanges(doc, changes);
  return doc; // Return updated document to the caller
};

export const createNewDocWithChanges = (currentDoc, updateFunction) => {
  const newDoc = Automerge.change(currentDoc, updateFunction);
  return newDoc;
};

export const getChangesForNewDoc = (currentDoc, newDoc) => {
  const changes = Automerge.getChanges(currentDoc, newDoc);
  return changes;
};
