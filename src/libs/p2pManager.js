// import Peer from 'peerjs';
import fetch from 'cross-fetch';

// export function initializePeerConnection(peerId) {
//   const peer = new Peer(peerId);

//   peer.on('open', id => {
//     console.log(`My peer ID is: ${id}`);
//     // Now fetch any waiting offers
//     fetch('/.netlify/functions/retrieveOffer', {
//       method: 'POST',
//       body: JSON.stringify({ peerId: id })
//     })
//     .then(res => res.json())
//     .then(data => {
//       if (data.offer) {
//         // Use this offer to establish connection
//         peer.signal(data.offer);
//       }
//     });
//   });

//   peer.on('signal', signalData => {
//     // Send this signal data to storeOffer function
//     fetch('/.netlify/functions/storeOffer', {
//       method: 'POST',
//       body: JSON.stringify({ peerId: peer.id, offer: signalData })
//     });
//   });

//   peer.on('connection', conn => {
//     conn.on('data', data => {
//       console.log(data);
//     });
//   });

//   return peer;
// }


// p2pManager.js
export async function initializePeerConnection(peerId) {
  if (typeof window !== "undefined") {
    const Peer = (await import('peerjs')).default;
    const peer = new Peer(peerId);

    peer.on('open', id => {
      console.log(`My peer ID is: ${id}`);
      // Now fetch any waiting offers
      fetch('/.netlify/functions/retrieveOffer', {
        method: 'POST',
        body: JSON.stringify({ peerId: id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.offer) {
          // Use this offer to establish connection
          peer.signal(data.offer);
        }
      });
    });

    peer.on('signal', signalData => {
      // Send this signal data to storeOffer function
      fetch('/.netlify/functions/storeOffer', {
        method: 'POST',
        body: JSON.stringify({ peerId: peer.id, offer: signalData })
      });
    });

    peer.on('connection', conn => {
      conn.on('data', data => {
        console.log(data);
      });
    });

    return peer;
  }
  return null; // Return null when not in a client-side environment
}
