import React, { useState } from 'react';
import { fishData } from '../data/mockData';
import './FishEncyclopedia.css';

const FishEncyclopedia = () => {
  const [selectedFish, setSelectedFish] = useState(null);

  return (
    <div className="fish-encyclopedia">
      <div className="encyclopedia-header">
        <h3>🐟 Fish Encyclopedia</h3>
        <p>Discover all the fish species in the game</p>
      </div>
      
      <div className="sand-background">
        <div className="fish-collection">
          {Object.entries(fishData).map(([type, fish]) => (
            <div 
              key={type}
              className={`fish-card ${selectedFish === type ? 'selected' : ''}`}
              onClick={() => setSelectedFish(selectedFish === type ? null : type)}
            >
              <div className="fish-visual-encyclopedia" style={{ backgroundColor: fish.color }}>
                <div className="fish-body-encyclopedia">
                  <div className="fish-eye-encyclopedia"></div>
                  <div className="fish-tail-encyclopedia"></div>
                </div>
                <div className="fish-swim-effect"></div>
              </div>
              
              <div className="fish-card-info">
                <h4 className="fish-card-name">{fish.name}</h4>
                <div className="fish-card-stats">
                  <div className="fish-stat">
                    <span className="stat-icon">⭐</span>
                    <span>{fish.difficulty}</span>
                  </div>
                  <div className="fish-stat">
                    <span className="stat-icon">💎</span>
                    <span>{fish.rarity === 100 ? 'Common' : fish.rarity === 75 ? 'Uncommon' : fish.rarity === 50 ? 'Rare' : fish.rarity === 25 ? 'Epic' : 'Legendary'}</span>
                  </div>
                </div>
              </div>
              
              {selectedFish === type && (
                <div className="fish-details-expanded">
                  <div className="fish-habitat">
                    <strong>🌊 Habitat:</strong> {fish.habitat}
                  </div>
                  <div className="fish-description">
                    <strong>📖 Description:</strong> {fish.description}
                  </div>
                  <div className="fish-facts">
                    <strong>💡 Fun Facts:</strong>
                    <ul>
                      {fish.funFacts.map((fact, index) => (
                        <li key={index}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="sand-particles">
          {Array.from({ length: 50 }, (_, i) => (
            <div 
              key={i} 
              className="sand-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FishEncyclopedia;