// import React, { useState, useEffect, useRef } from 'react';
// import nlp from 'compromise';
// import { updateGraph } from '../libs/createGraph';
// // import {initializePeerConnection} from '../libs/p2pManager';
// import { retrieveUsername } from '../libs/store/usernames';
// import { doc, applyChanges, createNewDocWithChanges, getChangesForNewDoc } from '../libs/docManager';


// const InteractiveTextAnalysis = () => {
    
//     // const [peer, setPeer] = useState(null);  // Add this to manage your peer connection state

//     const [inputText, setInputText] = useState("");
//     const svgRef = useRef(null);



//     ///////////////////////// PEER 2 PEER /////////////////////////
//     useEffect(() => {
//         const username = retrieveUsername(); // Call this function to get the stored username
//         // const cleanUp = initializePeerConnection(username, setPeer);
//         // return cleanUp; // Cleanup the peer connection when the component unmounts
//       }, []);

//     //   useEffect(() => {
//     //     // Handle incoming data from peers
//     //     if (peer) {
//     //         peer.on('data', data => {
//     //             const changes = JSON.parse(data);
//     //             applyChanges(changes);  // Update Automerge document with received changes
//     //         });
//     //     }
//     // }, [peer]);
    
//     // // Watch inputText for changes and send updates
//     // useEffect(() => {
//     //     if (inputText && peer) {
//     //         const newDoc = createNewDocWithChanges(doc, doc => {
//     //             doc.poems[0] = inputText;  // Update the poem text in the Automerge document
//     //         });
//     //         const changes = getChangesForNewDoc(doc, newDoc);
//     //         peer.send(JSON.stringify(changes));  // Send changes to the peer
//     //     }
//     // }, [inputText, peer]);

    

//     ///////////////////////// PEER 2 PEER /////////////////////////


//     useEffect(() => {
//         analyzeText(inputText);
//     }, [inputText]);

//     const handleInputChange = (event) => {
//         setInputText(event.target.value);
//     };

//     const analyzeText = (text) => {
//         const doc = nlp(text);
//         const nouns = doc.nouns().out('array');
//         const adjectives = doc.adjectives().out('array');
//         const verbs = doc.verbs().out('array');

//         console.log('Nouns:', nouns);
//         console.log('Adjectives:', adjectives);
//         console.log('Verbs:', verbs);

//         // Initialize or update the D3 graph
//         updateGraph({ nouns, adjectives, verbs, svgRef });
//     };


//     return (
//         <div>
//             <textarea onChange={handleInputChange} value={inputText}
//             style={{color: "white"}} 
//                 rows="10" cols="30" placeholder="Write here to analyze text...">
//             </textarea>
//             <svg ref={svgRef}></svg>
//         </div>
//     );
// };

// export default InteractiveTextAnalysis;


import React, { useState, useEffect, useRef } from 'react';
import nlp from 'compromise';
import { updateGraph } from '../libs/createGraph';
import { initializePeerConnection } from '../libs/p2pManager'; // Ensure this imports correctly
import { retrieveUsername } from '../libs/store/usernames';
import { doc, applyChanges, createNewDocWithChanges, getChangesForNewDoc } from '../libs/docManager';

const InteractiveTextAnalysis = () => {
    const [peer, setPeer] = useState(null); // To manage peer connection state
    const [inputText, setInputText] = useState("");
    const svgRef = useRef(null);

    useEffect(() => {
        const username = retrieveUsername(); // Retrieve stored username
        const cleanUp = initializePeerConnection(username, setPeer); // Initialize peer connection
        return cleanUp; // Clean up the peer connection when the component unmounts
    }, []);

    useEffect(() => {
        if (peer) {
            peer.on('data', data => {
                const changes = JSON.parse(data);
                const updatedDoc = applyChanges(changes); // Apply received changes to the document
                setInputText(updatedDoc.poems.join('\n')); // Update text area if document changes
            });
        }
    }, [peer]);

    useEffect(() => {
        if (inputText && peer) {
            const newDoc = createNewDocWithChanges(doc, (draftDoc) => {
                draftDoc.poems = [inputText]; // Update the poem text in the Automerge document
            });
            const changes = getChangesForNewDoc(doc, newDoc);
            peer.send(JSON.stringify(changes)); // Send changes to the peer
        }
    }, [inputText, peer]);

    useEffect(() => {
        analyzeText(inputText);
    }, [inputText]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const analyzeText = (text) => {
        const doc = nlp(text);
        const nouns = doc.nouns().out('array');
        const adjectives = doc.adjectives().out('array');
        const verbs = doc.verbs().out('array');

        console.log('Nouns:', nouns);
        console.log('Adjectives:', adjectives);
        console.log('Verbs:', verbs);

        updateGraph({ nouns, adjectives, verbs, svgRef });
    };

    return (
        <div>
            <textarea onChange={handleInputChange} value={inputText}
            style={{color: "white"}} 
                rows="10" cols="30" placeholder="Write your poem here...">
            </textarea>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default InteractiveTextAnalysis;
