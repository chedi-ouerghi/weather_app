import React from 'react';
import { AlertTriangle, Wind, Droplets } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface DangerGaugeProps {
  weatherData: WeatherData;
}

const DangerGauge: React.FC<DangerGaugeProps> = ({ weatherData }) => {
  const { current } = weatherData;

  // Calcul du niveau de danger (0-100)
  const calculateDangerLevel = (): number => {
    let danger = 0;

    // Température extrême
    if (current.temp < -10 || current.temp > 35) danger += 30;
    else if (current.temp < 0 || current.temp > 30) danger += 15;

    // Vent fort
    if (current.windSpeed > 50) danger += 40;
    else if (current.windSpeed > 30) danger += 20;
    else if (current.windSpeed > 20) danger += 10;

    // Conditions météo dangereuses
    if (current.main === 'Thunderstorm') danger += 50;
    else if (current.main === 'Snow') danger += 30;
    else if (current.main === 'Rain') danger += 20;
    else if (current.main === 'Fog') danger += 15;

    // Humidité extrême
    if (current.humidity > 90) danger += 10;
    else if (current.humidity < 20) danger += 10;

    return Math.min(danger, 100);
  };

  const dangerLevel = calculateDangerLevel();

  const getDangerColor = (level: number): string => {
    if (level >= 70) return 'text-red-400';
    if (level >= 40) return 'text-orange-400';
    if (level >= 20) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getDangerText = (level: number): string => {
    if (level >= 70) return 'Dangerous';
    if (level >= 40) return 'Moderate';
    if (level >= 20) return 'Fair';
    return 'Good';
  };

  return (
    <div className="bg-white/5 rounded-2xl p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${getDangerColor(dangerLevel)}`} />
        <h3 className="text-white font-semibold text-sm sm:text-base">Danger Level</h3>
      </div>

      {/* Gauge circulaire compact */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          {/* Cercle de fond */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          {/* Cercle de progression */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={dangerLevel >= 70 ? '#f87171' : dangerLevel >= 40 ? '#fb923c' : dangerLevel >= 20 ? '#fbbf24' : '#34d399'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(dangerLevel / 100) * 226.19} 226.19`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Valeur au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-lg sm:text-xl font-bold ${getDangerColor(dangerLevel)}`}>
              {dangerLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Texte de statut */}
      <div className="text-center">
        <p className={`text-xs sm:text-sm font-semibold ${getDangerColor(dangerLevel)}`}>
          {getDangerText(dangerLevel)}
        </p>
      </div>

      {/* Détails compacts */}
      <div className="mt-3 sm:mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-blue-400" />
            <span className="text-white/60">Wind</span>
          </div>
          <span className="text-white">{current.windSpeed} km/h</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-400" />
            <span className="text-white/60">Humidity</span>
          </div>
          <span className="text-white">{current.humidity}%</span>
        </div>
      </div>
    </div>
  );
};

export default DangerGauge;