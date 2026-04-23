import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { Card } from './ui/Card';
import { DailyLog, ChartView } from '../types';
import { BarChart3 } from 'lucide-react';

interface HistoryCardProps {
  logs: DailyLog[];
}

const toLocalISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const HistoryCard: React.FC<HistoryCardProps> = ({ logs }) => {
  const [view, setView] = useState<ChartView>(ChartView.WEEK);

  const chartData = useMemo(() => {
    const today = new Date();
    const logMap = new Map<string, number>();
    logs.forEach(log => {
        logMap.set(log.date, log.count);
    });

    if (view === ChartView.WEEK) {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const iso = toLocalISO(d);
        data.push({
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: iso,
          count: logMap.get(iso) || 0,
        });
      }
      return data;
    } 
    
    if (view === ChartView.MONTH) {
      const data = [];
      for (let i = 3; i >= 0; i--) {
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() - (i * 7));
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        
        let total = 0;
        const temp = new Date(startDate);
        while (temp <= endDate) {
            const iso = toLocalISO(temp);
            total += logMap.get(iso) || 0;
            temp.setDate(temp.getDate() + 1);
        }

        data.push({
          label: `${startDate.getDate()}/${startDate.getMonth()+1}`,
          count: total,
        });
      }
      return data;
    }

    if (view === ChartView.YEAR) {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = d.getMonth();
            const yearKey = d.getFullYear();
            
            let total = 0;
            logs.forEach(log => {
                const [y, m] = log.date.split('-').map(Number);
                if (m - 1 === monthKey && y === yearKey) {
                    total += log.count;
                }
            });

            data.push({
                label: d.toLocaleDateString('en-US', { month: 'short' }),
                count: total
            });
        }
        return data;
    }

    return [];
  }, [logs, view]);


  const viewTotal = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const viewAvg = Math.round(viewTotal / (chartData.length || 1));

  return (
    // h-full ensures it fills the flex container in App.tsx
    <Card className="w-full flex flex-col h-full">
      <div className="flex flex-row justify-between items-center mb-2 sm:mb-6 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                 <BarChart3 size={16} className="sm:w-[18px] sm:h-[18px]" />
             </div>
            <div>
                 <span className="text-[10px] sm:text-sm font-semibold text-blue-600 uppercase tracking-wider block">Stats</span>
                 <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Avg: {viewAvg}</span>
            </div>
        </div>
        
        <div className="bg-gray-100 p-0.5 sm:p-1 rounded-lg flex gap-0.5 sm:gap-1">
          {Object.values(ChartView).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 sm:px-4 py-1.5 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-xs font-bold transition-all ${
                view === v
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {view === ChartView.WEEK ? (
             <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                />
                <Tooltip 
                    cursor={{ stroke: '#D1D5DB', strokeWidth: 1 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#2563EB" 
                    strokeWidth={4} 
                    dot={{ fill: '#2563EB', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
             </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              />
              <Tooltip 
                 cursor={{ fill: '#F3F4F6' }}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
              />
              <Bar 
                dataKey="count" 
                fill="#3B82F6" 
                radius={[4, 4, 4, 4]} 
                barSize={32}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};