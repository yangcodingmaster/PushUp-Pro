import React, { useState } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface HomeViewProps {
  count: number;
  target: number;
  shortcuts: number[];
  onIncrement: (amount: number) => void;
  onUpdateShortcuts: (newShortcuts: number[]) => void;
  onUpdateTarget: (newTarget: number) => void;
  onReset: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  count,
  target,
  shortcuts,
  onIncrement,
  onUpdateShortcuts,
  onUpdateTarget,
  onReset,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempTarget, setTempTarget] = useState(target.toString());
  const [tempShortcuts, setTempShortcuts] = useState<string[]>(shortcuts.map(s => s.toString()));

  // Ring Calculations
  const radius = 120;
  const stroke = 24;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const size = radius * 2;
  
  const percentage = Math.min(Math.round((count / target) * 100), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleSaveSettings = () => {
    const newTargetVal = parseInt(tempTarget, 10);
    const newShortcutVals = tempShortcuts.map(s => parseInt(s, 10));

    if (!isNaN(newTargetVal) && newTargetVal > 0) {
      onUpdateTarget(newTargetVal);
    }
    
    if (newShortcutVals.every(s => !isNaN(s) && s > 0)) {
        onUpdateShortcuts(newShortcutVals);
    }

    setIsSettingsOpen(false);
  };

  return (
    <div className="h-full w-full flex flex-col pb-28"> 
      {/* Added bottom padding for floating nav clearance */}
      
      <Card className="flex-1 flex flex-col relative overflow-hidden justify-between p-6">
        
        {/* Settings Icon - Glass Button */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={() => {
                setTempTarget(target.toString());
                setTempShortcuts(shortcuts.map(s => s.toString()));
                setIsSettingsOpen(true);
            }}
            className="p-3 bg-white/10 hover:bg-white/20 text-gray-600 rounded-full transition-colors backdrop-blur-md"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Center Content: Ring & Count */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
          <div className="relative">
            {/* 
                Shadow Physics: 
                The ring casts a colored shadow ONTO the glass card.
            */}
            <div 
                className="absolute inset-0 rounded-full opacity-60 transition-all duration-700"
                style={{
                    boxShadow: `0 0 40px 10px rgba(16, 185, 129, 0.3)`, 
                    transform: 'scale(0.85)'
                }}
            ></div>
            
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 drop-shadow-xl" 
                style={{ filter: 'drop-shadow(0px 10px 10px rgba(16, 185, 129, 0.2))' }}
            >
                <defs>
                    {/* Conic Gradient approximation using linear for SVG stroke */}
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>

                {/* Track */}
                <circle
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={size / 2}
                    cy={size / 2}
                />

                {/* Progress */}
                <circle
                    stroke="url(#progressGradient)"
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={size / 2}
                    cy={size / 2}
                    className="ring-circle"
                />
            </svg>

            {/* Centered Number ONLY (No Label) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[6rem] font-bold text-gray-900 tracking-tighter leading-none mix-blend-overlay">
                    {count}
                </span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Pill Shaped (Rounded-Full) */}
        <div className="w-full flex gap-4 mt-8 mb-6">
            {shortcuts.map((val, idx) => (
                 <button
                    key={idx}
                    onClick={() => onIncrement(val)}
                    className="flex-1 h-[72px] rounded-full text-3xl font-bold 
                               bg-white/40 hover:bg-white/60 text-gray-900 
                               backdrop-blur-md shadow-[0_8px_16px_rgba(0,0,0,0.05)]
                               active:scale-[0.96] transition-all duration-200 border border-white/40"
                  >
                    +{val}
                  </button>
            ))}
        </div>
      </Card>

      {/* Configuration Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings"
      >
        {/* Radius System: Nested Radius R-P (32-16 = 16px approx) -> rounded-2xl */}
        <div className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                  Daily Goal
             </label>
             <input
                type="number"
                value={tempTarget}
                onChange={(e) => setTempTarget(e.target.value)}
                className="w-full px-4 py-4 text-xl font-medium border border-gray-100 bg-gray-50/80 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                    Left +
                </label>
                <input
                    type="number"
                    value={tempShortcuts[0]}
                    onChange={(e) => {
                        const newArr = [...tempShortcuts];
                        newArr[0] = e.target.value;
                        setTempShortcuts(newArr);
                    }}
                    className="w-full px-4 py-4 text-xl font-medium border border-gray-100 bg-gray-50/80 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                    Right +
                </label>
                <input
                    type="number"
                    value={tempShortcuts[1]}
                    onChange={(e) => {
                        const newArr = [...tempShortcuts];
                        newArr[1] = e.target.value;
                        setTempShortcuts(newArr);
                    }}
                    className="w-full px-4 py-4 text-xl font-medium border border-gray-100 bg-gray-50/80 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                />
            </div>
          </div>
          
          <div className="pt-4 flex gap-3">
             <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl border-red-200/50 text-red-600 hover:bg-red-50" 
                onClick={() => {
                    onReset();
                    setIsSettingsOpen(false);
                }}
             >
                <RotateCcw size={18} className="mr-2"/> Reset
             </Button>
            <Button 
                className="flex-1 bg-gray-900 hover:bg-black text-white h-14 rounded-2xl shadow-lg" 
                onClick={handleSaveSettings}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};