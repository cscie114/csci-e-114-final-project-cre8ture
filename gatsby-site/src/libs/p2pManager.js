// src/libs/p2pManager.js

import * as Automerge from '@automerge/automerge';
import Peer from 'simple-peer';

// This initializes your Automerge document with an empty array of poems
export const doc = Automerge.from({ poems: [] });

export const initializePeerConnection = () => {
  const peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
  });

  peer.on('signal', data => {
    // Here you would typically send the signaling data to the other peer.
    // For example, using WebSockets or another signaling mechanism.
  });

  peer.on('data', data => {
    // Data received from the other peer
    const changes = JSON.parse(data);
    Automerge.applyChanges(doc, changes);
  });

  return peer;
};

export const sendChanges = (peer, newDoc) => {
  const changes = Automerge.getChanges(doc, newDoc);
  peer.send(JSON.stringify(changes));
};

