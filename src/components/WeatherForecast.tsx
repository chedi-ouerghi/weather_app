import { Droplets } from 'lucide-react';
import React from 'react';
import { TemperatureUnit, WeatherData } from '../types/weather';

interface WeatherForecastProps {
  weatherData: WeatherData;
  temperatureUnit: TemperatureUnit;
  convertTemperature: (temp: number, unit: TemperatureUnit) => number;
  getTemperatureSymbol: (unit: TemperatureUnit) => string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({
  weatherData,
  temperatureUnit,
  convertTemperature,
  getTemperatureSymbol,
}) => {
  const { hourly } = weatherData;
  const tempSymbol = getTemperatureSymbol(temperatureUnit);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Prévision horaire</h3>

      <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-2 sm:pb-4">
        {hourly.map((hour, index) => {
          const time = new Date(hour.time);
          const isNow = index === 0;

          return (
            <div
              key={hour.time}
              className={`flex-shrink-0 text-center p-2 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-md ${isNow ? 'bg-blue-500/30 border border-blue-400/40 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="text-white/60 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                {isNow ? 'Maintenant' : time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${hour.weather.icon}@2x.png`}
                alt={hour.weather.description}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2"
              />

              <div className="text-white text-sm sm:text-lg font-bold mb-1 sm:mb-2">
                {convertTemperature(hour.temp, temperatureUnit)}{tempSymbol}
              </div>

              {hour.pop > 0 && (
                <div className="flex items-center justify-center gap-1 text-blue-400 text-xs sm:text-sm">
                  <Droplets className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>{Math.round(hour.pop * 100)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;