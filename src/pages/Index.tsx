
import React, { useRef, useEffect } from 'react';
import { GameProvider } from '../context/GameContext';
import Ball from '../components/Ball';
import ScoreDisplay from '../components/ScoreDisplay';
import ProgressBar from '../components/ProgressBar';
import SkinShop from '../components/SkinShop';
import HelpMenu from '../components/HelpMenu';

const Game: React.FC = () => {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Prevent scrolling when touching the game on mobile
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener('touchmove', preventDefault, { passive: false });
    }

    return () => {
      if (gameArea) {
        gameArea.removeEventListener('touchmove', preventDefault);
      }
    };
  }, []);

  return (
    <div 
      ref={gameAreaRef}
      className="relative w-full h-screen bg-gray-50 overflow-hidden"
    >
      {/* Game components */}
      <ScoreDisplay />
      <ProgressBar />
      <Ball gameAreaRef={gameAreaRef} />
      <SkinShop />
      <HelpMenu />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default Index;
