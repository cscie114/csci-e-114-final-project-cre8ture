
import Peer from 'simple-peer';
import fetch from 'cross-fetch'; // You might need to install this for server-side fetch support

export const initializePeerConnection = (username, setPeer) => {

    let peer;
    if (typeof window !== 'undefined') {
         peer = new Peer({
            initiator: window.location.hash === '#init',
            trickle: false,
          });
      }
      
  peer.on('signal', data => {
    // Send signaling data to the server
    fetch('/.netlify/functions/storeOffer', {
      method: 'POST',
      body: JSON.stringify({ signalData: data, username }),
    });
  });

  // Function to fetch offers or answers from the server
  const fetchOffersOrAnswers = async () => {
    const response = await fetch('/.netlify/functions/retrieveOffers', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (data.signalData) {
      peer.signal(data.signalData);
    }
  };

  // Call this function periodically to check for new offers or answers
  const signalingInterval = setInterval(fetchOffersOrAnswers, 5000);

  // Make sure to clear the interval when peer connection is established or destroyed
  peer.on('connect', () => clearInterval(signalingInterval));
  peer.on('close', () => clearInterval(signalingInterval));
  peer.on('error', () => clearInterval(signalingInterval));

  // Set the peer in the state of your component to use it later
  setPeer(peer);

  return () => {
    clearInterval(signalingInterval);
    peer.destroy();
  };
};