import * as Automerge from '@automerge/automerge'

const initialState = {
    poems: []
};

let doc = Automerge.from(initialState);


import Peer from 'simple-peer';

const peer = new Peer({
    initiator: location.hash === '#init', // determine who is the initiator
    trickle: false
});

peer.on('signal', data => {
    // send this signaling data to the other peer via your chosen signaling method
});

peer.on('data', data => {
    // data received from other peer
    const changes = JSON.parse(data);
    doc = Automerge.applyChanges(doc, changes);
});

// To send changes
const newDoc = Automerge.change(doc, doc => {
    // modify the doc
});

const changes = Automerge.getChanges(doc, newDoc);
peer.send(JSON.stringify(changes));
