
import React, { useState } from 'react';
import { Sun } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UVIndexWidgetProps {
  uvIndex: number;
  className?: string;
}

const UVIndexWidget: React.FC<UVIndexWidgetProps> = ({ uvIndex, className = "" }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get UV Index classification
  const getUVLevel = (uvIndex: number): 
    { level: string; color: string; advice: string; detailedAdvice: string } => {
    if (uvIndex <= 2) {
      return { 
        level: 'Low', 
        color: 'text-green-400', 
        advice: 'No protection needed for most people',
        detailedAdvice: 'You can safely enjoy being outside without protection. Most people won\'t get sunburned at this level. However, people with very light skin may want to use SPF 15+ sunscreen if outside for extended periods.'
      };
    }
    if (uvIndex <= 5) {
      return { 
        level: 'Moderate', 
        color: 'text-yellow-400', 
        advice: 'Wear sunscreen and sunglasses',
        detailedAdvice: 'Seek shade during midday hours. Wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Apply broad-spectrum SPF 15+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating.'
      };
    }
    if (uvIndex <= 7) {
      return { 
        level: 'High', 
        color: 'text-orange-400', 
        advice: 'Reduce time in the sun from 10am to 4pm',
        detailedAdvice: 'Reduce time in the sun between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Apply broad-spectrum SPF 15+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating.'
      };
    }
    if (uvIndex <= 10) {
      return { 
        level: 'Very High', 
        color: 'text-red-500', 
        advice: 'Take extra precautions, seek shade',
        detailedAdvice: 'Minimize sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Apply broad-spectrum SPF 15+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Extra precaution is needed for fair skinned people and anyone with increased sensitivity to UV radiation.'
      };
    }
    return { 
      level: 'Extreme', 
      color: 'text-purple-500', 
      advice: 'Avoid being outside during midday hours',
      detailedAdvice: 'Try to avoid sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Apply broad-spectrum SPF 15+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Fair skinned people may burn in less than 10 minutes.'
    };
  };

  const { level, color, advice, detailedAdvice } = getUVLevel(uvIndex);

  // UV Index scale representation
  const UvScale = () => {
    const maxScale = 12;
    const scaleItems = [];
    
    for (let i = 0; i <= maxScale; i++) {
      const scaleColor = getUVLevel(i).color.replace('text-', 'bg-');
      scaleItems.push(
        <div 
          key={i} 
          className={`h-4 w-6 ${scaleColor} ${i === 0 ? 'rounded-l-full' : ''} ${i === maxScale ? 'rounded-r-full' : ''} ${i === uvIndex ? 'ring-2 ring-white' : ''}`}
          title={`UV Index ${i}`}
        />
      );
    }
    
    return <div className="flex w-full mt-4">{scaleItems}</div>;
  };

  return (
    <>
      <div 
        className={`frost-panel p-4 rounded-2xl hover-lift transition-all cursor-pointer ${className}`}
        onClick={() => setDialogOpen(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-sm font-medium">UV Index</h3>
          <Sun size={16} className="text-white/70" />
        </div>
        
        <div className="flex flex-col items-center justify-center my-3">
          <span className={`text-3xl font-medium ${color}`}>{uvIndex}</span>
          <span className={`text-sm font-medium mt-1 ${color}`}>{level}</span>
        </div>
        
        <p className="text-white/70 text-xs text-center mt-1">{advice}</p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md frost-glass-dark border-white/10 backdrop-blur-xl bg-black/60">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Sun className={color} size={18} />
              <span>UV Index: <span className={color}>{uvIndex} - {level}</span></span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Current ultraviolet radiation level at your location
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-white">
            <UvScale />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">What does this mean?</h4>
              <p className="text-sm text-white/80">{detailedAdvice}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Protection required</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${uvIndex >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
                  <span className={uvIndex >= 3 ? '' : 'text-white/60'}>Sunscreen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${uvIndex >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
                  <span className={uvIndex >= 3 ? '' : 'text-white/60'}>Sunglasses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${uvIndex >= 5 ? 'bg-white' : 'bg-white/30'}`}></div>
                  <span className={uvIndex >= 5 ? '' : 'text-white/60'}>Hat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${uvIndex >= 8 ? 'bg-white' : 'bg-white/30'}`}></div>
                  <span className={uvIndex >= 8 ? '' : 'text-white/60'}>Seek Shade</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">UV Index Times</h4>
              <p className="text-sm text-white/70">
                UV radiation is typically strongest between 10am and 4pm, even on cloudy days.
                UV intensity can be affected by reflective surfaces like water, sand, and snow.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UVIndexWidget;
