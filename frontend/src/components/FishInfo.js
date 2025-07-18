import React from 'react';
import './FishInfo.css';

const FishInfo = ({ fish, onClose }) => {
  return (
    <div className="fish-info-overlay">
      <div className="fish-info-modal">
        <div className="fish-info-header">
          <h2>🎣 Fish Caught!</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="fish-display">
          <div className="fish-visual" style={{ backgroundColor: fish.color }}>
            <div className="fish-body">
              <div className="fish-eye"></div>
              <div className="fish-tail"></div>
            </div>
          </div>
          
          <div className="fish-details">
            <h3 className="fish-name">{fish.name}</h3>
            <div className="fish-stats">
              <div className="stat">
                <span className="stat-label">Size:</span>
                <span className="stat-value">{fish.size.toFixed(1)}x</span>
              </div>
              <div className="stat">
                <span className="stat-label">Rarity:</span>
                <span className="stat-value">{fish.rarity === 100 ? 'Common' : fish.rarity === 50 ? 'Uncommon' : fish.rarity === 25 ? 'Rare' : 'Legendary'}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Difficulty:</span>
                <span className="stat-value">{'⭐'.repeat(fish.difficulty)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="fish-info-content">
          <div className="fish-habitat">
            <h4>🌊 Habitat</h4>
            <p>{fish.habitat}</p>
          </div>
          
          <div className="fish-description">
            <h4>📖 Description</h4>
            <p>{fish.description}</p>
          </div>
          
          <div className="fish-facts">
            <h4>💡 Fun Facts</h4>
            <ul>
              {fish.funFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="fish-info-footer">
          <button className="continue-button" onClick={onClose}>
            Continue Fishing 🎣
          </button>
        </div>
      </div>
    </div>
  );
};

export default FishInfo;