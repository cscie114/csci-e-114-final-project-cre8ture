import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const PeerConnectionComponent = () => {
    const [peerId, setPeerId] = useState('');
    const [peer, setPeer] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState({});

    useEffect(() => {
        // Assign a random peer ID to this instance
        const myId = `kaik${Math.floor(Math.random() * 100 + 1)}`;
        const peer = new Peer(myId);

        setPeer(peer);
        setPeerId(myId);

        peer.on('open', id => {
            console.log('My peer ID is:', id);
            cycleThroughPeers(id, peer);
        });

        peer.on('connection', conn => {
            setupConnectionEvents(conn);
        });

        peer.on('error', err => {
            // console.error(`Error with peer ${myId}:`, err);
        });

        return () => {
            peer.destroy();
        };
    }, []);

    const cycleThroughPeers = (myId, peer) => {
        const interval = 100; // 5 seconds between connection attempts
        let current = 1;
        
        const intervalId = setInterval(() => {
            let targetId = `kaik${current}`;
            if (targetId === myId) {
                current = (current % 10) + 1; // Skip own ID
                targetId = `kaik${current}`;
            }
            if (!connectionStatus[targetId]) {
                attemptConnection(targetId, peer);
            }
            current = (current % 10) + 1; // Move to the next ID
        }, interval);

        return () => clearInterval(intervalId);
    };

    const attemptConnection = (targetId, peer) => {
        const conn = peer.connect(targetId);
        setupConnectionEvents(conn);
    };

    const setupConnectionEvents = (conn) => {
        conn.on('open', () => {
            console.log(`Connected to ${conn.peer}`);
            setConnectionStatus(prev => ({ ...prev, [conn.peer]: 'connected' }));
        });

        conn.on('data', data => {
            console.log('Received data:', data);
        });

        conn.on('close', () => {
            console.log(`Connection with ${conn.peer} closed.`);
            setConnectionStatus(prev => ({ ...prev, [conn.peer]: 'disconnected' }));
        });

        conn.on('error', err => {
            // console.error('Connection error:', err);
        });
    };

    return (
        <div>
            <h2>Peer Connection Status</h2>
            <p>Your ID: <strong>{peerId}</strong></p>
            <ul>
                {Object.entries(connectionStatus).map(([id, status]) =>
                    <li key={id}>{id}: {status}</li>
                )}
            </ul>
        </div>
    );
};

export default PeerConnectionComponent;
