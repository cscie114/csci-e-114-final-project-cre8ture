// src/libs/docManager.js
import * as Automerge from '@automerge/automerge';

// This initializes your Automerge document with an empty array of poems
export const doc = Automerge.from({ poems: [] });

export const applyChanges = (changes) => {
  // Apply changes to the Automerge document
  return Automerge.applyChanges(doc, changes);
};

export const createNewDocWithChanges = (currentDoc, changes) => {
  // Create a new Automerge document with changes
  return Automerge.change(currentDoc, changes);
};

export const getChangesForNewDoc = (currentDoc, newDoc) => {
  // Get changes between the current and new Automerge document
  return Automerge.getChanges(currentDoc, newDoc);
};
