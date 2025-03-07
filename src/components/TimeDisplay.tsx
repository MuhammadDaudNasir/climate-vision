
import React, { useState, useEffect } from 'react';

interface TimeDisplayProps {
  initialTime?: string;
  className?: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ initialTime, className = "" }) => {
  const [currentTime, setCurrentTime] = useState<string>(() => {
    if (initialTime) return initialTime;
    
    const now = new Date();
    return now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  });
  
  const [currentDate, setCurrentDate] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }));
      
      setCurrentDate(now.toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      }));
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-5xl font-light tracking-tight text-white frosted-text animate-pulse-subtle">
        {currentTime}
      </div>
      <div className="text-lg font-light text-white/80 mt-2 frosted-text">
        {currentDate}
      </div>
    </div>
  );
};

export default TimeDisplay;
