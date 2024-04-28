
import React, { useState, useEffect, useRef } from 'react';
import nlp from 'compromise';
import { updateGraph } from '../libs/createGraph';
import { doc, initializePeerConnection, sendChanges } from '../libs/p2pManager';

const InteractiveTextAnalysis = () => {
  const [inputText, setInputText] = useState("");
  const svgRef = useRef(null);
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const newPeer = initializePeerConnection();
    setPeer(newPeer);

    return () => newPeer.destroy(); // Cleanup the peer connection when the component unmounts
  }, []);

  useEffect(() => {
    analyzeText(inputText);
    // Update Automerge doc whenever the text changes
    const newDoc = Automerge.change(doc, 'Update Poem', doc => {
      doc.poems.push(inputText);
    });

    // Send changes to peer
    if (peer) {
      sendChanges(peer, newDoc);
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

        // Initialize or update the D3 graph
        updateGraph({ nouns, adjectives, verbs, svgRef });
    };


    return (
        <div>
            <textarea onChange={handleInputChange} value={inputText}
            style={{color: "white"}} 
                rows="10" cols="50" placeholder="Write here to analyze text...">
            </textarea>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default InteractiveTextAnalysis;
