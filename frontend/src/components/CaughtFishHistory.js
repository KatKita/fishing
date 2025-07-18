import React from 'react';
import './CaughtFishHistory.css';

const CaughtFishHistory = ({ caughtFish, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const groupByLevel = (fish) => {
    const grouped = {};
    fish.forEach(f => {
      if (!grouped[f.level]) {
        grouped[f.level] = [];
      }
      grouped[f.level].push(f);
    });
    return grouped;
  };

  const groupedFish = groupByLevel(caughtFish);

  return (
    <div className="fish-history-overlay">
      <div className="fish-history-modal">
        <div className="fish-history-header">
          <h2>🎣 Caught Fish History</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="fish-history-content">
          {caughtFish.length === 0 ? (
            <div className="no-fish">
              <p>🌊 No fish caught yet! Cast your line to start fishing.</p>
            </div>
          ) : (
            <div className="fish-history-list">
              <div className="history-summary">
                <div className="summary-stat">
                  <span className="stat-number">{caughtFish.length}</span>
                  <span className="stat-label">Total Fish</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">{Object.keys(groupedFish).length}</span>
                  <span className="stat-label">Levels Played</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">{caughtFish.reduce((sum, f) => sum + f.points, 0)}</span>
                  <span className="stat-label">Total Points</span>
                </div>
              </div>
              
              {Object.entries(groupedFish).map(([level, fish]) => (
                <div key={level} className="level-group">
                  <h3 className="level-header">📈 Level {level} - {fish.length} fish</h3>
                  <div className="fish-grid">
                    {fish.map((f, index) => (
                      <div key={index} className="caught-fish-card">
                        <div className="fish-visual-small" style={{ backgroundColor: f.color }}>
                          <div className="fish-body-small">
                            <div className="fish-eye-small"></div>
                            <div className="fish-tail-small"></div>
                          </div>
                        </div>
                        <div className="fish-info-small">
                          <div className="fish-name-small">{f.name}</div>
                          <div className="fish-details-small">
                            <span className="fish-size">Size: {f.size.toFixed(1)}x</span>
                            <span className="fish-points">+{f.points} pts</span>
                          </div>
                          <div className="fish-time">{formatDate(f.caughtAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="fish-history-footer">
          <button className="continue-button" onClick={onClose}>
            Continue Fishing 🎣
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaughtFishHistory;