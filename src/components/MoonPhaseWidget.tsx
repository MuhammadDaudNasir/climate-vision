
import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MoonPhaseWidgetProps {
  moonPhase: number;
  moonIllumination: number;
  className?: string;
  moonriseTime?: string;
  moonsetTime?: string;
}

const MoonPhaseWidget: React.FC<MoonPhaseWidgetProps> = ({ 
  moonPhase, 
  moonIllumination,
  moonriseTime,
  moonsetTime,
  className = "" 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Convert moon phase to text
  const getMoonPhaseText = (phase: number): string => {
    if (phase === 0 || phase === 1) return "New Moon";
    if (phase < 0.25) return "Waxing Crescent";
    if (phase === 0.25) return "First Quarter";
    if (phase < 0.5) return "Waxing Gibbous";
    if (phase === 0.5) return "Full Moon";
    if (phase < 0.75) return "Waning Gibbous";
    if (phase === 0.75) return "Last Quarter";
    return "Waning Crescent";
  };

  // Get the appropriate moon icon based on phase
  const getMoonIcon = (phase: number): string => {
    if (phase === 0 || phase === 1) return "🌑";
    if (phase < 0.25) return "🌒";
    if (phase === 0.25) return "🌓";
    if (phase < 0.5) return "🌔";
    if (phase === 0.5) return "🌕";
    if (phase < 0.75) return "🌖";
    if (phase === 0.75) return "🌗";
    return "🌘";
  };

  // Get detailed description for each moon phase
  const getMoonPhaseDescription = (phaseText: string): string => {
    switch (phaseText) {
      case "New Moon":
        return "The Moon is between Earth and the Sun, with the side facing us not illuminated. The Moon is not visible.";
      case "Waxing Crescent":
        return "A small part of the Moon becomes visible as the Moon moves away from alignment with the Sun.";
      case "First Quarter":
        return "Half of the Moon appears illuminated, as the Moon is 90 degrees away from the Sun.";
      case "Waxing Gibbous":
        return "More than half of the Moon appears illuminated as the Moon moves toward full alignment with the Earth and Sun.";
      case "Full Moon":
        return "The Moon is fully illuminated as Earth is between the Moon and the Sun.";
      case "Waning Gibbous":
        return "More than half of the Moon appears illuminated, gradually decreasing as the Moon moves away from opposition.";
      case "Last Quarter":
        return "Half of the Moon appears illuminated as the Moon reaches 90 degrees away from the Sun in the other direction.";
      case "Waning Crescent":
        return "A small part of the Moon is illuminated as the Moon moves toward alignment with the Sun.";
      default:
        return "";
    }
  };

  const moonPhaseText = getMoonPhaseText(moonPhase);
  const moonIcon = getMoonIcon(moonPhase);
  const moonDescription = getMoonPhaseDescription(moonPhaseText);

  return (
    <>
      <div 
        className={`frost-panel p-4 rounded-2xl hover-lift transition-all cursor-pointer ${className}`}
        onClick={() => setDialogOpen(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-sm font-medium">Moon Phase</h3>
          <Moon size={16} className="text-white/70" />
        </div>
        
        <div className="flex items-center justify-center my-3">
          <span className="text-4xl">{moonIcon}</span>
        </div>
        
        <div className="text-center">
          <p className="text-white text-base">{moonPhaseText}</p>
          <p className="text-white/70 text-xs mt-1">{Math.round(moonIllumination * 100)}% illuminated</p>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md frost-glass-dark border-white/10 backdrop-blur-xl bg-black/60">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Moon size={18} />
              <span>Moon Phase</span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Current lunar phase and illumination
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-white">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-6xl mb-2">{moonIcon}</span>
              <h3 className="text-lg font-medium">{moonPhaseText}</h3>
              <p className="text-white/70">{Math.round(moonIllumination * 100)}% illuminated</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-white/80">{moonDescription}</p>
            </div>
            
            {(moonriseTime || moonsetTime) && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                {moonriseTime && (
                  <div className="text-center">
                    <p className="text-sm text-white/60">Moonrise</p>
                    <p className="text-base">{moonriseTime}</p>
                  </div>
                )}
                {moonsetTime && (
                  <div className="text-center">
                    <p className="text-sm text-white/60">Moonset</p>
                    <p className="text-base">{moonsetTime}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-2 border-t border-white/10">
              <h4 className="font-medium text-sm mb-2">Lunar Cycle</h4>
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">🌑</span>
                  <span className="text-xs text-white/70">New</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">🌓</span>
                  <span className="text-xs text-white/70">First</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">🌕</span>
                  <span className="text-xs text-white/70">Full</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">🌗</span>
                  <span className="text-xs text-white/70">Last</span>
                </div>
              </div>
              <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                <div 
                  className="bg-white/70 h-full" 
                  style={{ width: `${(moonPhase * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoonPhaseWidget;
