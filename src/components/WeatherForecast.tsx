import React from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';

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
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/15">
      <h3 className="text-xl font-bold text-white mb-6">Prévision horaire</h3>
      
      <div className="flex overflow-x-auto gap-4 pb-4">
        {hourly.map((hour, index) => {
          const time = new Date(hour.time);
          const isNow = index === 0;
          
          return (
            <div
              key={hour.time}
              className={`flex-shrink-0 text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isNow ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-white/60 text-sm font-medium mb-2">
                {isNow ? 'Maintenant' : time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather.icon}@2x.png`}
                alt={hour.weather.description}
                className="w-12 h-12 mx-auto mb-2"
              />
              
              <div className="text-white text-lg font-bold mb-2">
                {convertTemperature(hour.temp, temperatureUnit)}{tempSymbol}
              </div>
              
              {hour.pop > 0 && (
                <div className="flex items-center justify-center gap-1 text-blue-400 text-sm">
                  <Droplets className="w-3 h-3" />
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