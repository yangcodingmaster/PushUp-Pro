import React, { useState } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface CountCardProps {
  count: number;
  shortcut: number;
  onIncrement: (amount: number) => void;
  onUpdateShortcut: (newShortcut: number) => void;
  onReset: () => void;
}

export const CountCard: React.FC<CountCardProps> = ({
  count,
  shortcut,
  onIncrement,
  onUpdateShortcut,
  onReset,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempShortcut, setTempShortcut] = useState<string>(shortcut.toString());

  const handleSaveSettings = () => {
    const newVal = parseInt(tempShortcut, 10);
    
    if (!isNaN(newVal) && newVal > 0) {
      onUpdateShortcut(newVal);
    } else {
      onUpdateShortcut(10); // Default fallback
    }
    setIsSettingsOpen(false);
  };

  return (
    <Card className="flex flex-col relative h-full justify-between group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <span className="text-[10px] sm:text-sm font-semibold text-orange-600 uppercase tracking-wider leading-tight">Daily Count</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setTempShortcut(shortcut.toString());
            setIsSettingsOpen(true);
          }}
          className="text-gray-400 hover:text-gray-600 w-8 h-8 sm:w-10 sm:h-10 hover:bg-white/50 backdrop-blur-sm"
        >
          <Settings size={20} className="sm:w-5 sm:h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <span className="text-7xl sm:text-8xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">
          {count}
        </span>
        <span className="text-gray-500 font-medium text-sm sm:text-base mt-2">push-ups</span>
      </div>

      <div className="w-full">
          <Button
            variant="secondary"
            onClick={() => onIncrement(shortcut)}
            className="w-full h-14 sm:h-16 text-2xl sm:text-2xl font-bold bg-white text-gray-900 
                       shadow-[0_8px_20px_rgb(0,0,0,0.08)] 
                       hover:shadow-[0_12px_24px_rgb(0,0,0,0.12)] hover:-translate-y-0.5
                       active:translate-y-0.5 active:shadow-[0_2px_4px_rgb(0,0,0,0.05)] active:scale-[0.98] 
                       transform transition-all duration-150 rounded-xl sm:rounded-2xl border border-gray-100"
          >
            +{shortcut}
          </Button>
      </div>

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Quick Add Settings"
      >
        <div className="space-y-6">
          <p className="text-gray-600 text-sm">
            Set the value for your quick add button.
          </p>
          <div className="space-y-2">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Shortcut Value
             </label>
             <input
                type="number"
                value={tempShortcut}
                onChange={(e) => setTempShortcut(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-200 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="e.g. 10"
             />
          </div>
          
          <div className="pt-2 flex gap-3">
             <Button 
                variant="outline" 
                className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 shadow-sm active:scale-[0.96] transition-transform" 
                onClick={() => {
                    onReset();
                    setIsSettingsOpen(false);
                }}
             >
                <RotateCcw size={16} className="mr-2"/> Reset Today
             </Button>
            <Button 
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12 shadow-lg shadow-orange-600/20 active:scale-[0.96] transition-all duration-200" 
                onClick={handleSaveSettings}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};