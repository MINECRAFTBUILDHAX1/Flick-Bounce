
import React, { useRef, useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

interface BallProps {
  gameAreaRef: React.RefObject<HTMLDivElement>;
}

const Ball: React.FC<BallProps> = ({ gameAreaRef }) => {
  const { flicks, incrementFlicks, skins, activeSkin, showShop, showHelp, setBallPosition } = useGame();
  const ballRef = useRef<HTMLDivElement>(null);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get the active skin
  const currentSkin = skins.find(skin => skin.id === activeSkin) || skins[0];
  
  // Initialize ball position
  useEffect(() => {
    if (gameAreaRef.current && ballRef.current) {
      const gameRect = gameAreaRef.current.getBoundingClientRect();
      const ballRect = ballRef.current.getBoundingClientRect();
      
      const centerX = (gameRect.width - ballRect.width) / 2;
      const centerY = (gameRect.height - ballRect.height) / 2;
      
      setPosition({ x: centerX, y: centerY });
    }
  }, []);
  
  // Update position based on velocity
  useEffect(() => {
    if (velocity.x === 0 && velocity.y === 0) return;
    
    const friction = 0.95; // Friction coefficient
    const animationFrame = requestAnimationFrame(() => {
      if (gameAreaRef.current && ballRef.current) {
        const gameRect = gameAreaRef.current.getBoundingClientRect();
        const ballRect = ballRef.current.getBoundingClientRect();
        
        // Calculate new position with velocity
        let newX = position.x + velocity.x;
        let newY = position.y + velocity.y;
        
        // Check boundaries
        if (newX < 0) {
          newX = 0;
          setVelocity(prev => ({ ...prev, x: -prev.x * 0.7 })); // Bounce with reduced velocity
          setIsAnimating(true);
        } else if (newX > gameRect.width - ballRect.width) {
          newX = gameRect.width - ballRect.width;
          setVelocity(prev => ({ ...prev, x: -prev.x * 0.7 }));
          setIsAnimating(true);
        }
        
        if (newY < 0) {
          newY = 0;
          setVelocity(prev => ({ ...prev, y: -prev.y * 0.7 }));
          setIsAnimating(true);
        } else if (newY > gameRect.height - ballRect.height) {
          newY = gameRect.height - ballRect.height;
          setVelocity(prev => ({ ...prev, y: -prev.y * 0.7 }));
          setIsAnimating(true);
        }
        
        // Apply friction
        setVelocity(prev => ({
          x: Math.abs(prev.x) < 0.1 ? 0 : prev.x * friction,
          y: Math.abs(prev.y) < 0.1 ? 0 : prev.y * friction
        }));
        
        // Update position
        setPosition({ x: newX, y: newY });
        
        // Update context with normalized position (0-1)
        setBallPosition({ 
          x: newX / (gameRect.width - ballRect.width),
          y: newY / (gameRect.height - ballRect.height)
        });
      }
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [position, velocity, setBallPosition]);
  
  // Reset animation flag after animation ends
  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);
  
  // Handle mouse/touch down
  const handleStart = (clientX: number, clientY: number) => {
    if (showShop || showHelp) return; // Don't allow interaction when menus are open
    
    if (ballRef.current) {
      const ballRect = ballRef.current.getBoundingClientRect();
      setStartPos({ 
        x: clientX - ballRect.left, 
        y: clientY - ballRect.top 
      });
      setIsDragging(true);
      setVelocity({ x: 0, y: 0 }); // Stop current motion
    }
  };
  
  // Handle mouse/touch move
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || showShop || showHelp) return;
    
    if (gameAreaRef.current && ballRef.current) {
      const gameRect = gameAreaRef.current.getBoundingClientRect();
      const ballRect = ballRef.current.getBoundingClientRect();
      
      // Calculate new position ensuring ball stays within boundaries
      const newX = Math.max(0, Math.min(gameRect.width - ballRect.width, 
        clientX - gameRect.left - startPos.x));
      const newY = Math.max(0, Math.min(gameRect.height - ballRect.height, 
        clientY - gameRect.top - startPos.y));
      
      setPosition({ x: newX, y: newY });
      
      // Update context with normalized position (0-1)
      setBallPosition({ 
        x: newX / (gameRect.width - ballRect.width),
        y: newY / (gameRect.height - ballRect.height)
      });
    }
  };
  
  // Handle mouse/touch end
  const handleEnd = (clientX: number, clientY: number) => {
    if (!isDragging || showShop || showHelp) return;
    
    setIsDragging(false);
    
    if (ballRef.current) {
      const ballRect = ballRef.current.getBoundingClientRect();
      
      // Calculate velocity based on distance from start position
      const endX = clientX - ballRect.left;
      const endY = clientY - ballRect.top;
      
      // Distance moved
      const dx = endX - startPos.x;
      const dy = endY - startPos.y;
      
      // Only count as a flick if there was enough movement
      const minFlickDistance = 5;
      if (Math.abs(dx) > minFlickDistance || Math.abs(dy) > minFlickDistance) {
        incrementFlicks();
        setIsAnimating(true);
        
        // Set velocity based on flick distance and direction
        setVelocity({ 
          x: dx * 0.2, // Scale factor to control sensitivity
          y: dy * 0.2
        });
      }
    }
  };
  
  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };
  
  const onMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX, e.clientY);
  };
  
  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };
  
  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      handleEnd(touch.clientX, touch.clientY);
    }
  };
  
  return (
    <div 
      ref={ballRef}
      className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-4xl
        select-none cursor-grab transition-transform
        ${isDragging ? 'cursor-grabbing' : ''}
        ${isAnimating ? 'animate-ball-bounce' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: '#222',
        color: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        touchAction: 'none'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {currentSkin.icon}
    </div>
  );
};

export default Ball;
