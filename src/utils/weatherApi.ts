import axios from 'axios';
import { WeatherData, SearchResult, ForecastDay, HourlyForecast } from '../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1';

// Fonction pour convertir les codes météo WMO en descriptions
const getWeatherDescription = (weatherCode: number): { main: string; description: string; icon: string } => {
  const weatherCodes: { [key: number]: { main: string; description: string; icon: string } } = {
    0: { main: 'Clear', description: 'ciel dégagé', icon: '01d' },
    1: { main: 'Clouds', description: 'peu nuageux', icon: '02d' },
    2: { main: 'Clouds', description: 'partiellement nuageux', icon: '03d' },
    3: { main: 'Clouds', description: 'nuageux', icon: '04d' },
    45: { main: 'Fog', description: 'brouillard', icon: '50d' },
    48: { main: 'Fog', description: 'brouillard givrant', icon: '50d' },
    51: { main: 'Drizzle', description: 'bruine légère', icon: '09d' },
    53: { main: 'Drizzle', description: 'bruine modérée', icon: '09d' },
    55: { main: 'Drizzle', description: 'bruine dense', icon: '09d' },
    56: { main: 'Drizzle', description: 'bruine verglaçante légère', icon: '13d' },
    57: { main: 'Drizzle', description: 'bruine verglaçante dense', icon: '13d' },
    61: { main: 'Rain', description: 'pluie légère', icon: '10d' },
    63: { main: 'Rain', description: 'pluie modérée', icon: '10d' },
    65: { main: 'Rain', description: 'pluie forte', icon: '10d' },
    66: { main: 'Rain', description: 'pluie verglaçante légère', icon: '13d' },
    67: { main: 'Rain', description: 'pluie verglaçante forte', icon: '13d' },
    71: { main: 'Snow', description: 'neige légère', icon: '13d' },
    73: { main: 'Snow', description: 'neige modérée', icon: '13d' },
    75: { main: 'Snow', description: 'neige forte', icon: '13d' },
    77: { main: 'Snow', description: 'neige en grains', icon: '13d' },
    80: { main: 'Rain', description: 'averses légères', icon: '09d' },
    81: { main: 'Rain', description: 'averses modérées', icon: '09d' },
    82: { main: 'Rain', description: 'averses fortes', icon: '09d' },
    85: { main: 'Snow', description: 'averses de neige légères', icon: '13d' },
    86: { main: 'Snow', description: 'averses de neige fortes', icon: '13d' },
    95: { main: 'Thunderstorm', description: 'orage', icon: '11d' },
    96: { main: 'Thunderstorm', description: 'orage avec grêle légère', icon: '11d' },
    99: { main: 'Thunderstorm', description: 'orage avec grêle forte', icon: '11d' },
  };

  return weatherCodes[weatherCode] || { main: 'Clear', description: 'ciel dégagé', icon: '01d' };
};

export const weatherApi = {
  // Recherche de villes avec auto-complétion (utilise l'API de géocodage d'Open-Meteo)
  async searchCities(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=fr&format=json`
      );

      if (response.data.results) {
        return response.data.results.map((city: any) => ({
          name: city.name,
          country: city.country,
          state: city.admin1,
          lat: city.latitude,
          lon: city.longitude,
        }));
      }
      return [];
    } catch (error: any) {
      console.error('Erreur lors de la recherche de villes:', error);
      throw new Error('Impossible de rechercher les villes');
    }
  },

  // Météo actuelle par coordonnées
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto`
      );

      const data = response.data;
      const current = data.current_weather;
      const hourly = data.hourly;
      const daily = data.daily;

      // Obtenir les informations météo actuelles
      const currentWeather = getWeatherDescription(current.weathercode);

      // Trouver l'index de l'heure actuelle dans les données horaires
      const currentTime = new Date(current.time);
      const currentHourIndex = hourly.time.findIndex((time: string) => {
        const hourTime = new Date(time);
        return hourTime.getHours() === currentTime.getHours() &&
          hourTime.getDate() === currentTime.getDate();
      });

      // Traiter les prévisions quotidiennes
      const dailyForecast: ForecastDay[] = daily.time.map((date: string, index: number) => {
        const weather = getWeatherDescription(daily.weather_code[index]);
        return {
          date: date,
          temp: {
            min: daily.temperature_2m_min[index],
            max: daily.temperature_2m_max[index],
            day: daily.temperature_2m_max[index], // Utiliser la température max comme température du jour
          },
          weather: {
            main: weather.main,
            description: weather.description,
            icon: weather.icon,
          },
          humidity: 0, // Open-Meteo ne fournit pas l'humidité quotidienne
          windSpeed: 0, // Open-Meteo ne fournit pas le vent quotidien
          pop: daily.precipitation_probability_max[index] / 100, // Convertir en décimal
        };
      });

      // Traiter les prévisions horaires (prochaines 24h)
      const hourlyForecast: HourlyForecast[] = hourly.time.slice(0, 24).map((time: string, index: number) => {
        const weather = getWeatherDescription(hourly.weather_code[index]);
        return {
          time: time,
          temp: hourly.temperature_2m[index],
          weather: {
            main: weather.main,
            description: weather.description,
            icon: weather.icon,
          },
          pop: hourly.precipitation_probability[index] / 100, // Convertir en décimal
        };
      });

      // Obtenir les données actuelles détaillées
      const currentHourData = currentHourIndex >= 0 ? {
        humidity: hourly.relative_humidity_2m[currentHourIndex],
        windSpeed: hourly.wind_speed_10m[currentHourIndex],
      } : {
        humidity: 0,
        windSpeed: 0,
      };

      return {
        location: {
          name: data.timezone?.split('/').pop()?.replace('_', ' ') || 'Localisation',
          country: data.timezone?.split('/')[0] || 'Inconnu',
          lat: data.latitude,
          lon: data.longitude,
        },
        current: {
          temp: current.temperature,
          feelsLike: current.temperature, // Open-Meteo ne fournit pas le ressenti
          tempMin: daily.temperature_2m_min[0],
          tempMax: daily.temperature_2m_max[0],
          humidity: currentHourData.humidity,
          pressure: 1013, // Valeur par défaut car Open-Meteo ne fournit pas la pression
          windSpeed: currentHourData.windSpeed,
          windDeg: current.winddirection,
          visibility: 10000, // Valeur par défaut car Open-Meteo ne fournit pas la visibilité
          uvIndex: 0, // Open-Meteo ne fournit pas l'UV
          description: currentWeather.description,
          icon: currentWeather.icon,
          main: currentWeather.main,
        },
        forecast: dailyForecast,
        hourly: hourlyForecast,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données météo:', error);

      if (error.response?.status === 400) {
        throw new Error('Coordonnées invalides.');
      } else if (error.response?.status === 429) {
        throw new Error('Limite de requêtes dépassée. Veuillez réessayer plus tard.');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        throw new Error('Impossible de récupérer les données météo. Veuillez réessayer.');
      }
    }
  },

  // Météo par nom de ville
  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    try {
      const cities = await this.searchCities(cityName);
      if (cities.length === 0) {
        throw new Error('Ville non trouvée');
      }
      return this.getCurrentWeather(cities[0].lat, cities[0].lon);
    } catch (error) {
      console.error('Erreur lors de la récupération de la météo par ville:', error);
      throw error;
    }
  },
};