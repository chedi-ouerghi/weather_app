import { useState, useEffect, useCallback } from 'react';
import { WeatherData, SearchResult, RecentSearch, TemperatureUnit } from '../types/weather';
import { weatherApi } from '../utils/weatherApi';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');

  // Charger les recherches récentes depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherApp_recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder les recherches récentes dans localStorage
  const saveRecentSearches = useCallback((searches: RecentSearch[]) => {
    localStorage.setItem('weatherApp_recentSearches', JSON.stringify(searches));
    setRecentSearches(searches);
  }, []);

  // Rechercher des villes
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await weatherApi.searchCities(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setSearchResults([]);
    }
  }, []);

  // Obtenir la météo par coordonnées
  const getWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await weatherApi.getCurrentWeather(lat, lon);
      setWeatherData(data);

      // Ajouter aux recherches récentes
      const newSearch: RecentSearch = {
        id: `${lat}-${lon}`,
        name: data.location.name,
        country: data.location.country,
        lastSearched: new Date().toISOString(),
        quickWeather: {
          temp: data.current.temp,
          description: data.current.description,
          icon: data.current.icon,
        },
      };

      const updatedSearches = [
        newSearch,
        ...recentSearches.filter(s => s.id !== newSearch.id),
      ].slice(0, 5);

      saveRecentSearches(updatedSearches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [recentSearches, saveRecentSearches]);

  // Obtenir la météo par nom de ville
  const getWeatherByCity = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await weatherApi.getWeatherByCity(cityName);
      setWeatherData(data);

      // Ajouter aux recherches récentes
      const newSearch: RecentSearch = {
        id: `${data.location.lat}-${data.location.lon}`,
        name: data.location.name,
        country: data.location.country,
        lastSearched: new Date().toISOString(),
        quickWeather: {
          temp: data.current.temp,
          description: data.current.description,
          icon: data.current.icon,
        },
      };

      const updatedSearches = [
        newSearch,
        ...recentSearches.filter(s => s.id !== newSearch.id),
      ].slice(0, 5);

      saveRecentSearches(updatedSearches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [recentSearches, saveRecentSearches]);

  // Conversion de température
  const convertTemperature = useCallback((temp: number, unit: TemperatureUnit): number => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9 / 5) + 32);
    }
    return Math.round(temp);
  }, []);

  // Obtenir le symbole de l'unité
  const getTemperatureSymbol = useCallback((unit: TemperatureUnit): string => {
    return unit === 'celsius' ? '°C' : '°F';
  }, []);

  // Toggle de l'unité de température
  const toggleTemperatureUnit = useCallback(() => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  }, []);

  return {
    weatherData,
    loading,
    error,
    searchResults,
    recentSearches,
    temperatureUnit,
    searchCities,
    getWeatherByCoords,
    getWeatherByCity,
    convertTemperature,
    getTemperatureSymbol,
    toggleTemperatureUnit,
  };
};