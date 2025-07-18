import React, { useState, useEffect, useCallback } from 'react';
import GameArea from './GameArea';
import WordChallenge from './WordChallenge';
import ScoreDisplay from './ScoreDisplay';
import FishInfo from './FishInfo';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { fishData, fishingWords } from '../data/mockData';
import './FishingGame.css';

const FishingGame = () => {
  const { theme } = useTheme();
  const [gameState, setGameState] = useState('waiting'); // waiting, fishing, typing, caught
  const [currentFish, setCurrentFish] = useState(null);
  const [currentWords, setCurrentWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [fishCaught, setFishCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFishInfo, setShowFishInfo] = useState(false);
  const [caughtFish, setCaughtFish] = useState(null);
  const [rodPosition, setRodPosition] = useState({ x: 50, y: 60 });
  const [isRodCast, setIsRodCast] = useState(false);

  const selectRandomFish = useCallback(() => {
    const levelMultiplier = Math.floor(level / 3) + 1;
    const fishTypes = Object.keys(fishData);
    const weights = fishTypes.map(type => fishData[type].rarity);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    let random = Math.random() * totalWeight;
    let selectedType = fishTypes[0];
    
    for (let i = 0; i < fishTypes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedType = fishTypes[i];
        break;
      }
    }
    
    return {
      ...fishData[selectedType],
      type: selectedType,
      size: Math.random() * 0.5 + 0.8 * levelMultiplier
    };
  }, [level]);

  const startFishing = () => {
    setGameState('fishing');
    setIsRodCast(true);
    
    setTimeout(() => {
      const fish = selectRandomFish();
      setCurrentFish(fish);
      const wordsNeeded = Math.max(1, Math.floor(fish.difficulty * (level * 0.5 + 1)));
      const selectedWords = fishingWords.sort(() => 0.5 - Math.random()).slice(0, wordsNeeded);
      setCurrentWords(selectedWords);
      setCurrentWordIndex(0);
      setTimeLeft(Math.max(5, 20 - level * 2));
      setGameState('typing');
    }, Math.random() * 3000 + 2000);
  };

  const onWordComplete = (word) => {
    if (word === currentWords[currentWordIndex]) {
      if (currentWordIndex === currentWords.length - 1) {
        // Fish caught!
        const points = Math.floor(currentFish.difficulty * 100 * level);
        setScore(prev => prev + points);
        setFishCaught(prev => prev + 1);
        setCaughtFish(currentFish);
        setShowFishInfo(true);
        setGameState('caught');
        
        // Level up every 5 fish
        if ((fishCaught + 1) % 5 === 0) {
          setLevel(prev => prev + 1);
        }
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setCurrentFish(null);
    setCurrentWords([]);
    setCurrentWordIndex(0);
    setTimeLeft(0);
    setIsRodCast(false);
    setShowFishInfo(false);
    setCaughtFish(null);
  };

  useEffect(() => {
    let timer;
    if (gameState === 'typing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'typing' && timeLeft === 0) {
      // Time's up, fish escaped
      resetGame();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  return (
    <div className={`fishing-game ${theme}`}>
      <div className="game-header">
        <ThemeToggle />
        <ScoreDisplay 
          score={score} 
          level={level} 
          fishCaught={fishCaught}
          timeLeft={timeLeft}
          gameState={gameState}
        />
      </div>
      
      <GameArea 
        gameState={gameState}
        currentFish={currentFish}
        rodPosition={rodPosition}
        isRodCast={isRodCast}
        onStartFishing={startFishing}
        theme={theme}
      />
      
      {gameState === 'typing' && (
        <WordChallenge 
          words={currentWords}
          currentWordIndex={currentWordIndex}
          onWordComplete={onWordComplete}
          timeLeft={timeLeft}
        />
      )}
      
      {showFishInfo && caughtFish && (
        <FishInfo 
          fish={caughtFish}
          onClose={resetGame}
        />
      )}
    </div>
  );
};

export default FishingGame;