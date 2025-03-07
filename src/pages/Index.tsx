
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WeatherBackground from '@/components/WeatherBackground';
import WeatherCard from '@/components/WeatherCard';
import TimeDisplay from '@/components/TimeDisplay';
import EnhancedLocationSelector from '@/components/EnhancedLocationSelector';
import MoonPhaseWidget from '@/components/MoonPhaseWidget';
import PrecipitationWidget from '@/components/PrecipitationWidget';
import UVIndexWidget from '@/components/UVIndexWidget';
import WindMapWidget from '@/components/WindMapWidget';
import { useWeather, ExtendedWeatherData } from '@/hooks/useWeather';
import { getWeatherCondition } from '@/utils/weatherUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { weatherData, loading, error, location, changeLocation } = useWeather();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (weatherData) {
      setIsInitialLoad(false);
    }
  }, [weatherData]);
  
  // Early return for initial loading state with nice loading animation
  if (isInitialLoad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-pulse-subtle">
          <div className="text-white text-2xl mb-6 font-light">Climate Vision</div>
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
          <div className="text-white/60 text-sm mt-6">Loading weather data...</div>
        </div>
      </div>
    );
  }
  
  // Safeguard for when weather data is not yet available
  if (!weatherData) {
    return null;
  }
  
  const weatherCondition = getWeatherCondition(weatherData.current.condition.code);
  const isDay = weatherData.current.is_day === 1;
  
  // Calculate appropriate greeting based on the time
  const currentHour = new Date(weatherData.location.localtime).getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  // Calculate precipitation data
  const getPrecipitationData = (data: ExtendedWeatherData) => {
    const currentHour = new Date(data.location.localtime).getHours();
    const hourlyData = data.hourlyForecast?.[currentHour];
    
    if (!hourlyData) {
      return { chance: 0, amount: 0, type: 'none' as const };
    }
    
    const willRain = hourlyData.will_it_rain === 1;
    const willSnow = hourlyData.will_it_snow === 1;
    const chanceOfRain = hourlyData.chance_of_rain;
    const chanceOfSnow = hourlyData.chance_of_snow;
    
    return {
      chance: Math.max(chanceOfRain, chanceOfSnow),
      amount: hourlyData.precip_mm,
      type: willSnow ? 'snow' as const : willRain ? 'rain' as const : 'none' as const
    };
  };

  // Get moon phase data
  const getMoonPhaseData = (data: ExtendedWeatherData) => {
    if (!data.astronomy?.astro) {
      return { 
        phase: 0, 
        illumination: 0,
        moonrise: '',
        moonset: ''
      };
    }
    
    const moonPhaseText = data.astronomy.astro.moon_phase;
    const moonIllumination = parseInt(data.astronomy.astro.moon_illumination, 10) / 100;
    const moonrise = data.astronomy.astro.moonrise;
    const moonset = data.astronomy.astro.moonset;
    
    // Convert text moon phase to numeric value (0-1)
    let phase = 0;
    if (moonPhaseText === "New Moon") phase = 0;
    else if (moonPhaseText === "Waxing Crescent") phase = 0.125;
    else if (moonPhaseText === "First Quarter") phase = 0.25;
    else if (moonPhaseText === "Waxing Gibbous") phase = 0.375;
    else if (moonPhaseText === "Full Moon") phase = 0.5;
    else if (moonPhaseText === "Waning Gibbous") phase = 0.625;
    else if (moonPhaseText === "Last Quarter") phase = 0.75;
    else if (moonPhaseText === "Waning Crescent") phase = 0.875;
    
    return { 
      phase, 
      illumination: moonIllumination,
      moonrise,
      moonset
    };
  };

  const precipitationData = getPrecipitationData(weatherData);
  const { 
    phase: moonPhase, 
    illumination: moonIllumination,
    moonrise: moonriseTime,
    moonset: moonsetTime
  } = getMoonPhaseData(weatherData);
  
  // Get hourly forecasts for widgets
  const getHourlyForecasts = () => {
    if (!weatherData.hourlyForecast) return [];
    
    const now = new Date();
    const currentHour = now.getHours();
    
    return weatherData.hourlyForecast.filter(hour => {
      const hourTime = new Date(hour.time);
      return hourTime.getHours() >= currentHour;
    });
  };
  
  const hourlyForecasts = getHourlyForecasts();

  return (
    <WeatherBackground condition={weatherCondition} isDay={isDay}>
      <div className="min-h-screen container mx-auto px-4 py-8 flex flex-col max-w-4xl">
        {/* Header section with location and time */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 animate-slide-down">
          <div className="flex items-center">
            <h1 className="text-2xl font-light text-white frosted-text">Climate Vision</h1>
          </div>
          <div className="flex items-center gap-4">
            <EnhancedLocationSelector 
              currentLocation={location} 
              onLocationChange={changeLocation} 
            />
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => navigate('/profile')}
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.username || user.email} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                  onClick={signOut}
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => navigate('/auth')}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Button>
            )}
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <TimeDisplay className="mb-4" />
            
            {/* Centered greeting with username from profile if available */}
            <h2 className="text-3xl text-center font-light text-white frosted-text mb-1">
              {greeting}
              {user && profile?.username && (
                <span className="font-normal">, {profile.username}</span>
              )}
            </h2>
            
            <p className="text-center text-white/70 mb-4">
              {weatherData.location.name}, {weatherData.location.country}
            </p>
          </div>
          
          <div className="w-full max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <WeatherCard weatherData={weatherData} />
          </div>
          
          {/* Additional weather widgets */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <UVIndexWidget uvIndex={weatherData.current.uv} />
            <MoonPhaseWidget 
              moonPhase={moonPhase} 
              moonIllumination={moonIllumination}
              moonriseTime={moonriseTime}
              moonsetTime={moonsetTime}
            />
            <PrecipitationWidget 
              precipitationData={precipitationData}
              hourlyForecast={hourlyForecasts}
            />
            <WindMapWidget 
              windSpeed={weatherData.current.wind_kph} 
              windDirection={weatherData.current.wind_dir}
              hourlyForecast={hourlyForecasts.map(hour => ({
                time: hour.time,
                wind_kph: hour.wind_kph || 0,
                wind_dir: hour.wind_dir || 'N'
              }))}
            />
          </div>
          
          {/* Forecast preview */}
          {weatherData.forecast && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              {weatherData.forecast.forecastday.slice(0, 3).map((day) => (
                <div key={day.date} className="frost-panel p-4 rounded-2xl hover-lift transition-all">
                  <div className="text-white text-center mb-2">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <div className="flex items-center justify-center">
                    <img 
                      src={day.day.condition.icon.replace('64x64', '128x128')} 
                      alt={day.day.condition.text} 
                      className="w-12 h-12"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex justify-center gap-4 text-white mt-2">
                    <span className="font-medium">{Math.round(day.day.maxtemp_c)}°</span>
                    <span className="text-white/60">{Math.round(day.day.mintemp_c)}°</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        
        {/* Footer with Powered by Pineapple and copyright */}
        <footer className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-white/40 text-xs mb-1">Data provided by WeatherAPI.com</p>
          <p className="text-white/30 text-[10px] mb-1">Powered by Pineapple</p>
          <p className="text-white/40 text-xs">© 2025 Climate Vision. All rights reserved.</p>
        </footer>
      </div>
    </WeatherBackground>
  );
};

export default Index;
