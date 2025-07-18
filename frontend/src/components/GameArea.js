import React, { useEffect, useRef, useState } from 'react';
import { fishData } from '../data/mockData';
import './GameArea.css';

const GameArea = ({ gameState, currentFish, rodPosition, isRodCast, onStartFishing, theme, level, allFish }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [backgroundFish, setBackgroundFish] = useState([]);

  // Initialize background fish
  useEffect(() => {
    const fishTypes = Object.keys(fishData);
    const newBackgroundFish = Array.from({ length: 8 + level }, (_, i) => ({
      id: i,
      type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
      x: Math.random() * 800,
      y: 200 + Math.random() * 150,
      speed: 0.5 + Math.random() * 1.5,
      size: 0.3 + Math.random() * 0.4,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: fishData[fishTypes[Math.floor(Math.random() * fishTypes.length)]].color
    }));
    setBackgroundFish(newBackgroundFish);
  }, [level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw water with depth gradient
      const waterGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (theme === 'dark') {
        waterGradient.addColorStop(0, '#1a1a2e');
        waterGradient.addColorStop(0.2, '#16213e');
        waterGradient.addColorStop(0.6, '#0f3460');
        waterGradient.addColorStop(1, '#0a2a4a');
      } else {
        waterGradient.addColorStop(0, '#87ceeb');
        waterGradient.addColorStop(0.2, '#6495ed');
        waterGradient.addColorStop(0.6, '#4682b4');
        waterGradient.addColorStop(1, '#2e8b57');
      }
      
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw sand at bottom
      const sandGradient = ctx.createLinearGradient(0, canvas.height - 50, 0, canvas.height);
      sandGradient.addColorStop(0, 'rgba(194, 178, 128, 0.8)');
      sandGradient.addColorStop(0.5, 'rgba(160, 144, 96, 0.9)');
      sandGradient.addColorStop(1, 'rgba(139, 123, 75, 1)');
      
      ctx.fillStyle = sandGradient;
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
      
      // Draw sand texture
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height - 50 + Math.random() * 50;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${180 + Math.random() * 40}, ${160 + Math.random() * 40}, ${100 + Math.random() * 40}, 0.6)`;
        ctx.fill();
      }
      
      // Draw water ripples
      for (let i = 0; i < 8; i++) {
        const time = Date.now() * 0.001;
        const y = canvas.height * 0.2 + Math.sin(time + i * 0.5) * 15;
        ctx.beginPath();
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, y);
        
        for (let x = 0; x <= canvas.width; x += 8) {
          const waveY = y + Math.sin((x * 0.008) + time + i * 0.5) * 8;
          ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
      
      // Draw background fish swimming
      backgroundFish.forEach(fish => {
        fish.x += fish.speed * fish.direction;
        fish.y += Math.sin(Date.now() * 0.001 + fish.id) * 0.5;
        
        // Wrap around screen
        if (fish.direction > 0 && fish.x > canvas.width + 50) {
          fish.x = -50;
        } else if (fish.direction < 0 && fish.x < -50) {
          fish.x = canvas.width + 50;
        }
        
        // Keep fish in water bounds
        if (fish.y < 150) fish.y = 150;
        if (fish.y > canvas.height - 80) fish.y = canvas.height - 80;
        
        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.scale(fish.size * (fish.direction > 0 ? 1 : -1), fish.size);
        
        // Draw fish body
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.fillStyle = fish.color;
        ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fish tail
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-28, -8);
        ctx.lineTo(-28, 8);
        ctx.closePath();
        ctx.fill();
        
        // Draw fish eye
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(8, -3, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(8, -3, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        
        ctx.restore();
      });
      
      // Draw fishing line if cast
      if (isRodCast) {
        ctx.beginPath();
        ctx.strokeStyle = theme === 'dark' ? '#888' : '#444';
        ctx.lineWidth = 2;
        ctx.moveTo(rodPosition.x, rodPosition.y);
        ctx.lineTo(rodPosition.x + 50, canvas.height * 0.6);
        ctx.stroke();
        
        // Draw hook with sparkle effect
        ctx.beginPath();
        ctx.arc(rodPosition.x + 50, canvas.height * 0.6, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#c0392b';
        ctx.fill();
        
        // Add sparkle around hook
        const sparkles = 6;
        for (let i = 0; i < sparkles; i++) {
          const angle = (i / sparkles) * Math.PI * 2 + Date.now() * 0.01;
          const sparkleX = rodPosition.x + 50 + Math.cos(angle) * 8;
          const sparkleY = canvas.height * 0.6 + Math.sin(angle) * 8;
          
          ctx.beginPath();
          ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2);
          ctx.fillStyle = '#ffd700';
          ctx.fill();
        }
      }
      
      // Draw current fish if present
      if (currentFish && gameState === 'typing') {
        const fishX = rodPosition.x + 50 + Math.sin(Date.now() * 0.003) * 40;
        const fishY = canvas.height * 0.6 + Math.cos(Date.now() * 0.002) * 25;
        
        ctx.save();
        ctx.translate(fishX, fishY);
        ctx.scale(currentFish.size * 1.2, currentFish.size * 1.2);
        
        // Add glowing effect around current fish
        ctx.shadowColor = currentFish.color;
        ctx.shadowBlur = 20;
        
        // Draw fish body
        ctx.beginPath();
        ctx.fillStyle = currentFish.color;
        ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fish tail
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-28, -8);
        ctx.lineTo(-28, 8);
        ctx.closePath();
        ctx.fill();
        
        // Draw fish eye
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(8, -3, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(8, -3, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme, gameState, currentFish, rodPosition, isRodCast, backgroundFish]);

  return (
    <div className="game-area">
      <div className="fishing-rod-background">
        <div className="rod-handle-bg"></div>
        <div className="rod-body-bg"></div>
        <div className="rod-tip-bg"></div>
      </div>
      
      <canvas 
        ref={canvasRef}
        width={800}
        height={400}
        className="water-canvas"
      />
      
      <div className="fishing-rod">
        <div className="rod-handle"></div>
        <div className="rod-body"></div>
      </div>
      
      {gameState === 'waiting' && (
        <div className="action-overlay">
          <button 
            className="cast-button"
            onClick={onStartFishing}
          >
            🎣 Cast Your Line
          </button>
        </div>
      )}
      
      {gameState === 'fishing' && (
        <div className="action-overlay">
          <div className="fishing-message">
            <div className="ripple-effect"></div>
            <p>Something's biting...</p>
          </div>
        </div>
      )}
      
      <div className="level-indicator">
        <div className="level-badge">
          Level {level}
        </div>
      </div>
    </div>
  );
};

export default GameArea;