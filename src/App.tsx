import { useEffect } from 'react';
import { Cloud, AlertCircle, RefreshCw, Clock, Navigation, Wind, Droplets, Eye } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import BackgroundImage from './components/BackgroundImage';
import CitySearch from './components/CitySearch';
import DangerGauge from './components/DangerGauge';
import Loader from './components/Loader';

function App() {
  const {
    weatherData,
    loading,
    error,
    searchResults,
    recentSearches,
    temperatureUnit,
    searchCities,
    getWeatherByCoords,
    convertTemperature,
    toggleTemperatureUnit,
  } = useWeather();

  const {
    lat,
    lon,
    error: geoError,
    loading: geoLoading,
    requestLocation
  } = useGeolocation();

  // Charger la météo automatiquement si géolocalisation disponible
  useEffect(() => {
    if (lat && lon && !weatherData) {
      getWeatherByCoords(lat, lon);
    }
  }, [lat, lon, weatherData, getWeatherByCoords]);

  const handleSelectCity = (result: { lat: number; lon: number }) => {
    getWeatherByCoords(result.lat, result.lon);
  };

  const handleSelectRecent = (recent: { id: string }) => {
    const [lat, lon] = recent.id.split('-').map(Number);
    getWeatherByCoords(lat, lon);
  };

  const handleRetry = () => {
    if (lat && lon) {
      getWeatherByCoords(lat, lon);
    } else {
      requestLocation();
    }
  };

  return (
    <div className="h-screen relative overflow-hidden bg-slate-900">
      {/* Background Image */}
      {weatherData && (
        <BackgroundImage
          weatherMain={weatherData.current.main}
          description={weatherData.current.description}
        />
      )}

      {/* Main Container */}
      <div className="relative z-10 h-screen p-6">
        <div className="h-full max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader />
              <p className="text-white/80 mt-4">Chargement des données météo...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-3xl p-8 text-center max-w-md">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Erreur</h2>
                <p className="text-white/80 mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Weather Dashboard */}
          {weatherData && !loading && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Cloud className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    WeatherMap
                  </h1>
                </div>

                <CitySearch
                  onSearch={searchCities}
                  onSelectCity={handleSelectCity}
                  onSelectRecent={handleSelectRecent}
                  searchResults={searchResults}
                  recentSearches={recentSearches}
                  onRequestLocation={requestLocation}
                  loading={geoLoading}
                />
              </div>

              {/* Main Content Grid */}
              <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left Column - Location & Danger */}
                <div className="col-span-3 space-y-4">
                  {/* Current Location */}
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      {weatherData.location.name}, {weatherData.location.country}
                    </div>
                    <div className="text-white text-sm">
                      {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </div>
                  </div>

                  {/* Danger Gauge */}
                  <DangerGauge weatherData={weatherData} />

                  {/* Weather Details */}
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-3">
                    <h3 className="text-white font-semibold text-sm">Détails météo</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-3 h-3 text-blue-400" />
                          <span className="text-white/60">Humidité</span>
                        </div>
                        <span className="text-white">{weatherData.current.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Wind className="w-3 h-3 text-green-400" />
                          <span className="text-white/60">Vent</span>
                        </div>
                        <span className="text-white">{weatherData.current.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3 text-orange-400" />
                          <span className="text-white/60">Visibilité</span>
                        </div>
                        <span className="text-white">{(weatherData.current.visibility / 1000).toFixed(1)} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Column - Main Weather */}
                <div className="col-span-6 flex flex-col justify-center">
                  {/* Main Temperature */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <button
                        onClick={toggleTemperatureUnit}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${temperatureUnit === 'celsius'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        °C
                      </button>
                      <button
                        onClick={toggleTemperatureUnit}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${temperatureUnit === 'fahrenheit'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        °F
                      </button>
                    </div>

                    <div className="text-8xl font-light text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {convertTemperature(weatherData.current.temp, temperatureUnit)}°
                    </div>

                    <div className="text-white/80 text-xl mb-6 capitalize">
                      {weatherData.current.description}
                    </div>

                    {/* Min/Max/Feels Like */}
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <p className="text-white/60 text-sm">Min</p>
                        <p className="text-white text-xl font-semibold">
                          {convertTemperature(weatherData.current.tempMin, temperatureUnit)}°
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/60 text-sm">Max</p>
                        <p className="text-white text-xl font-semibold">
                          {convertTemperature(weatherData.current.tempMax, temperatureUnit)}°
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/60 text-sm">Ressenti</p>
                        <p className="text-white text-xl font-semibold">
                          {convertTemperature(weatherData.current.feelsLike, temperatureUnit)}°
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Forecast */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      {weatherData.forecast.slice(0, 6).map((day) => (
                        <div key={day.date} className="text-center">
                          {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </div>
                      ))}
                    </div>

                    {/* Temperature Chart */}
                    <div className="relative h-16">
                      <svg className="w-full h-full" viewBox="0 0 600 64">
                        <defs>
                          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f87171" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M 50 ${32 - (convertTemperature(weatherData.forecast[0]?.temp.day || 20, temperatureUnit) - 15)} 
                             Q 150 ${32 - (convertTemperature(weatherData.forecast[1]?.temp.day || 22, temperatureUnit) - 15)} 
                               200 ${32 - (convertTemperature(weatherData.forecast[1]?.temp.day || 22, temperatureUnit) - 15)}
                             Q 250 ${32 - (convertTemperature(weatherData.forecast[2]?.temp.day || 25, temperatureUnit) - 15)} 
                               300 ${32 - (convertTemperature(weatherData.forecast[2]?.temp.day || 25, temperatureUnit) - 15)}
                             Q 350 ${32 - (convertTemperature(weatherData.forecast[3]?.temp.day || 23, temperatureUnit) - 15)} 
                               400 ${32 - (convertTemperature(weatherData.forecast[3]?.temp.day || 23, temperatureUnit) - 15)}
                             Q 450 ${32 - (convertTemperature(weatherData.forecast[4]?.temp.day || 28, temperatureUnit) - 15)} 
                               500 ${32 - (convertTemperature(weatherData.forecast[4]?.temp.day || 28, temperatureUnit) - 15)}
                             Q 550 ${32 - (convertTemperature(weatherData.forecast[5]?.temp.day || 25, temperatureUnit) - 15)} 
                               550 ${32 - (convertTemperature(weatherData.forecast[5]?.temp.day || 25, temperatureUnit) - 15)}`}
                          stroke="url(#tempGradient)"
                          strokeWidth="2"
                          fill="none"
                          className="animate-pulse"
                        />
                        {weatherData.forecast.slice(0, 6).map((day, index) => (
                          <circle
                            key={day.date}
                            cx={50 + index * 100}
                            cy={32 - (convertTemperature(day.temp.day, temperatureUnit) - 15)}
                            r="3"
                            fill="white"
                            className="drop-shadow-lg"
                          />
                        ))}
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-white text-sm font-semibold">
                      {weatherData.forecast.slice(0, 6).map((day) => (
                        <div key={day.date} className="text-center">
                          {convertTemperature(day.temp.day, temperatureUnit)}°
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column - Recent Searches */}
                <div className="col-span-3">
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-orange-400" />
                      <h3 className="text-white font-semibold">Recherches récentes</h3>
                    </div>

                    <div className="space-y-2 max-h-[calc(100%-3rem)] overflow-y-auto">
                      {recentSearches.slice(0, 8).map((recent) => (
                        <button
                          key={recent.id}
                          onClick={() => handleSelectRecent(recent)}
                          className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                        >
                          <div className="text-left">
                            <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                              {recent.name}
                            </div>
                            <div className="text-white/60 text-xs">{recent.country}</div>
                          </div>
                          {recent.quickWeather && (
                            <div className="text-right">
                              <div className="text-white text-sm font-bold">
                                {Math.round(recent.quickWeather.temp)}°
                              </div>
                              <div className="text-white/60 text-xs capitalize">
                                {recent.quickWeather.description}
                              </div>
                            </div>
                          )}
                        </button>
                      ))}

                      {recentSearches.length === 0 && (
                        <div className="text-center py-8">
                          <div className="text-white/40 text-sm">
                            Aucune recherche récente
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!weatherData && !loading && !error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="relative mb-6">
                  <Cloud className="w-24 h-24 text-white/50 mx-auto" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Bienvenue dans WeatherMap
                </h2>
                <p className="text-white/80 text-lg mb-6">
                  Découvrez la météo en temps réel
                </p>
                <button
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Navigation className="w-5 h-5" />
                  {geoLoading ? 'Détection...' : 'Utiliser ma position'}
                </button>
                {geoError && (
                  <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/30 rounded-2xl p-4 mt-4">
                    <p className="text-orange-200 text-sm">{geoError}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;