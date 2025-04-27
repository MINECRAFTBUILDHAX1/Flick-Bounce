
import React from 'react';
import { useGame } from '../context/GameContext';

const ScoreDisplay: React.FC = () => {
  const { flicks } = useGame();

  return (
    <div className="absolute top-4 left-0 right-0 mx-auto w-40 text-center">
      <div className="flex flex-col items-center space-y-1">
        <p className="text-sm font-semibold text-gray-500">FLICKS</p>
        <h1 className="text-4xl font-bold">{flicks}</h1>
      </div>
    </div>
  );
};

export default ScoreDisplay;
