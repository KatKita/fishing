import React from 'react';
import './GameStats.css';

const GameStats = ({ stats }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="game-stats">
      <div className="stats-header">
        <h3>📊 Game Statistics</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">{formatTime(stats.totalTimeSpent)}</div>
            <div className="stat-label">Time Spent</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔤</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalLettersTyped.toLocaleString()}</div>
            <div className="stat-label">Letters Typed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalWordsTyped.toLocaleString()}</div>
            <div className="stat-label">Words Typed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMistakes}</div>
            <div className="stat-label">Total Mistakes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">
              {stats.totalWordsTyped > 0 
                ? ((stats.totalWordsTyped - stats.totalMistakes) / stats.totalWordsTyped * 100).toFixed(1) + '%'
                : '0%'
              }
            </div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">
              {stats.totalTimeSpent > 0 
                ? Math.round((stats.totalLettersTyped / stats.totalTimeSpent) * 60) 
                : 0
              } LPM
            </div>
            <div className="stat-label">Letters Per Minute</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;