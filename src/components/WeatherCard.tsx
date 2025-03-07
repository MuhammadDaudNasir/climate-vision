
import React from 'react';
import { WeatherData, getWeatherCondition, getTemperatureColor } from '@/utils/weatherUtils';
import AnimatedIcon from './AnimatedIcon';
import { Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherCardProps {
  weatherData: WeatherData;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, className = "" }) => {
  if (!weatherData) return null;

  const { current, location } = weatherData;
  const weatherCondition = getWeatherCondition(current.condition.code);
  const tempColor = getTemperatureColor(current.temp_c);
  const feelsLikeColor = getTemperatureColor(current.feelslike_c);

  return (
    <div className={`frost-panel p-6 rounded-3xl hover-lift transition-all ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-white">
          <h2 className="text-2xl font-medium frosted-text">{current.condition.text}</h2>
          <p className="text-white/70 text-sm">Updated just now</p>
        </div>
        <AnimatedIcon 
          condition={weatherCondition} 
          isDay={current.is_day === 1} 
          size={56}
        />
      </div>
      
      <div className="flex items-end space-x-4 mb-6">
        <div className={`text-6xl font-light ${tempColor} frosted-text`}>
          {Math.round(current.temp_c)}°
        </div>
        <div className="text-lg text-white/80 pb-2 frosted-text">
          {Math.round(current.temp_f)}°F
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center bg-white/5 p-3 rounded-2xl">
          <Wind size={20} className="text-white/70 mb-2" />
          <div className="text-sm font-medium text-white/90">{current.wind_kph} km/h</div>
          <div className="text-xs text-white/60">{current.wind_dir}</div>
        </div>
        
        <div className="flex flex-col items-center bg-white/5 p-3 rounded-2xl">
          <Droplets size={20} className="text-white/70 mb-2" />
          <div className="text-sm font-medium text-white/90">{current.humidity}%</div>
          <div className="text-xs text-white/60">Humidity</div>
        </div>
        
        <div className="flex flex-col items-center bg-white/5 p-3 rounded-2xl">
          <Thermometer size={20} className="text-white/70 mb-2" />
          <div className={`text-sm font-medium ${feelsLikeColor}`}>{Math.round(current.feelslike_c)}°</div>
          <div className="text-xs text-white/60">Feels like</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
