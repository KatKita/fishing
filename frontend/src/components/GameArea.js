import React, { useEffect, useRef } from 'react';
import './GameArea.css';

const GameArea = ({ gameState, currentFish, rodPosition, isRodCast, onStartFishing, theme }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw water with ripples
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (theme === 'dark') {
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.3, '#16213e');
        gradient.addColorStop(1, '#0f3460');
      } else {
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.3, '#4682b4');
        gradient.addColorStop(1, '#1e90ff');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw water ripples
      for (let i = 0; i < 5; i++) {
        const time = Date.now() * 0.001;
        const y = canvas.height * 0.3 + Math.sin(time + i) * 20;
        ctx.beginPath();
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.moveTo(0, y);
        
        for (let x = 0; x <= canvas.width; x += 10) {
          const waveY = y + Math.sin((x * 0.01) + time + i) * 10;
          ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
      
      // Draw fishing line if cast
      if (isRodCast) {
        ctx.beginPath();
        ctx.strokeStyle = theme === 'dark' ? '#888' : '#444';
        ctx.lineWidth = 2;
        ctx.moveTo(rodPosition.x, rodPosition.y);
        ctx.lineTo(rodPosition.x + 50, canvas.height * 0.6);
        ctx.stroke();
        
        // Draw hook
        ctx.beginPath();
        ctx.arc(rodPosition.x + 50, canvas.height * 0.6, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#c0392b';
        ctx.fill();
      }
      
      // Draw fish if present
      if (currentFish && gameState === 'typing') {
        const fishX = rodPosition.x + 50 + Math.sin(Date.now() * 0.003) * 30;
        const fishY = canvas.height * 0.6 + Math.cos(Date.now() * 0.002) * 20;
        
        ctx.save();
        ctx.translate(fishX, fishY);
        ctx.scale(currentFish.size, currentFish.size);
        
        // Draw fish body
        ctx.beginPath();
        ctx.fillStyle = currentFish.color;
        ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fish tail
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(-25, -8);
        ctx.lineTo(-25, 8);
        ctx.closePath();
        ctx.fill();
        
        // Draw fish eye
        ctx.beginPath();
        ctx.arc(8, -3, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(8, -3, 1, 0, Math.PI * 2);
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
  }, [theme, gameState, currentFish, rodPosition, isRodCast]);

  return (
    <div className="game-area">
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
    </div>
  );
};

export default GameArea;