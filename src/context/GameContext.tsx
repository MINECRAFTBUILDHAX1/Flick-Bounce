
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the skin types
export interface Skin {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  requiredFlicks?: number;
}

// Define our context type
interface GameContextType {
  flicks: number;
  incrementFlicks: () => void;
  currentMilestone: number;
  nextMilestone: number;
  progress: number;
  skins: Skin[];
  activeSkin: string;
  setActiveSkin: (id: string) => void;
  unlockSkin: (id: string) => void;
  showShop: boolean;
  setShowShop: (show: boolean) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  ballPosition: { x: number, y: number };
  setBallPosition: (pos: { x: number, y: number }) => void;
}

// Create the context with default values
const GameContext = createContext<GameContextType>({
  flicks: 0,
  incrementFlicks: () => {},
  currentMilestone: 0,
  nextMilestone: 10,
  progress: 0,
  skins: [],
  activeSkin: 'default',
  setActiveSkin: () => {},
  unlockSkin: () => {},
  showShop: false,
  setShowShop: () => {},
  showHelp: false,
  setShowHelp: () => {},
  ballPosition: { x: 0, y: 0 },
  setBallPosition: () => {},
});

// Milestone calculator
const calculateMilestone = (flicks: number): number => {
  const milestones = [0, 10, 25, 50, 100, 250, 500, 1000];
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (flicks >= milestones[i]) {
      return milestones[i];
    }
  }
  return 0;
};

// Next milestone calculator
const calculateNextMilestone = (flicks: number): number => {
  const milestones = [0, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  for (let i = 0; i < milestones.length; i++) {
    if (milestones[i] > flicks) {
      return milestones[i];
    }
  }
  return milestones[milestones.length - 1] * 2; // Double the last milestone if we've exceeded all
};

// Calculate progress percentage
const calculateProgress = (flicks: number, currentMilestone: number, nextMilestone: number): number => {
  if (currentMilestone === nextMilestone) return 100;
  return ((flicks - currentMilestone) / (nextMilestone - currentMilestone)) * 100;
};

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flicks, setFlicks] = useState<number>(0);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [activeSkin, setActiveSkin] = useState<string>('default');
  const [ballPosition, setBallPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
  // Extended skins list
  const [skins, setSkins] = useState<Skin[]>([
    { id: 'default', name: 'Classic', icon: '◯', unlocked: true },
    { id: 'dotted', name: 'Dotted', icon: '⦿', unlocked: false, requiredFlicks: 10 },
    { id: 'bullseye', name: 'Bullseye', icon: '◎', unlocked: false, requiredFlicks: 25 },
    { id: 'checkered', name: 'Checkered', icon: '◍', unlocked: false, requiredFlicks: 50 },
    { id: 'spiral', name: 'Spiral', icon: '◌', unlocked: false, requiredFlicks: 100 },
    { id: 'star', name: 'Star', icon: '✧', unlocked: false, requiredFlicks: 250 },
    { id: 'double', name: 'Double Ring', icon: '⚆', unlocked: false, requiredFlicks: 500 },
    { id: 'triple', name: 'Triple Ring', icon: '◉', unlocked: false, requiredFlicks: 1000 },
    { id: 'diamond', name: 'Diamond', icon: '◈', unlocked: false, requiredFlicks: 2500 },
    { id: 'flower', name: 'Flower', icon: '✾', unlocked: false, requiredFlicks: 5000 },
    { id: 'void', name: 'Void', icon: '◐', unlocked: false, requiredFlicks: 10000 },
    { id: 'eclipse', name: 'Eclipse', icon: '◑', unlocked: false, requiredFlicks: 25000 },
    { id: 'cosmos', name: 'Cosmos', icon: '◬', unlocked: false, requiredFlicks: 50000 },
    { id: 'infinity', name: 'Infinity', icon: '◊', unlocked: false, requiredFlicks: 100000 },
    { id: 'quantum', name: 'Quantum', icon: '◫', unlocked: false, requiredFlicks: 250000 },
    { id: 'legendary', name: 'Legendary', icon: '◭', unlocked: false, requiredFlicks: 500000 },
    { id: 'mythical', name: 'Mythical', icon: '⬡', unlocked: false, requiredFlicks: 1000000 },
  ]);
  
  // Calculate current milestone based on flicks
  const currentMilestone = calculateMilestone(flicks);
  
  // Calculate next milestone based on flicks
  const nextMilestone = calculateNextMilestone(flicks);
  
  // Calculate progress percentage
  const progress = calculateProgress(flicks, currentMilestone, nextMilestone);
  
  // Increment flicks
  const incrementFlicks = () => {
    setFlicks(prev => prev + 1);
  };
  
  // Unlock a skin
  const unlockSkin = (id: string) => {
    setSkins(prevSkins => 
      prevSkins.map(skin => 
        skin.id === id ? { ...skin, unlocked: true } : skin
      )
    );
  };
  
  // Check for unlockable skins when flicks change
  useEffect(() => {
    skins.forEach(skin => {
      if (skin.requiredFlicks && flicks >= skin.requiredFlicks && !skin.unlocked) {
        unlockSkin(skin.id);
      }
    });
  }, [flicks]);
  
  // Save/load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('flickBallDashState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setFlicks(parsedState.flicks || 0);
      setActiveSkin(parsedState.activeSkin || 'default');
      setSkins(prevSkins => {
        if (parsedState.skins) {
          return prevSkins.map(skin => {
            const savedSkin = parsedState.skins.find((s: Skin) => s.id === skin.id);
            return savedSkin ? { ...skin, unlocked: savedSkin.unlocked } : skin;
          });
        }
        return prevSkins;
      });
    }
  }, []);
  
  // Save game state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('flickBallDashState', JSON.stringify({
      flicks,
      activeSkin,
      skins
    }));
  }, [flicks, activeSkin, skins]);
  
  return (
    <GameContext.Provider value={{
      flicks,
      incrementFlicks,
      currentMilestone,
      nextMilestone,
      progress,
      skins,
      activeSkin,
      setActiveSkin,
      unlockSkin,
      showShop,
      setShowShop,
      showHelp,
      setShowHelp,
      ballPosition,
      setBallPosition
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the context
export const useGame = () => useContext(GameContext);
