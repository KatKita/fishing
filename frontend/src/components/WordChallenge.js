import React, { useState, useEffect, useRef } from 'react';
import './WordChallenge.css';

const WordChallenge = ({ words, currentWordIndex, onWordComplete, onTypingMistake, timeLeft }) => {
  const [currentInput, setCurrentInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const inputRef = useRef(null);

  const currentWord = words[currentWordIndex] || '';

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWordIndex]);

  useEffect(() => {
    setCurrentInput('');
    setIsCorrect(null);
    setMistakeCount(0);
  }, [currentWordIndex]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentInput(value);
    
    if (value === currentWord) {
      setIsCorrect(true);
      setTimeout(() => {
        onWordComplete(value, mistakeCount);
        setCurrentInput('');
        setIsCorrect(null);
        setMistakeCount(0);
      }, 200);
    } else if (currentWord.startsWith(value)) {
      setIsCorrect(null);
    } else {
      setIsCorrect(false);
      // Check if this is a new mistake (not just continuing to type wrong)
      if (value.length > 0 && !currentWord.startsWith(value.slice(0, -1))) {
        setMistakeCount(prev => prev + 1);
        onTypingMistake();
      }
    }
  };

  const getLetterClass = (letter, index) => {
    if (index < currentInput.length) {
      return currentInput[index] === letter ? 'correct' : 'incorrect';
    }
    return index === currentInput.length ? 'current' : '';
  };

  return (
    <div className="word-challenge">
      <div className="challenge-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}>
          </div>
        </div>
        <div className="challenge-stats">
          <div className="mistake-counter">
            ❌ Mistakes: {mistakeCount}
          </div>
          <div className="time-display">
            <span className={`time ${timeLeft <= 5 ? 'urgent' : ''}`}>
              ⏰ {timeLeft}s
            </span>
          </div>
        </div>
      </div>
      
      <div className="word-display">
        <div className="word-counter">
          Word {currentWordIndex + 1} of {words.length}
        </div>
        <div className="target-word">
          {currentWord.split('').map((letter, index) => (
            <span 
              key={index}
              className={`letter ${getLetterClass(letter, index)}`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      
      <div className="input-section">
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          className={`word-input ${isCorrect === true ? 'success' : isCorrect === false ? 'error' : ''}`}
          placeholder="Type the word..."
          autoComplete="off"
        />
        <div className="input-feedback">
          {isCorrect === true && '✓ Perfect!'}
          {isCorrect === false && '✗ Try again! (-1 second)'}
        </div>
      </div>
      
      <div className="remaining-words">
        {words.slice(currentWordIndex + 1).map((word, index) => (
          <span key={index} className="upcoming-word">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordChallenge;