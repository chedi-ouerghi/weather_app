export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDeg: number;
    visibility: number;
    uvIndex: number;
    description: string;
    icon: string;
    main: string;
  };
  forecast: ForecastDay[];
  hourly: HourlyForecast[];
}

export interface ForecastDay {
  date: string;
  temp: {
    min: number;
    max: number;
    day: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  humidity: number;
  windSpeed: number;
  pop: number; // Probability of precipitation
}

export interface HourlyForecast {
  time: string;
  temp: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  pop: number;
}

export interface SearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface RecentSearch {
  id: string;
  name: string;
  country: string;
  lastSearched: string;
  quickWeather?: {
    temp: number;
    description: string;
    icon: string;
  };
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';