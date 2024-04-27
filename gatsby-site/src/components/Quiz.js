// src/components/Quiz.js
import React, { useState } from 'react';

const Quiz = ({ question, onSubmit }) => {
  const [userInput, setUserInput] = useState('');

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(userInput);
  };

  return (
    <aside>
      <form onSubmit={handleSubmit}>
        <p>{question}</p>
        <input type="text" value={userInput} onChange={handleChange} />
        <button type="submit">Check Answer</button>
      </form>
    </aside>
  );
};

export default Quiz;
