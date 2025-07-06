import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WeatherData, TemperatureUnit } from '../types/weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureChartProps {
  weatherData: WeatherData;
  temperatureUnit: TemperatureUnit;
  convertTemperature: (temp: number, unit: TemperatureUnit) => number;
  getTemperatureSymbol: (unit: TemperatureUnit) => string;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  weatherData,
  temperatureUnit,
  convertTemperature,
  getTemperatureSymbol,
}) => {
  const { forecast } = weatherData;
  const tempSymbol = getTemperatureSymbol(temperatureUnit);

  const labels = forecast.map(day => {
    const date = new Date(day.date);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  });

  const maxTemps = forecast.map(day => convertTemperature(day.temp.max, temperatureUnit));
  const minTemps = forecast.map(day => convertTemperature(day.temp.min, temperatureUnit));

  const data = {
    labels,
    datasets: [
      {
        label: `Max ${tempSymbol}`,
        data: maxTemps,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(239, 68, 68)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 3,
      },
      {
        label: `Min ${tempSymbol}`,
        data: minTemps,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}${tempSymbol}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: 'bold',
          },
          callback: function (value) {
            return `${value}${tempSymbol}`;
          },
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round' as const,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/15">
      <h3 className="text-xl font-bold text-white mb-6">Prévision 7 jours</h3>

      <div className="h-80 mb-6">
        <Line data={data} options={options} />
      </div>

      {/* Résumé des prévisions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {forecast.map((day) => (
          <div key={day.date} className="text-center p-2 bg-white/5 rounded-xl">
            <div className="text-white/60 text-xs mb-1">
              {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
              alt={day.weather.description}
              className="w-8 h-8 mx-auto mb-1"
            />
            <div className="text-white text-sm font-semibold">
              {convertTemperature(day.temp.max, temperatureUnit)}°
            </div>
            <div className="text-white/60 text-xs">
              {convertTemperature(day.temp.min, temperatureUnit)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureChart;