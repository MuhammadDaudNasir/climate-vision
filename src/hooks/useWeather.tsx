
import { useState, useEffect } from 'react';
import { WeatherData } from '../utils/weatherUtils';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const API_KEY = '67f927c2a1bd45b4afa122608251702';
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface ExtendedWeatherData extends WeatherData {
  astronomy?: {
    astro: {
      moon_phase: string;
      moon_illumination: string;
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
    }
  };
  hourlyForecast?: {
    time: string;
    temp_c: number;
    chance_of_rain: number;
    chance_of_snow: number;
    will_it_rain: number;
    will_it_snow: number;
    precip_mm: number;
    wind_kph?: number;
    wind_dir?: string;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  }[];
}

export function useWeather(defaultLocation = 'San Francisco') {
  const [location, setLocation] = useState<string>(defaultLocation);
  const [weatherData, setWeatherData] = useState<ExtendedWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Make the request with enhanced data
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(loc)}&days=3&aqi=yes&alerts=yes&astronomy=yes`
      );
      
      if (!response.ok) {
        throw new Error(`Weather data not available (${response.status})`);
      }
      
      const data = await response.json();
      
      // Process the data to add additional fields for our widgets
      const processedData: ExtendedWeatherData = {
        ...data,
        astronomy: data.forecast?.forecastday[0]?.astro ? { 
          astro: {
            moon_phase: data.forecast.forecastday[0].astro.moon_phase,
            moon_illumination: data.forecast.forecastday[0].astro.moon_illumination,
            sunrise: data.forecast.forecastday[0].astro.sunrise,
            sunset: data.forecast.forecastday[0].astro.sunset,
            moonrise: data.forecast.forecastday[0].astro.moonrise,
            moonset: data.forecast.forecastday[0].astro.moonset
          } 
        } : undefined,
        hourlyForecast: data.forecast?.forecastday[0]?.hour?.map((hour: any) => ({
          time: hour.time,
          temp_c: hour.temp_c,
          chance_of_rain: hour.chance_of_rain,
          chance_of_snow: hour.chance_of_snow,
          will_it_rain: hour.will_it_rain,
          will_it_snow: hour.will_it_snow,
          precip_mm: hour.precip_mm,
          wind_kph: hour.wind_kph,
          wind_dir: hour.wind_dir,
          condition: {
            text: hour.condition.text,
            icon: hour.condition.icon,
            code: hour.condition.code
          }
        }))
      };
      
      setWeatherData(processedData);
      
      // Save the last successful location to localStorage
      localStorage.setItem('lastLocation', loc);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const changeLocation = (newLocation: string) => {
    setLocation(newLocation);
    fetchWeather(newLocation);
  };

  useEffect(() => {
    // Try to get the last location from localStorage
    const savedLocation = localStorage.getItem('lastLocation');
    const initialLocation = savedLocation || defaultLocation;
    
    setLocation(initialLocation);
    fetchWeather(initialLocation);
    
    // Set up interval to refresh data every 30 minutes
    const intervalId = setInterval(() => {
      fetchWeather(location);
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [defaultLocation]);

  return {
    weatherData,
    loading,
    error,
    location,
    changeLocation,
    refreshWeather: () => fetchWeather(location)
  };
}
