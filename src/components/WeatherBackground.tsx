
import React, { useEffect, useState } from 'react';
import { WeatherCondition } from '@/utils/weatherUtils';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
  children: React.ReactNode;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ 
  condition, 
  isDay,
  children 
}) => {
  const [backgroundClass, setBackgroundClass] = useState<string>('bg-clear-day');
  const [animatedElements, setAnimatedElements] = useState<React.ReactNode>(null);
  
  useEffect(() => {
    // Determine background class based on weather condition and time of day
    let bgClass = '';
    
    if (condition === 'sunny' || condition === 'clear') {
      bgClass = isDay ? 'bg-clear-day' : 'bg-clear-night';
    } else if (condition === 'partly-cloudy') {
      bgClass = isDay ? 'bg-clear-day' : 'bg-clear-night';
    } else if (condition === 'cloudy' || condition === 'overcast' || condition === 'mist' || condition === 'fog') {
      bgClass = 'bg-cloudy';
    } else if (condition === 'rain' || condition === 'drizzle') {
      bgClass = 'bg-rainy';
    } else if (condition === 'snow' || condition === 'sleet') {
      bgClass = 'bg-snowy';
    } else if (condition === 'thunderstorm') {
      bgClass = 'bg-stormy';
    } else {
      bgClass = isDay ? 'bg-clear-day' : 'bg-clear-night';
    }
    
    setBackgroundClass(bgClass);
    
    // Create animated background elements based on weather condition
    let elements;
    
    switch (condition) {
      case 'sunny':
      case 'clear':
        if (isDay) {
          elements = (
            <>
              <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-yellow-400 blur-xl opacity-50 animate-pulse-subtle"></div>
              <div className="absolute bottom-32 left-20 w-12 h-12 rounded-full bg-yellow-300 blur-xl opacity-30 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            </>
          );
        } else {
          elements = (
            <>
              <div className="absolute top-20 right-32 w-4 h-4 rounded-full bg-white blur-[1px] opacity-80 animate-pulse-subtle"></div>
              <div className="absolute top-40 left-20 w-3 h-3 rounded-full bg-white blur-[1px] opacity-60 animate-pulse-subtle" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-32 right-40 w-2 h-2 rounded-full bg-white blur-[1px] opacity-70 animate-pulse-subtle" style={{ animationDelay: '1.2s' }}></div>
              <div className="absolute top-80 right-80 w-3 h-3 rounded-full bg-white blur-[1px] opacity-50 animate-pulse-subtle" style={{ animationDelay: '0.7s' }}></div>
              <div className="absolute bottom-60 left-40 w-2 h-2 rounded-full bg-white blur-[1px] opacity-80 animate-pulse-subtle" style={{ animationDelay: '0.9s' }}></div>
              <div className="absolute top-28 left-[40%] w-3 h-3 rounded-full bg-white blur-[1px] opacity-60 animate-pulse-subtle" style={{ animationDelay: '1.5s' }}></div>
            </>
          );
        }
        break;
        
      case 'partly-cloudy':
        elements = (
          <>
            {isDay && (
              <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-yellow-400 blur-xl opacity-50 animate-pulse-subtle"></div>
            )}
            <div className="absolute top-20 left-[20%] w-40 h-20 rounded-full bg-white blur-xl opacity-30 animate-drift-cloud"></div>
            <div className="absolute bottom-32 right-[25%] w-56 h-24 rounded-full bg-white blur-xl opacity-20 animate-drift-cloud" style={{ animationDelay: '2s', animationDuration: '15s' }}></div>
          </>
        );
        break;
        
      case 'cloudy':
      case 'overcast':
        elements = (
          <>
            <div className="absolute top-10 left-[10%] w-60 h-28 rounded-full bg-white blur-xl opacity-20 animate-drift-cloud"></div>
            <div className="absolute top-32 right-[15%] w-72 h-24 rounded-full bg-white blur-xl opacity-15 animate-drift-cloud" style={{ animationDelay: '1s', animationDuration: '18s' }}></div>
            <div className="absolute bottom-20 left-[25%] w-80 h-32 rounded-full bg-white blur-xl opacity-25 animate-drift-cloud" style={{ animationDelay: '3s', animationDuration: '20s' }}></div>
          </>
        );
        break;
        
      case 'mist':
      case 'fog':
        elements = (
          <>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-10 left-0 right-0 h-40 bg-white/20 blur-xl"></div>
            <div className="absolute bottom-10 left-0 right-0 h-40 bg-white/20 blur-xl"></div>
          </>
        );
        break;
        
      case 'rain':
      case 'drizzle':
        const raindrops = Array.from({ length: 20 }, (_, index) => {
          const left = `${Math.random() * 100}%`;
          const animationDuration = 0.8 + Math.random() * 0.7;
          const animationDelay = Math.random() * 1.5;
          const height = 10 + Math.random() * 15;
          
          return (
            <div 
              key={`raindrop-${index}`}
              className="absolute w-[1px] bg-blue-200/70 rounded-full animate-rain-drop"
              style={{
                left,
                height: `${height}px`,
                top: '-20px',
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
                animationIterationCount: 'infinite'
              }}
            ></div>
          );
        });
        
        elements = (
          <>
            <div className="absolute top-0 left-0 right-0 bottom-0">
              {raindrops}
            </div>
            <div className="absolute top-10 left-[10%] w-60 h-28 rounded-full bg-gray-400 blur-xl opacity-50 animate-drift-cloud"></div>
            <div className="absolute top-24 right-[20%] w-72 h-32 rounded-full bg-gray-500 blur-xl opacity-40 animate-drift-cloud" style={{ animationDelay: '2s' }}></div>
          </>
        );
        break;
        
      case 'snow':
      case 'sleet':
        const snowflakes = Array.from({ length: 30 }, (_, index) => {
          const left = `${Math.random() * 100}%`;
          const animationDuration = 3 + Math.random() * 5;
          const animationDelay = Math.random() * 3;
          const size = 3 + Math.random() * 5;
          const opacity = 0.5 + Math.random() * 0.5;
          
          return (
            <div 
              key={`snowflake-${index}`}
              className="absolute rounded-full bg-white animate-float"
              style={{
                left,
                width: `${size}px`,
                height: `${size}px`,
                top: '-20px',
                opacity,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
                animationIterationCount: 'infinite'
              }}
            ></div>
          );
        });
        
        elements = (
          <>
            <div className="absolute top-0 left-0 right-0 bottom-0">
              {snowflakes}
            </div>
            <div className="absolute top-10 left-[15%] w-56 h-24 rounded-full bg-gray-200 blur-xl opacity-40 animate-drift-cloud"></div>
            <div className="absolute top-20 right-[25%] w-64 h-28 rounded-full bg-gray-300 blur-xl opacity-30 animate-drift-cloud" style={{ animationDelay: '1.5s' }}></div>
          </>
        );
        break;
        
      case 'thunderstorm':
        const lightningFlash = () => {
          const flash = document.createElement('div');
          flash.className = 'absolute inset-0 bg-white/20 z-10';
          flash.style.animation = 'fade-out 0.5s ease-out forwards';
          
          const container = document.getElementById('weather-background');
          if (container) {
            container.appendChild(flash);
            setTimeout(() => {
              container.removeChild(flash);
            }, 500);
          }
        };
        
        useEffect(() => {
          if (condition === 'thunderstorm') {
            const interval = setInterval(() => {
              if (Math.random() > 0.7) {
                lightningFlash();
              }
            }, 3000);
            
            return () => clearInterval(interval);
          }
        }, [condition]);
        
        elements = (
          <>
            <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
              {Array.from({ length: 25 }, (_, index) => {
                const left = `${Math.random() * 100}%`;
                const animationDuration = 0.8 + Math.random() * 0.7;
                const animationDelay = Math.random() * 1.5;
                const height = 10 + Math.random() * 15;
                
                return (
                  <div 
                    key={`raindrop-${index}`}
                    className="absolute w-[1px] bg-blue-200/70 rounded-full animate-rain-drop"
                    style={{
                      left,
                      height: `${height}px`,
                      top: '-20px',
                      animationDuration: `${animationDuration}s`,
                      animationDelay: `${animationDelay}s`,
                      animationIterationCount: 'infinite'
                    }}
                  ></div>
                );
              })}
            </div>
            <div className="absolute top-5 left-[5%] w-72 h-36 rounded-full bg-gray-700 blur-xl opacity-70 animate-drift-cloud"></div>
            <div className="absolute top-20 right-[15%] w-80 h-40 rounded-full bg-gray-800 blur-xl opacity-60 animate-drift-cloud" style={{ animationDelay: '1s' }}></div>
          </>
        );
        break;
        
      default:
        elements = null;
    }
    
    setAnimatedElements(elements);
  }, [condition, isDay]);

  return (
    <div id="weather-background" className={`min-h-screen ${backgroundClass} overflow-hidden relative weather-transition`}>
      {animatedElements}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default WeatherBackground;
