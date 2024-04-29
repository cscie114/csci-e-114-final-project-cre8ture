import WebTorrent from 'webtorrent';
import * as Automerge from '@automerge/automerge';

const client = new WebTorrent();
const doc = Automerge.from({ poems: [] });

// To seed the Automerge document as a file:
const serializedDoc = Automerge.save(doc);
const buffer = Buffer.from(serializedDoc);
client.seed(buffer, torrent => {
  console.log('Seeding document:', torrent.magnetURI);
});

// To download and sync the document with a given magnet URI:
client.add(magnetURI, torrent => {
  torrent.files[0].getBuffer((err, buffer) => {
    if (err) throw err;

    const receivedDoc = Automerge.load(buffer.toString());
    // Merge the received document with the local one
    Automerge.merge(doc, receivedDoc);
  });
});
