import React from 'react';
import './ScoreDisplay.css';

const ScoreDisplay = ({ score, level, fishCaught, timeLeft, gameState, onFishCounterClick }) => {
  return (
    <div className="score-display">
      <div className="score-item">
        <div className="score-icon">🏆</div>
        <div className="score-value">
          <span className="score-number">{score.toLocaleString()}</span>
          <span className="score-label">Score</span>
        </div>
      </div>
      
      <div className="score-item">
        <div className="score-icon">📈</div>
        <div className="score-value">
          <span className="score-number">{level}</span>
          <span className="score-label">Level</span>
        </div>
      </div>
      
      <div 
        className="score-item clickable-fish-counter"
        onClick={onFishCounterClick}
        title="Click to see caught fish history"
      >
        <div className="score-icon">🐟</div>
        <div className="score-value">
          <span className="score-number">{fishCaught}</span>
          <span className="score-label">Fish Caught</span>
        </div>
      </div>
      
      {gameState === 'typing' && timeLeft > 0 && (
        <div className="score-item timer">
          <div className="score-icon">⏰</div>
          <div className="score-value">
            <span className={`score-number ${timeLeft <= 5 ? 'urgent' : ''}`}>
              {timeLeft}
            </span>
            <span className="score-label">Time Left</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;