import React from 'react';
import { Home, BarChart2 } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    // Width 70% (w-[70%])
    // Floating (bottom-8)
    // Pill Shape (rounded-full)
    // Glass (backdrop-blur-xl)
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[70%] max-w-[280px]">
      <div className="relative flex items-center justify-between px-2 py-2 bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full">
        
        {/* Elastic Liquid Indicator */}
        <div 
            className={`
                absolute top-2 bottom-2 w-[calc(50%-8px)] rounded-full bg-white shadow-md transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)
                ${currentView === 'home' ? 'left-2' : 'left-[calc(50%+4px)]'}
            `}
        />

        {/* Home Button */}
        <button
          onClick={() => onNavigate('home')}
          className="relative z-10 w-1/2 flex items-center justify-center py-3 rounded-full transition-colors duration-300"
        >
          <Home 
            size={24} 
            className={`transition-all duration-300 ${currentView === 'home' ? 'text-black stroke-[2.5px]' : 'text-gray-400'}`} 
          />
        </button>

        {/* Stats Button */}
        <button
          onClick={() => onNavigate('stats')}
          className="relative z-10 w-1/2 flex items-center justify-center py-3 rounded-full transition-colors duration-300"
        >
          <BarChart2 
            size={24} 
            className={`transition-all duration-300 ${currentView === 'stats' ? 'text-black stroke-[2.5px]' : 'text-gray-400'}`} 
          />
        </button>
      </div>
    </div>
  );
};