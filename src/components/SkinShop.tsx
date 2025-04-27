
import React from 'react';
import { useGame } from '../context/GameContext';

const SkinShop: React.FC = () => {
  const { skins, activeSkin, setActiveSkin, showShop, setShowShop, flicks } = useGame();

  // Close the shop when clicked outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowShop(false);
    }
  };

  return (
    <>
      {/* Shop button */}
      <div 
        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black 
          flex items-center justify-center text-white cursor-pointer
          hover:bg-gray-800 transition-colors"
        onClick={() => setShowShop(true)}
      >
        <span className="text-xl">⋔</span> {/* Hanger symbol */}
      </div>

      {/* Shop modal */}
      {showShop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white p-6 rounded-lg w-80 max-w-full animate-pop">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ball Skins</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowShop(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {skins.map((skin) => (
                <div
                  key={skin.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer
                    ${activeSkin === skin.id ? 'border-black' : 'border-gray-200'}
                    ${!skin.unlocked ? 'opacity-60' : 'hover:bg-gray-100'}`}
                  onClick={() => {
                    if (skin.unlocked) {
                      setActiveSkin(skin.id);
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl mb-2">
                      {skin.icon}
                    </div>
                    <p className="text-sm font-medium">{skin.name}</p>
                    {!skin.unlocked && skin.requiredFlicks && (
                      <p className="text-xs text-gray-500 mt-1">
                        {skin.requiredFlicks} flicks required
                        {flicks < skin.requiredFlicks && 
                          ` (${skin.requiredFlicks - flicks} more)`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkinShop;
