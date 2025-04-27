
import React from 'react';
import { useGame } from '../context/GameContext';

const HelpMenu: React.FC = () => {
  const { showHelp, setShowHelp } = useGame();

  // Close the help when clicked outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowHelp(false);
    }
  };

  return (
    <>
      {/* Help button */}
      <div 
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 
          flex items-center justify-center cursor-pointer
          hover:bg-gray-300 transition-colors"
        onClick={() => setShowHelp(true)}
      >
        <span className="text-sm font-bold">?</span>
      </div>

      {/* Help modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white p-6 rounded-lg w-80 max-w-full animate-pop">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Play</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowHelp(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">Flicking the Ball</h3>
                <p className="text-sm text-gray-700">
                  Drag and release the ball to flick it. The speed and direction of your flick determines how the ball moves.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-1">Flicks & Milestones</h3>
                <p className="text-sm text-gray-700">
                  Each time you flick the ball, your score increases. Reach milestones to unlock new ball skins.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-1">Ball Skins</h3>
                <p className="text-sm text-gray-700">
                  Click the hanger icon to open the skin shop. New skins unlock as you reach certain milestones.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-1">Tips</h3>
                <ul className="text-sm text-gray-700 list-disc pl-5">
                  <li>The ball will bounce off the edges</li>
                  <li>Flick harder for more speed</li>
                  <li>Try to reach 1000 flicks to unlock all skins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpMenu;
