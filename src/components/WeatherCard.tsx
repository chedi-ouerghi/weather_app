import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  RotateCcw 
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
  temperatureUnit: TemperatureUnit;
  onToggleUnit: () => void;
  convertTemperature: (temp: number, unit: TemperatureUnit) => number;
  getTemperatureSymbol: (unit: TemperatureUnit) => string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  temperatureUnit,
  onToggleUnit,
  convertTemperature,
  getTemperatureSymbol,
}) => {
  const { location, current } = weatherData;
  const tempSymbol = getTemperatureSymbol(temperatureUnit);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/15">
      {/* En-tête avec localisation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{location.name}</h2>
          <p className="text-white/70">{location.country}</p>
        </div>
        <button
          onClick={onToggleUnit}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 group"
          title="Changer d'unité"
        >
          <RotateCcw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>

      {/* Température principale */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}@4x.png`}
            alt={current.description}
            className="w-24 h-24 drop-shadow-lg"
          />
          <div>
            <div className="text-6xl font-bold text-white mb-2">
              {convertTemperature(current.temp, temperatureUnit)}
              <span className="text-2xl font-normal">{tempSymbol}</span>
            </div>
            <p className="text-white/80 text-lg capitalize">{current.description}</p>
          </div>
        </div>
      </div>

      {/* Min/Max du jour */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-2xl">
        <div className="text-center">
          <p className="text-white/60 text-sm">Min</p>
          <p className="text-white text-xl font-semibold">
            {convertTemperature(current.tempMin, temperatureUnit)}{tempSymbol}
          </p>
        </div>
        <div className="text-center">
          <p className="text-white/60 text-sm">Max</p>
          <p className="text-white text-xl font-semibold">
            {convertTemperature(current.tempMax, temperatureUnit)}{tempSymbol}
          </p>
        </div>
        <div className="text-center">
          <p className="text-white/60 text-sm">Ressenti</p>
          <p className="text-white text-xl font-semibold">
            {convertTemperature(current.feelsLike, temperatureUnit)}{tempSymbol}
          </p>
        </div>
      </div>

      {/* Détails météo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <Droplets className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white/60 text-sm">Humidité</p>
            <p className="text-white font-semibold">{current.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <Wind className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-white/60 text-sm">Vent</p>
            <p className="text-white font-semibold">{current.windSpeed} km/h</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <Gauge className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-white/60 text-sm">Pression</p>
            <p className="text-white font-semibold">{current.pressure} hPa</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
          <Eye className="w-5 h-5 text-orange-400" />
          <div>
            <p className="text-white/60 text-sm">Visibilité</p>
            <p className="text-white font-semibold">{(current.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;