
import React from 'react';
import { useGame } from '../context/GameContext';

const ProgressBar: React.FC = () => {
  const { currentMilestone, nextMilestone, progress } = useGame();

  return (
    <div className="absolute top-20 left-4 right-4 mx-auto">
      <div className="flex items-center space-x-2">
        {/* Current milestone circle */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300">
          <span className="text-xs font-semibold">{currentMilestone}</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Next milestone circle */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300">
          <span className="text-xs font-semibold">{nextMilestone}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
