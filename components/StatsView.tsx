import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/Card';
import { DailyLog } from '../types';

interface StatsViewProps {
  logs: DailyLog[];
}

export const StatsView: React.FC<StatsViewProps> = ({ logs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const startingEmptyCells = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getLogForDay = (day: number) => {
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
    return logs.find(l => l.date === dateKey);
  };

  return (
    <div className="h-full w-full pb-28">
      <Card className="h-full flex flex-col p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Statistics</h2>
            <div className="flex items-center gap-2 bg-white/20 rounded-full p-1 pl-3 pr-1 border border-white/30 shadow-inner">
                <span className="text-sm font-semibold text-gray-700 w-24 text-center">
                    {monthName} {year}
                </span>
                <div className="flex">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/50 rounded-full transition-all text-gray-600">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/50 rounded-full transition-all text-gray-600">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-6 gap-x-2 flex-1 content-start">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {d}
                </div>
            ))}

            {startingEmptyCells.map((_, i) => (
                <div key={`empty-${i}`} />
            ))}

            {days.map(day => {
                const log = getLogForDay(day);
                const hasCount = log && log.count > 0;
                
                return (
                    <div key={day} className="flex flex-col items-center gap-1 group">
                        <div 
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                ${hasCount 
                                    ? 'bg-emerald-400/20 text-emerald-800 shadow-[0_4px_10px_rgba(52,211,153,0.3)] border border-emerald-400/30' 
                                    : 'text-gray-500 hover:bg-white/20'}
                            `}
                        >
                            {day}
                        </div>
                        {hasCount && (
                             <span className="text-[9px] text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-4 bg-white/90 px-1 rounded shadow-sm pointer-events-none">
                                 {log.count}
                             </span>
                        )}
                    </div>
                );
            })}
        </div>
      </Card>
    </div>
  );
};