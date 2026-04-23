import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Flame, Trophy, TrendingUp } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card } from './ui/Card';
import { DailyLog } from '../types';

interface StatsViewProps {
  logs: DailyLog[];
}

const formatDateKey = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const computeStreaks = (logs: DailyLog[]) => {
  const counts = new Map(logs.map(l => [l.date, l.count]));
  const activeDates = logs.filter(l => l.count > 0).map(l => l.date).sort();

  // Best streak (all time)
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const dateStr of activeDates) {
    const d = new Date(dateStr + 'T00:00:00');
    if (prev) {
      const diff = Math.round((d.getTime() - prev.getTime()) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = d;
  }

  // Current streak (ending today or yesterday)
  let current = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);
  const yest = new Date(today);
  yest.setDate(yest.getDate() - 1);
  const yestKey = formatDateKey(yest);

  let cursor: Date;
  if ((counts.get(todayKey) || 0) > 0) {
    cursor = new Date(today);
  } else if ((counts.get(yestKey) || 0) > 0) {
    cursor = new Date(yest);
  } else {
    cursor = new Date(today);
    cursor.setDate(cursor.getDate() - 10000); // sentinel: nothing
  }

  while ((counts.get(formatDateKey(cursor)) || 0) > 0) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, best };
};

export const StatsView: React.FC<StatsViewProps> = ({ logs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

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

  const { current: currentStreak, best: bestStreak } = useMemo(
    () => computeStreaks(logs),
    [logs]
  );

  // This week total (last 7 days including today)
  const weekTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const log = logs.find(l => l.date === formatDateKey(d));
      if (log) total += log.count;
    }
    return total;
  }, [logs]);

  // 30-day trend data
  const trendData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out: { date: string; label: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const log = logs.find(l => l.date === key);
      out.push({
        date: key,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        count: log?.count || 0,
      });
    }
    return out;
  }, [logs]);

  // Selected-month stats
  const monthStats = useMemo(() => {
    const monthLogs = logs.filter(l => {
      const [y, m] = l.date.split('-');
      return parseInt(y) === currentDate.getFullYear() && parseInt(m) === currentDate.getMonth() + 1;
    });
    const active = monthLogs.filter(l => l.count > 0);
    const total = active.reduce((s, l) => s + l.count, 0);
    const max = active.reduce((m, l) => Math.max(m, l.count), 0);
    const avg = active.length > 0 ? Math.round(total / active.length) : 0;
    return { total, avg, max };
  }, [logs, currentDate]);

  return (
    <div className="h-full w-full pb-28">
      <Card className="h-full flex flex-col p-5 overflow-y-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Statistics</h2>
          <div className="flex items-center gap-1 bg-white/20 rounded-full p-1 pl-3 border border-white/30 shadow-inner">
            <span className="text-xs font-semibold text-gray-700 w-20 text-center">
              {monthName} {year}
            </span>
            <div className="flex">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/50 rounded-full transition-all text-gray-600">
                <ChevronLeft size={14} />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/50 rounded-full transition-all text-gray-600">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Streak + week row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatChip
            icon={<Flame size={14} className="text-orange-500" />}
            label="Streak"
            value={currentStreak}
            unit="d"
          />
          <StatChip
            icon={<Trophy size={14} className="text-amber-500" />}
            label="Best"
            value={bestStreak}
            unit="d"
          />
          <StatChip
            icon={<TrendingUp size={14} className="text-emerald-500" />}
            label="Week"
            value={weekTotal}
          />
        </div>

        {/* 30-day trend chart */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Last 30 days
          </div>
          <div className="h-20 w-full bg-white/20 rounded-2xl border border-white/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" hide />
                <Tooltip
                  cursor={{ fill: 'rgba(16,185,129,0.08)' }}
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: 600 }}
                  formatter={(value: number) => [value, 'Reps']}
                />
                <Bar dataKey="count" fill="url(#trendFill)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Month summary */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            {monthName} Summary
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SummaryStat label="Total" value={monthStats.total} />
            <SummaryStat label="Avg/day" value={monthStats.avg} />
            <SummaryStat label="Max" value={monthStats.max} />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-2 content-start">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
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

const StatChip: React.FC<{ icon: React.ReactNode; label: string; value: number; unit?: string }> = ({
  icon,
  label,
  value,
  unit,
}) => (
  <div className="bg-white/30 border border-white/40 rounded-2xl px-3 py-2.5 flex flex-col gap-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-xl font-bold text-gray-900 tracking-tight">
      {value}
      {unit && <span className="text-xs font-medium text-gray-500 ml-0.5">{unit}</span>}
    </div>
  </div>
);

const SummaryStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-white/20 border border-white/30 rounded-2xl px-3 py-2 text-center">
    <div className="text-lg font-bold text-gray-900 leading-tight">{value}</div>
    <div className="text-[10px] font-medium text-gray-500 tracking-wide">{label}</div>
  </div>
);
