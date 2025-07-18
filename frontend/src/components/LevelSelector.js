import React from 'react';
import './LevelSelector.css';

const LevelSelector = ({ currentLevel, completedLevels, levelConfig, onSelectLevel, onClose }) => {
  const isLevelUnlocked = (level) => {
    return level === 1 || completedLevels.includes(level - 1);
  };

  return (
    <div className="level-selector-overlay">
      <div className="level-selector-modal">
        <div className="level-selector-header">
          <h2>🎯 Select Level</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="level-selector-content">
          <div className="current-progress">
            <div className="progress-info">
              <span>Current Level: <strong>{currentLevel}</strong></span>
              <span>Completed Levels: <strong>{completedLevels.length}</strong></span>
            </div>
          </div>
          
          <div className="levels-grid">
            {Object.entries(levelConfig).map(([level, config]) => {
              const levelNum = parseInt(level);
              const isUnlocked = isLevelUnlocked(levelNum);
              const isCompleted = completedLevels.includes(levelNum);
              const isCurrent = levelNum === currentLevel;
              
              return (
                <div
                  key={level}
                  className={`level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  onClick={() => isUnlocked && onSelectLevel(levelNum)}
                >
                  <div className="level-number">
                    {isCurrent && '🎣'} Level {level} {isCompleted && '✅'}
                  </div>
                  
                  {isUnlocked ? (
                    <div className="level-info">
                      <div className="level-stat">
                        <span className="stat-label">Fish Required:</span>
                        <span className="stat-value">{config.fishRequired}</span>
                      </div>
                      <div className="level-stat">
                        <span className="stat-label">Time Limit:</span>
                        <span className="stat-value">{config.timeLimit}s</span>
                      </div>
                      <div className="level-stat">
                        <span className="stat-label">Word Multiplier:</span>
                        <span className="stat-value">{config.wordMultiplier}x</span>
                      </div>
                      <div className="level-description">
                        {config.description}
                      </div>
                      <div className="available-fish">
                        <strong>Fish:</strong>
                        <div className="fish-list">
                          {config.availableFish.slice(0, 3).map(fishType => (
                            <span key={fishType} className="fish-name">{fishType}</span>
                          ))}
                          {config.availableFish.length > 3 && <span className="fish-more">+{config.availableFish.length - 3} more</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="level-locked">
                      <div className="lock-icon">🔒</div>
                      <div className="unlock-requirement">
                        Complete Level {levelNum - 1} to unlock
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;