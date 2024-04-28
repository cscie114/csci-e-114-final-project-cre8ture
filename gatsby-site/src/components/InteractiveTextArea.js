import React, { useState, useEffect, useRef } from 'react';
import nlp from 'compromise';
import { updateGraph } from '../libs/createGraph';

const InteractiveTextAnalysis = () => {
    const [inputText, setInputText] = useState("");
    const svgRef = useRef(null);

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
                rows="4" cols="50" placeholder="Write here to analyze text...">
            </textarea>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default InteractiveTextAnalysis;
