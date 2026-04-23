import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface ProgressCardProps {
  current: number;
  target: number;
  onUpdateTarget: (newTarget: number) => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  current,
  target,
  onUpdateTarget,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTarget, setTempTarget] = useState(target.toString());

  // Calculations for Ring
  const radius = 115;
  const stroke = 18;
  const normalizedRadius = radius - stroke; 
  const circumference = normalizedRadius * 2 * Math.PI;
  const size = radius * 2;
  
  const percentage = Math.round((current / target) * 100);
  const isOverachiever = percentage > 100;
  
  const primaryPercent = Math.min(percentage, 100);
  const primaryOffset = circumference - (primaryPercent / 100) * circumference;

  const secondaryPercent = isOverachiever ? percentage % 100 : 0;
  const secondaryOffset = circumference - (secondaryPercent / 100) * circumference;
  
  const secondaryDisplayOffset = (isOverachiever && secondaryPercent === 0) ? 0 : secondaryOffset;


  const handleSave = () => {
    const val = parseInt(tempTarget, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateTarget(val);
    }
    setIsModalOpen(false);
  };

  return (
    <Card className="flex flex-col relative h-full items-center justify-between">
      <div className="w-full flex justify-between items-start absolute top-3 sm:top-6 px-3 sm:px-6 left-0 z-10">
        <div className="flex items-center gap-1.5 sm:gap-2">
             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                 <Target size={16} className="sm:w-[18px] sm:h-[18px]" />
             </div>
            <span className="text-[10px] sm:text-sm font-semibold text-green-600 uppercase tracking-wider">Goal</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs sm:text-xs font-semibold bg-gray-100/50 hover:bg-gray-200/80 text-gray-600 rounded-full px-3 h-7 sm:h-8 backdrop-blur-sm"
          onClick={() => {
            setTempTarget(target.toString());
            setIsModalOpen(true);
          }}
        >
          Edit
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center w-full relative mt-8 sm:mt-6">
        <div className="relative flex items-center justify-center w-full h-full p-2">
            {/* SVG Ring Container */}
            <svg
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 overflow-visible w-full h-full max-h-[220px]" 
                preserveAspectRatio="xMidYMid meet"
            >
             <defs>
                {/* Apple Health style gradient: Light Green -> Dark Green */}
                <linearGradient id="gradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6EE7B7" /> {/* Emerald 300 */}
                    <stop offset="50%" stopColor="#10B981" /> {/* Emerald 500 */}
                    <stop offset="100%" stopColor="#047857" /> {/* Emerald 700 */}
                </linearGradient>
                
                {/* Drop Shadow Filter for the Ring */}
                <filter id="ringShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10B981" floodOpacity="0.3"/>
                </filter>
            </defs>

            {/* Background Circle */}
            <circle
                stroke="#E5E7EB"
                strokeWidth={stroke}
                fill="transparent"
                r={normalizedRadius}
                cx="50%"
                cy="50%"
                className="opacity-50"
            />

            {/* Progress Circle with Shadow and Gradient */}
            <circle
                stroke="url(#gradientPrimary)"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset: primaryOffset }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx="50%"
                cy="50%"
                className="ring-circle"
                filter="url(#ringShadow)"
            />

            {/* Overachiever Circle (Wrap around) */}
            {isOverachiever && (
                 <circle
                    stroke="#064E3B"
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset: secondaryDisplayOffset }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx="50%"
                    cy="50%"
                    className="ring-circle opacity-80"
                />
            )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className={`text-5xl sm:text-6xl font-black tracking-tighter ${isOverachiever ? 'text-green-700' : 'text-gray-900'}`}>
                    {percentage}%
                 </span>
                 <span className="text-gray-500 font-medium text-sm sm:text-sm mt-1">
                    of {target}
                 </span>
            </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Daily Goal"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            How many push-ups do you want to achieve daily?
          </p>
          <div className="space-y-1">
            <input
              type="number"
              value={tempTarget}
              onChange={(e) => setTempTarget(e.target.value)}
              className="w-full px-4 py-3 text-2xl font-bold text-center border border-gray-200 bg-white/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none backdrop-blur-sm transition-all"
              autoFocus
            />
          </div>
          <div className="pt-4">
            <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 shadow-lg shadow-green-600/20 active:scale-[0.96] transition-all duration-200" 
                onClick={handleSave}
            >
              Update Goal
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};