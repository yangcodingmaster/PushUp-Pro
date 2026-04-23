import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { StatsView } from './components/StatsView';
import { BottomNav } from './components/BottomNav';
import { DailyLog, AppState, ViewState } from './types';

const STORAGE_KEY = 'pushup-pro-data-v2';

const DEFAULT_STATE: AppState = {
  logs: [],
  dailyTarget: 50,
  shortcuts: [15, 20],
};

const getLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [view, setView] = useState<ViewState>('home');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        const v1 = localStorage.getItem('pushup-pro-data-v1');
        if (v1) {
            try {
                const parsedV1 = JSON.parse(v1);
                const migrated: AppState = {
                    logs: parsedV1.logs || [],
                    dailyTarget: parsedV1.dailyTarget || 50,
                    shortcuts: parsedV1.shortcut ? [parsedV1.shortcut, parsedV1.shortcut + 10] : [15, 20]
                };
                setState(migrated);
                setIsLoaded(true);
                return;
            } catch(e) {}
        }
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({
             logs: parsed.logs || [],
             dailyTarget: parsed.dailyTarget || 50,
             shortcuts: parsed.shortcuts || [15, 20]
        });
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const todayKey = getLocalDate();
  const currentCount = state.logs.find(l => l.date === todayKey)?.count || 0;

  const handleIncrement = (amount: number) => {
    setState(prev => {
      const existingLogIndex = prev.logs.findIndex(l => l.date === todayKey);
      let newLogs = [...prev.logs];
      
      if (existingLogIndex >= 0) {
        const newCount = Math.max(0, newLogs[existingLogIndex].count + amount);
        newLogs[existingLogIndex] = { ...newLogs[existingLogIndex], count: newCount };
      } else {
        if (amount > 0) {
           newLogs.push({ date: todayKey, count: amount });
        }
      }
      return { ...prev, logs: newLogs };
    });
  };

  const handleResetDaily = () => {
      setState(prev => {
          const newLogs = prev.logs.filter(l => l.date !== todayKey);
          newLogs.push({ date: todayKey, count: 0 });
          return { ...prev, logs: newLogs };
      });
  };

  const handleUpdateTarget = (newTarget: number) => {
      setState(prev => ({ ...prev, dailyTarget: newTarget }));
  };

  const handleUpdateShortcuts = (newShortcuts: number[]) => {
      setState(prev => ({ ...prev, shortcuts: newShortcuts }));
  };

  if (!isLoaded) return null;

  return (
    <div className="relative h-[100dvh] w-full bg-[#eef0f4] overflow-hidden font-sans">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-20%] w-[80vh] h-[80vh] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-20%] w-[80vh] h-[80vh] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob-delayed"></div>
      </div>

      {/* Main Content with 3D Container */}
      <div 
        className="relative z-10 h-full w-full flex flex-col max-w-lg mx-auto"
        style={{
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <Header />
        
        {/* 3D Flip Scene */}
        <div className="flex-1 mt-4 mx-8 min-h-0 relative perspective-2000 mb-6">
           <div 
             className={`w-full h-full relative preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${view === 'stats' ? 'rotate-y-180' : ''}`}
           >
              {/* Front Face: Home */}
              <div className="absolute inset-0 backface-hidden z-20">
                <HomeView 
                 count={currentCount}
                 target={state.dailyTarget}
                 shortcuts={state.shortcuts}
                 onIncrement={handleIncrement}
                 onUpdateShortcuts={handleUpdateShortcuts}
                 onUpdateTarget={handleUpdateTarget}
                 onReset={handleResetDaily}
               />
              </div>

              {/* Back Face: Stats */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 z-10">
                <StatsView logs={state.logs} />
              </div>
           </div>
        </div>
      </div>

      <BottomNav currentView={view} onNavigate={setView} />
    </div>
  );
}

export default App;