import React, { useState } from 'react';
import { Wind } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WindMapWidgetProps {
  windSpeed: number;
  windDirection: string;
  hourlyForecast?: {
    time: string;
    wind_kph: number;
    wind_dir: string;
  }[];
  className?: string;
}

const WindMapWidget: React.FC<WindMapWidgetProps> = ({ 
  windSpeed, 
  windDirection, 
  hourlyForecast = [],
  className = "" 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get cardinal direction from abbreviation
  const getFullWindDirection = (abbr: string): string => {
    const directions: Record<string, string> = {
      'N': 'North',
      'NNE': 'North-Northeast',
      'NE': 'Northeast',
      'ENE': 'East-Northeast',
      'E': 'East',
      'ESE': 'East-Southeast',
      'SE': 'Southeast',
      'SSE': 'South-Southeast',
      'S': 'South',
      'SSW': 'South-Southwest',
      'SW': 'Southwest',
      'WSW': 'West-Southwest',
      'W': 'West',
      'WNW': 'West-Northwest',
      'NW': 'Northwest',
      'NNW': 'North-Northwest'
    };
    return directions[abbr] || abbr;
  };

  // Get wind intensity description
  const getWindIntensity = (speed: number): string => {
    if (speed < 5) return 'Calm';
    if (speed < 12) return 'Light breeze';
    if (speed < 20) return 'Moderate breeze';
    if (speed < 30) return 'Fresh breeze';
    if (speed < 40) return 'Strong breeze';
    if (speed < 50) return 'Near gale';
    if (speed < 62) return 'Gale';
    if (speed < 75) return 'Strong gale';
    if (speed < 89) return 'Storm';
    return 'Hurricane force';
  };

  // Get rotation angle for the arrow (north = 0°, east = 90°, etc.)
  const getRotationAngle = (dir: string): number => {
    const directions: Record<string, number> = {
      'N': 0,
      'NNE': 22.5,
      'NE': 45,
      'ENE': 67.5,
      'E': 90,
      'ESE': 112.5,
      'SE': 135,
      'SSE': 157.5,
      'S': 180,
      'SSW': 202.5,
      'SW': 225,
      'WSW': 247.5,
      'W': 270,
      'WNW': 292.5,
      'NW': 315,
      'NNW': 337.5
    };
    return directions[dir] || 0;
  };

  // Format time for hourly forecast
  const formatHourTime = (timeStr: string) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get detailed effects of current wind speed
  const getWindEffects = (speed: number): string => {
    if (speed < 5) return 'Calm conditions. Smoke rises vertically.';
    if (speed < 12) return 'Wind felt on face. Leaves rustle.';
    if (speed < 20) return 'Raises dust and loose paper. Small branches begin to move.';
    if (speed < 30) return 'Small trees in leaf begin to sway. Crested wavelets form on inland waters.';
    if (speed < 40) return 'Large branches in motion. Whistling heard in overhead wires.';
    if (speed < 50) return 'Whole trees in motion. Inconvenience felt when walking against wind.';
    if (speed < 62) return 'Breaks twigs off trees. Progress on foot is seriously impeded.';
    if (speed < 75) return 'Slight structural damage occurs (chimney pots and roof tiles dislodged).';
    if (speed < 89) return 'Trees uprooted. Considerable structural damage occurs.';
    return 'Widespread damage to structures. Debris and unsecured objects become airborne.';
  };

  // Calculate the next 6 hours of wind forecast
  const getHourlyWindForecast = () => {
    if (!hourlyForecast || hourlyForecast.length === 0) return [];
    
    const now = new Date();
    const currentHour = now.getHours();
    
    return hourlyForecast
      .filter(hour => {
        const hourTime = new Date(hour.time);
        return hourTime.getHours() >= currentHour;
      })
      .slice(0, 6);
  };

  const fullDirection = getFullWindDirection(windDirection);
  const intensity = getWindIntensity(windSpeed);
  const rotationAngle = getRotationAngle(windDirection);
  const nextHoursWindForecast = getHourlyWindForecast();

  // Convert wind speed to color
  const getWindSpeedColor = (speed: number): string => {
    if (speed < 12) return 'bg-green-500';
    if (speed < 30) return 'bg-yellow-500';
    if (speed < 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div 
        className={`frost-panel p-4 rounded-2xl hover-lift transition-all cursor-pointer ${className}`}
        onClick={() => setDialogOpen(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-sm font-medium">Wind</h3>
          <Wind size={16} className="text-white/70" />
        </div>
        
        <div className="flex flex-col items-center justify-center my-3">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <div className="absolute border-2 border-white/20 rounded-full h-full w-full"></div>
            {/* Wind direction arrow */}
            <div 
              className="absolute h-12 w-1 bg-blue-400 rounded-full origin-bottom transform" 
              style={{ 
                transform: `rotate(${rotationAngle}deg)`, 
                bottom: '50%' 
              }}
            ></div>
            <div 
              className="absolute w-3 h-3 bg-blue-400 transform rotate-45" 
              style={{ 
                transform: `rotate(${rotationAngle}deg) translateY(-32px) rotate(45deg)`
              }}
            ></div>
            <div className="text-sm text-white/90">
              {windDirection}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-white text-base">{windSpeed} km/h</p>
          <p className="text-white/70 text-xs mt-1">{intensity} from {fullDirection}</p>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md frost-glass-dark border-white/10 backdrop-blur-xl bg-black/60">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Wind size={18} />
              <span>Wind Details</span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Current wind speed, direction and forecast
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-white">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
                  <div className="absolute border-2 border-white/20 rounded-full h-full w-full"></div>
                  <div className="absolute h-20 w-1.5 bg-blue-500 rounded-full origin-bottom transform" 
                    style={{ transform: `rotate(${rotationAngle}deg)`, bottom: '50%' }}></div>
                  <div className="absolute w-4 h-4 bg-blue-500 transform rotate-45" 
                    style={{ transform: `rotate(${rotationAngle}deg) translateY(-48px) rotate(45deg)` }}></div>
                  <div className="text-center">
                    <div className="text-xl font-medium">{windDirection}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-white/60">Direction</div>
                  <div className="text-sm">{fullDirection}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-light">{windSpeed}</div>
                <div className="text-sm text-white/60">km/h</div>
                <div className="mt-2">
                  <div className="text-sm font-medium">{intensity}</div>
                  <div className="mt-1 inline-block px-2 py-1 rounded-full text-xs text-white" 
                    style={{ backgroundColor: getWindSpeedColor(windSpeed).replace('bg-', '') }}>
                    {getWindIntensity(windSpeed)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="font-medium text-sm">Effects</h4>
              <p className="text-sm text-white/80">{getWindEffects(windSpeed)}</p>
            </div>
            
            {nextHoursWindForecast.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="font-medium text-sm">Wind Forecast</h4>
                <div className="grid grid-cols-3 gap-2">
                  {nextHoursWindForecast.map((hour, index) => (
                    <div key={index} className="text-center p-2 rounded-md bg-white/10">
                      <div className="text-xs text-white/60">{formatHourTime(hour.time)}</div>
                      <div className="my-1">{hour.wind_kph} km/h</div>
                      <div className="text-xs">{hour.wind_dir}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t border-white/10">
              <h4 className="font-medium text-sm col-span-2 mb-1">Beaufort Scale</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>0-12 km/h (Light)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>12-30 km/h (Moderate)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>30-50 km/h (Strong)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>50+ km/h (Gale+)</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WindMapWidget;
