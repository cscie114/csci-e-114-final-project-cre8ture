// src/templates/studyGuide.js
import React, { useEffect, useState } from 'react';
import nlp from 'compromise';
import Quiz from '../components/Quiz';
import InteractiveTextAnalysis from '../components/InteractiveTextArea';
import Layout from '../components/layout';
// import '../styles/magick.css'; // Assuming you have local styles that import magick.css


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

  const handleSubmit = (userInput) => {
    // Compare user input with the actual answer
    const isCorrect = userInput.trim().toLowerCase() === quiz.answer.toLowerCase();
    alert(`Your answer is ${isCorrect ? 'correct' : 'incorrect'}. The correct word was: ${quiz.answer}`);
  };

  return (
    <Layout>
    <main>
      <h1 style={{color:"white"}}>{title}</h1>
      <article dangerouslySetInnerHTML={{ __html: summary }} />
      {imageUrl && <img src={imageUrl} alt={`Image for ${title}`} />}
      <div style={{display: "flex"}}>
      {/* <textarea style={{color: "white"}} rows="4" cols="50" placeholder="Write a poem" /> */}
      <InteractiveTextAnalysis/>
      {quiz && (
        <Quiz question={quiz.question} onSubmit={handleSubmit} />
      )}
      </div>
    </main>
    </Layout>
  );
};

export default StudyGuideTemplate;
