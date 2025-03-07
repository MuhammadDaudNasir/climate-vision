
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  currentLocation, 
  onLocationChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentLocation);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setInputValue(currentLocation);
  }, [currentLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && inputValue !== currentLocation) {
      onLocationChange(inputValue.trim());
    } else {
      setInputValue(currentLocation);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInputValue(currentLocation);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group frost-panel p-2 rounded-full inline-flex items-center transition-all hover:bg-white/20">
      {!isEditing ? (
        <button 
          onClick={() => setIsEditing(true)} 
          className="flex items-center space-x-2 px-3 py-1 text-white/90 hover:text-white transition-colors"
        >
          <Search size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium">{currentLocation}</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center">
          <Search size={18} className="ml-3 mr-2 text-white/70" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSubmit}
            placeholder="Enter location..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-40"
            autoComplete="off"
          />
        </form>
      )}
    </div>
  );
};

export default LocationSelector;
