import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Update the date every minute to handle day changes if the app stays open
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="px-4 pt-2 pb-2 flex-shrink-0">
      <h1 className="text-[13px] font-semibold text-gray-500 uppercase tracking-widest mb-0.5 opacity-80">
        {weekday}
      </h1>
      <h2 className="text-[34px] font-bold text-gray-900 leading-tight tracking-tight">
        {dateString}
      </h2>
    </div>
  );
};