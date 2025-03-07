
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedLocationSelectorProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

interface LocationSuggestion {
  name: string;
  region: string;
  country: string;
}

const API_KEY = '67f927c2a1bd45b4afa122608251702';

const EnhancedLocationSelector: React.FC<EnhancedLocationSelectorProps> = ({ 
  currentLocation, 
  onLocationChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentLocation);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Fetch saved locations when user is logged in
  useEffect(() => {
    if (user) {
      fetchSavedLocations();
    } else {
      setSavedLocations([]);
    }
  }, [user]);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // Update input when currentLocation changes
  useEffect(() => {
    setInputValue(currentLocation);
  }, [currentLocation]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
        setShowSavedLocations(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch locations from the WeatherAPI
  const fetchLocationSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get saved locations from Supabase
  const fetchSavedLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .select('location_name')
        .eq('user_id', user?.id);
      
      if (error) {
        throw error;
      }
      
      setSavedLocations(data.map(item => item.location_name));
    } catch (error: any) {
      console.error('Error fetching saved locations:', error.message);
    }
  };

  // Save a location to Supabase
  const saveLocation = async (locationName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save locations",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_locations')
        .insert({ 
          user_id: user.id,
          location_name: locationName
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Location saved",
        description: `${locationName} has been added to your favorites`,
      });
      
      // Update local saved locations
      setSavedLocations([...savedLocations, locationName]);
    } catch (error: any) {
      toast({
        title: "Error saving location",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Remove a location from saved locations
  const removeLocation = async (locationName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_locations')
        .delete()
        .eq('user_id', user.id)
        .eq('location_name', locationName);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Location removed",
        description: `${locationName} has been removed from your favorites`,
      });
      
      // Update local saved locations
      setSavedLocations(savedLocations.filter(loc => loc !== locationName));
    } catch (error: any) {
      toast({
        title: "Error removing location",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      fetchLocationSuggestions(value);
      setShowSavedLocations(false);
    } else {
      setSuggestions([]);
      // Show saved locations if input is empty
      if (user && savedLocations.length > 0) {
        setShowSavedLocations(true);
      }
    }
  };

  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
    setInputValue(location);
    setSuggestions([]);
    setShowSavedLocations(false);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && inputValue !== currentLocation) {
      onLocationChange(inputValue.trim());
    } else {
      setInputValue(currentLocation);
    }
    setSuggestions([]);
    setShowSavedLocations(false);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInputValue(currentLocation);
      setSuggestions([]);
      setShowSavedLocations(false);
      setIsEditing(false);
    }
  };

  const isLocationSaved = (location: string) => {
    return savedLocations.includes(location);
  };

  const toggleSaveLocation = (location: string) => {
    if (isLocationSaved(location)) {
      removeLocation(location);
    } else {
      saveLocation(location);
    }
  };

  return (
    <div className="relative group">
      {!isEditing ? (
        <button 
          onClick={() => setIsEditing(true)} 
          className="frost-panel p-2 px-4 rounded-full inline-flex items-center space-x-2 text-white/90 hover:text-white transition-colors hover:bg-white/20"
        >
          <Search size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium">{currentLocation}</span>
        </button>
      ) : (
        <div className="relative">
          <form onSubmit={handleSubmit} className="frost-panel p-1 rounded-full inline-flex items-center transition-all min-w-[300px]">
            <Search size={18} className="ml-3 mr-2 text-white/70" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (user && savedLocations.length > 0 && !inputValue.trim()) {
                  setShowSavedLocations(true);
                }
              }}
              placeholder="Search location..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-full"
              autoComplete="off"
            />
            {inputValue && (
              <button 
                type="button" 
                onClick={() => {
                  setInputValue('');
                  if (user && savedLocations.length > 0) {
                    setShowSavedLocations(true);
                  }
                  inputRef.current?.focus();
                }} 
                className="text-white/50 hover:text-white/80 p-1"
              >
                <X size={16} />
              </button>
            )}

            <button type="submit" className="ml-1 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <Search size={16} />
            </button>
          </form>

          {/* Suggestions dropdown - updated styling */}
          {(suggestions.length > 0 || showSavedLocations) && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 mt-2 w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg z-10 overflow-hidden frost-glass-dark animate-blur-in"
            >
              {showSavedLocations && savedLocations.length > 0 && (
                <div className="p-2">
                  <div className="text-white/60 text-xs px-2 py-1">Saved locations</div>
                  {savedLocations.map((location, index) => (
                    <div 
                      key={`saved-${index}`}
                      onClick={() => handleLocationSelect(location)}
                      className="flex items-center justify-between p-2 hover:bg-white/10 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center">
                        <MapPin size={14} className="text-white/60 mr-2" />
                        <span className="text-white text-sm">{location}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLocation(location);
                        }}
                        className="text-white/50 hover:text-white/80 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="border-t border-white/10 my-1"></div>
                </div>
              )}

              {isLoading && (
                <div className="text-center p-3">
                  <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white/90 rounded-full mx-auto"></div>
                </div>
              )}

              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  onClick={() => handleLocationSelect(`${suggestion.name}`)}
                  className="flex items-center justify-between p-2 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-white text-sm">{suggestion.name}</span>
                    <span className="text-white/60 text-xs">
                      {suggestion.region && `${suggestion.region}, `}{suggestion.country}
                    </span>
                  </div>
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveLocation(suggestion.name);
                      }}
                      className={`p-1 ${isLocationSaved(suggestion.name) ? 'text-yellow-400' : 'text-white/50 hover:text-white/80'}`}
                    >
                      <Star size={16} className={isLocationSaved(suggestion.name) ? 'fill-yellow-400' : ''} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedLocationSelector;
