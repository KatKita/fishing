import React, { useState, useEffect, useCallback } from 'react';
import GameArea from './GameArea';
import WordChallenge from './WordChallenge';
import ScoreDisplay from './ScoreDisplay';
import FishInfo from './FishInfo';
import ThemeToggle from './ThemeToggle';
import CaughtFishHistory from './CaughtFishHistory';
import LevelSelector from './LevelSelector';
import GameStats from './GameStats';
import FishEncyclopedia from './FishEncyclopedia';
import { useTheme } from '../contexts/ThemeContext';
import { fishData, fishingWords, levelConfig } from '../data/mockData';
import './FishingGame.css';

const FishingGame = () => {
  const { theme } = useTheme();
  const [gameState, setGameState] = useState('waiting'); // waiting, fishing, typing, caught
  const [currentFish, setCurrentFish] = useState(null);
  const [currentWords, setCurrentWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [fishCaught, setFishCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFishInfo, setShowFishInfo] = useState(false);
  const [showCaughtHistory, setShowCaughtHistory] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [caughtFish, setCaughtFish] = useState(null);
  const [caughtFishHistory, setCaughtFishHistory] = useState([]);
  const [rodPosition, setRodPosition] = useState({ x: 50, y: 60 });
  const [isRodCast, setIsRodCast] = useState(false);
  
  // Statistics
  const [gameStats, setGameStats] = useState({
    totalTimeSpent: 0,
    totalLettersTyped: 0,
    totalWordsTyped: 0,
    totalMistakes: 0,
    gameStartTime: Date.now()
  });

  const selectRandomFish = useCallback(() => {
    const levelData = levelConfig[currentLevel] || levelConfig[1];
    const availableFish = levelData.availableFish;
    const fishTypes = availableFish;
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
      size: Math.random() * 0.5 + 0.8,
      caughtAt: new Date(),
      level: currentLevel
    };
  }, [currentLevel]);

  const startFishing = () => {
    setGameState('fishing');
    setIsRodCast(true);
    
    setTimeout(() => {
      const fish = selectRandomFish();
      setCurrentFish(fish);
      const levelData = levelConfig[currentLevel] || levelConfig[1];
      const wordsNeeded = Math.max(1, Math.floor(fish.difficulty * levelData.wordMultiplier));
      const selectedWords = fishingWords.sort(() => 0.5 - Math.random()).slice(0, wordsNeeded);
      setCurrentWords(selectedWords);
      setCurrentWordIndex(0);
      setTimeLeft(levelData.timeLimit);
      setGameState('typing');
    }, Math.random() * 3000 + 2000);
  };

  const onWordComplete = (word, mistakes = 0) => {
    // Update stats
    setGameStats(prev => ({
      ...prev,
      totalLettersTyped: prev.totalLettersTyped + word.length,
      totalWordsTyped: prev.totalWordsTyped + 1,
      totalMistakes: prev.totalMistakes + mistakes
    }));

    if (word === currentWords[currentWordIndex]) {
      if (currentWordIndex === currentWords.length - 1) {
        // Fish caught!
        const levelData = levelConfig[currentLevel] || levelConfig[1];
        const points = Math.floor(currentFish.difficulty * levelData.scoreMultiplier);
        setScore(prev => prev + points);
        setFishCaught(prev => prev + 1);
        
        const caughtFishData = { ...currentFish, points, caughtAt: new Date() };
        setCaughtFish(caughtFishData);
        setCaughtFishHistory(prev => [...prev, caughtFishData]);
        setShowFishInfo(true);
        setGameState('caught');
        
        // Check if level is completed
        if (!completedLevels.includes(currentLevel)) {
          const levelData = levelConfig[currentLevel];
          if (fishCaught + 1 >= levelData.fishRequired) {
            setCompletedLevels(prev => [...prev, currentLevel]);
          }
        }
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }
    }
  };

  const onTypingMistake = () => {
    setGameStats(prev => ({
      ...prev,
      totalMistakes: prev.totalMistakes + 1
    }));
    
    // Reduce time by 1 second for mistakes
    setTimeLeft(prev => Math.max(0, prev - 1));
  };

  const selectLevel = (level) => {
    if (level === 1 || completedLevels.includes(level - 1)) {
      setCurrentLevel(level);
      setShowLevelSelector(false);
      resetGame();
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

  // Update total time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        totalTimeSpent: Math.floor((Date.now() - prev.gameStartTime) / 1000)
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fishing-game ${theme}`}>
      <div className="game-header">
        <div className="header-left">
          <ThemeToggle />
          <button 
            className="level-selector-btn"
            onClick={() => setShowLevelSelector(true)}
          >
            📊 Level {currentLevel}
          </button>
        </div>
        <ScoreDisplay 
          score={score} 
          level={currentLevel} 
          fishCaught={fishCaught}
          timeLeft={timeLeft}
          gameState={gameState}
          onFishCounterClick={() => setShowCaughtHistory(true)}
        />
      </div>
      
      <GameArea 
        gameState={gameState}
        currentFish={currentFish}
        rodPosition={rodPosition}
        isRodCast={isRodCast}
        onStartFishing={startFishing}
        theme={theme}
        level={currentLevel}
        allFish={Object.keys(fishData)}
      />
      
      {gameState === 'typing' && (
        <WordChallenge 
          words={currentWords}
          currentWordIndex={currentWordIndex}
          onWordComplete={onWordComplete}
          onTypingMistake={onTypingMistake}
          timeLeft={timeLeft}
        />
      )}
      
      <GameStats stats={gameStats} />
      
      <FishEncyclopedia />
      
      {showFishInfo && caughtFish && (
        <FishInfo 
          fish={caughtFish}
          onClose={resetGame}
        />
      )}
      
      {showCaughtHistory && (
        <CaughtFishHistory 
          caughtFish={caughtFishHistory}
          onClose={() => setShowCaughtHistory(false)}
        />
      )}
      
      {showLevelSelector && (
        <LevelSelector 
          currentLevel={currentLevel}
          completedLevels={completedLevels}
          levelConfig={levelConfig}
          onSelectLevel={selectLevel}
          onClose={() => setShowLevelSelector(false)}
        />
      )}
    </div>
  );
};

export default FishingGame;