
import React from 'react';
import { WeatherCondition } from '@/utils/weatherUtils';
import { 
  Sun, Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, CloudFog, 
  Moon, CloudMoon, CloudSun
} from 'lucide-react';

interface AnimatedIconProps {
  condition: WeatherCondition;
  isDay: boolean;
  className?: string;
  size?: number;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  condition, 
  isDay, 
  className = "", 
  size = 48 
}) => {
  const renderIcon = () => {
    switch (condition) {
      case 'sunny':
        return isDay ? (
          <Sun size={size} className="text-yellow-400 animate-rotate-sun" />
        ) : (
          <Moon size={size} className="text-gray-200 animate-pulse-subtle" />
        );
        
      case 'clear':
        return isDay ? (
          <Sun size={size} className="text-yellow-400 animate-rotate-sun" />
        ) : (
          <Moon size={size} className="text-gray-200 animate-pulse-subtle" />
        );
        
      case 'partly-cloudy':
        return isDay ? (
          <div className="relative inline-block">
            <Sun size={size} className="text-yellow-400" />
            <Cloud size={size * 0.7} className="text-white/80 absolute top-1/2 left-1/2 transform -translate-x-1/2 animate-drift-cloud" />
          </div>
        ) : (
          <div className="relative inline-block">
            <Moon size={size} className="text-gray-200" />
            <Cloud size={size * 0.7} className="text-white/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 animate-drift-cloud" />
          </div>
        );
        
      case 'cloudy':
      case 'overcast':
        return (
          <div className="relative inline-block">
            <Cloud size={size} className="text-white/90 animate-drift-cloud" />
            <Cloud 
              size={size * 0.8} 
              className="text-white/70 absolute top-1/4 left-1/3 transform -translate-x-1/2 animate-drift-cloud" 
              style={{ animationDelay: '0.5s' }}
            />
          </div>
        );
        
      case 'mist':
      case 'fog':
        return <CloudFog size={size} className="text-white/80 animate-pulse-subtle" />;
        
      case 'rain':
      case 'drizzle':
        return (
          <div className="relative inline-block">
            <CloudRain size={size} className="text-white/90" />
            <div className="absolute top-1/2 left-1/4 w-0.5 h-4 bg-blue-200 rounded animate-rain-drop"></div>
            <div className="absolute top-1/2 left-1/3 w-0.5 h-4 bg-blue-200 rounded animate-rain-drop" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-blue-200 rounded animate-rain-drop" style={{ animationDelay: '0.6s' }}></div>
            <div className="absolute top-1/2 left-2/3 w-0.5 h-4 bg-blue-200 rounded animate-rain-drop" style={{ animationDelay: '0.9s' }}></div>
          </div>
        );
        
      case 'snow':
        return (
          <div className="relative inline-block">
            <CloudSnow size={size} className="text-white/90" />
            <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-float" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white rounded-full animate-float" style={{ animationDelay: '0.8s' }}></div>
          </div>
        );
        
      case 'sleet':
        return (
          <div className="relative inline-block">
            <CloudDrizzle size={size} className="text-white/90" />
            <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-blue-100 rounded-full animate-rain-drop" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-blue-100 rounded-full animate-rain-drop" style={{ animationDelay: '0.8s' }}></div>
          </div>
        );
        
      case 'thunderstorm':
        return (
          <div className="relative inline-block">
            <CloudLightning size={size} className="text-white/90" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-1 h-6 bg-yellow-300 rotate-12 animate-pulse-subtle"></div>
          </div>
        );
        
      default:
        return isDay ? (
          <Sun size={size} className="text-yellow-400" />
        ) : (
          <Moon size={size} className="text-gray-200" />
        );
    }
  };

  return <div className={`inline-block ${className}`}>{renderIcon()}</div>;
};

export default AnimatedIcon;
