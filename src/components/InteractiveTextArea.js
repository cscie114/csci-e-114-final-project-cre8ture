import React, { useState, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import nlp from 'compromise';
import { updateGraph } from '../libs/createGraph';

const InteractiveTextAnalysis = () => {
    const [inputText, setInputText] = useState('');
    const editorRef = useRef(null);
    const svgRef = useRef(null);
    const ydocRef = useRef(new Y.Doc()); // Use ref to persist Y.Doc instance during  re-renders
    const ytextRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && editorRef.current) {
            const provider = new WebsocketProvider(
                     'wss://demos.yjs.dev/ws',
                   'kai-demo-doog',
                // 'ws://localhost:1234', // my backend that I have not deployed to cloud
                // 'nlp-demo-room', // Random Room name
                ydocRef.current
            );

            ytextRef.current = ydocRef.current.getText('text');

            // Bind textarea to Yjs
            ytextRef.current.observe(event => {
                setInputText(ytextRef.current.toString());
            });

            // Setup initial value if empty
            if (!ytextRef.current.toString()) {
                ytextRef.current.insert(0, 'Start writing your poem here...');
            }

            // Cleanup
            return () => {
                provider.disconnect();
            };
        }
    }, []);

    const handleInputChange = (event) => {
        const newText = event.target.value;
        setInputText(newText);

        // Correctly update the shared Yjs text document
        if (ytextRef.current) {
            ytextRef.current.delete(0, ytextRef.current.length);
            ytextRef.current.insert(0, newText);
        }
    };

    // Analyze text using 'compromise' NLP library
    useEffect(() => {
        if (inputText) {
            analyzeText(inputText);
        }
    }, [inputText]);

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
            <textarea
                ref={editorRef}
                onChange={handleInputChange}
                value={inputText}
                style={{ width: '100%', height: '200px', color: 'white', padding: '10px'}}
                rows="10"
                cols="30"
                placeholder="Write your poem here..."
            />
            <svg ref={svgRef} style={{ width: '100%'}} />
        </div>
    );
};

export default InteractiveTextAnalysis;
