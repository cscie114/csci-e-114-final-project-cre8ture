import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const ManualSignalingComponent = () => {
    const [peerId, setPeerId] = useState('');
    const [otherPeerId, setOtherPeerId] = useState('');
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [peer, setPeer] = useState(null);
    const [conn, setConn] = useState(null);

    useEffect(() => {
        const newPeer = new Peer();  // Connects to PeerJS public server by default
    
        newPeer.on('open', id => {
            console.log('My peer ID is:', id);
        });
    
        newPeer.on('connection', connection => {
            setupConnectionEvents(connection);
        });
    
        setPeer(newPeer);
    
        return () => {
            newPeer.destroy();
        };
    }, []);
    

    const connectToPeer = () => {
        const connection = peer.connect(otherPeerId);
        setConn(connection);
        setupConnectionEvents(connection);
    };

const setupConnectionEvents = (connection) => {
    console.log("tryna conenct here", connection)
    connection.on('data', data => {
        setReceivedMessages(prevMessages => [...prevMessages, data]);
    });
    connection.on('open', () => {
        console.log('Connection successfully opened.');
        setConn(connection);  // Update the connection state here to ensure it's ready
    });
    connection.on('error', (err) => {
        console.error('Connection failed: ', err);
    });
    connection.on('close', () => {
        console.log('Connection has been closed.');
    });
};


    const sendMessage = () => {
        if (conn && conn.open) {
            conn.send(message);
            setMessage('');
        } else {
            console.log('Connection is not open.');
        }
    };

    return (
        <div>
            <h2>PeerJS Manual Signaling</h2>
            <div>
                Your ID: <strong>{peerId}</strong>
            </div>
            <input
                value={otherPeerId}
                onChange={e => setOtherPeerId(e.target.value)}
                placeholder="Enter other peer ID"
            />
            <button onClick={connectToPeer}>Connect to Peer</button>
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
            ></textarea>
            <button onClick={sendMessage}>Send Message</button>
            <div>
                <h4>Received Messages:</h4>
                <ul>
                    {receivedMessages.map((msg, index) => <li key={index}>{msg}</li>)}
                </ul>
            </div>
        </div>
    );
};

export default ManualSignalingComponent;
