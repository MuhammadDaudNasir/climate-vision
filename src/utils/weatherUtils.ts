
export type WeatherCondition = 
  | 'sunny' 
  | 'clear' 
  | 'partly-cloudy' 
  | 'cloudy' 
  | 'overcast' 
  | 'mist' 
  | 'fog' 
  | 'rain' 
  | 'drizzle' 
  | 'snow' 
  | 'sleet' 
  | 'thunderstorm';

export type TimeOfDay = 'day' | 'night';

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
    is_day: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      }>;
    }>;
  };
}

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 1000) return 'sunny';
  if (code === 1003) return 'partly-cloudy';
  if ([1006, 1009].includes(code)) return 'cloudy';
  if ([1030, 1135, 1147].includes(code)) return 'mist';
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return 'rain';
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return 'snow';
  if ([1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1237, 1249, 1252].includes(code)) return 'sleet';
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'thunderstorm';
  return 'clear';
}

export function getBackgroundClass(condition: WeatherCondition, isDay: boolean): string {
  const timeOfDay = isDay ? 'day' : 'night';
  
  switch (condition) {
    case 'sunny':
    case 'clear':
      return `bg-clear-${timeOfDay}`;
    case 'partly-cloudy':
    case 'cloudy':
    case 'overcast':
      return 'bg-cloudy';
    case 'mist':
    case 'fog':
      return 'bg-cloudy';
    case 'rain':
    case 'drizzle':
      return 'bg-rainy';
    case 'snow':
    case 'sleet':
      return 'bg-snowy';
    case 'thunderstorm':
      return 'bg-stormy';
    default:
      return `bg-clear-${timeOfDay}`;
  }
}

export function getTemperatureColor(temp: number): string {
  if (temp <= 0) return 'text-blue-400';
  if (temp < 10) return 'text-blue-300';
  if (temp < 20) return 'text-green-400';
  if (temp < 30) return 'text-yellow-400';
  return 'text-orange-500';
}

export function formatTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getGreeting(hour: number): string {
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
