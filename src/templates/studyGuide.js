import React, { useEffect, useState } from 'react';
import nlp from 'compromise';
// import Quiz from '../components/Quiz';
import InteractiveTextAnalysis from '../components/InteractiveTextArea';
import Layout from '../components/layout';

const StudyGuideTemplate = ({ pageContext }) => {
  const { title, summary, imageUrl, author } = pageContext;
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const doc = nlp(summary);
    // Get a few sentences randomly and generate quiz questions
    const sentences = doc.sentences().out('array');
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    const words = nlp(randomSentence).terms().out('array');

    // Replace a random word with a blank
    const wordToReplace = words[Math.floor(Math.random() * words.length)];
    const blankedSentence = randomSentence.replace(wordToReplace, '_____');

    setQuiz({
      question: blankedSentence,
      answer: wordToReplace,
      fullSentence: randomSentence,
    });
  }, [summary]);

  // const handleSubmit = (userInput) => {
  //   // Compare user input with the actual answer
  //   const isCorrect = userInput.trim().toLowerCase() === quiz.answer.toLowerCase();
  //   alert(`Your answer is ${isCorrect ? 'correct' : 'incorrect'}. The correct word was: ${quiz.answer}`);
  // };

  return (
    <Layout>
    <main style={{height: "fit-content"}}>
      <h1 style={{color:"white"}}>{title}</h1>
      <article dangerouslySetInnerHTML={{ __html: summary }} />


      {imageUrl && <img src={imageUrl} alt={`Image for ${title}`} />}
      <br/>
      <h3>How to edit the text editor</h3>
      <ul>
  <li><strong>Collaborative Poem</strong> Write into the text area below</li>
  <li><strong>GraphQL Usage:</strong> Open the editor in another tab or device and your changes will sync</li>
    </ul>
    <br/>
    <h3>Edit your poem in the text editor below</h3>
      <div style={{display: "flex", height: "600px"}}>
      <InteractiveTextAnalysis/>
      </div>
    </main>
    </Layout>
  );
};

export default StudyGuideTemplate;
