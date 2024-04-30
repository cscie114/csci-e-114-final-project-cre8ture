
import * as Automerge from '@automerge/automerge';

// This will hold the documents keyed by the URL
const docs = {};

export const getDoc = (url) => {
  // If the document for this URL doesn't exist, create it
  if (!docs[url]) {
    docs[url] = Automerge.from({ poems: [] });
  }
  return docs[url];
};

export const applyChanges = (url, changes) => {
  if (!docs[url]) {
    console.error(`Document with URL ${url} not found`);
    return;
  }
  docs[url] = Automerge.applyChanges(docs[url], changes);
  return docs[url];
};

export const createNewDocWithChanges = (url, updateFunction) => {
  if (!docs[url]) {
    docs[url] = Automerge.from({ poems: [] });
  }
  const newDoc = Automerge.change(docs[url], updateFunction);
  docs[url] = newDoc;
  return newDoc;
};

export const getChangesForNewDoc = (url, newDoc) => {
  const currentDoc = getDoc(url);
  const changes = Automerge.getChanges(currentDoc, newDoc);
  return changes;
};
