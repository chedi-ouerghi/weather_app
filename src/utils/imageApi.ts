// Cache pour éviter de recharger les mêmes images
const imageCache = new Map<string, string>();

// Nouvelle fonction pour déterminer le moment de la journée
function getTimeOfDay(hour: number): 'day' | 'night' {
  return hour >= 6 && hour < 20 ? 'day' : 'night';
}

// Mapping amélioré : météo + température + moment de la journée
const weatherImageMap: Record<string, Record<'day' | 'night', string[]>> = {
  'Clear': {
    day: [
      'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1920', // ciel étoilé
      'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
  'Clouds': {
    day: [
      'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
  'Rain': {
    day: [
      'https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
  'Thunderstorm': {
    day: [
      'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/534297/pexels-photo-534297.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/534283/pexels-photo-534283.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
  'Snow': {
    day: [
      'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1198802/pexels-photo-1198802.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1009136/pexels-photo-1009136.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
  'Mist': {
    day: [
      'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/1172207/pexels-photo-1172207.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
  'Fog': {
    day: [
      'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/1172207/pexels-photo-1172207.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
  'Drizzle': {
    day: [
      'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    night: [
      'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  },
};

// Fallback images
const fallbackImages = [
  'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

// Nouvelle fonction principale
export function getWeatherBackground(main: string, description: string, temp: number, date: Date): string {
  const hour = date.getHours();
  const timeOfDay = getTimeOfDay(hour);
  let key = main;

  // Gestion fine selon la température
  if (main === 'Clear') {
    if (temp < 5) key = 'Snow'; // ciel clair mais froid = ambiance neige
    if (temp > 30) key = 'Clear'; // ciel clair et chaud
  }
  if (main === 'Clouds' && temp < 5) key = 'Snow';
  if (main === 'Rain' && temp < 0) key = 'Snow';

  const images = weatherImageMap[key]?.[timeOfDay] || fallbackImages;
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const timestamp = Date.now();
  const separator = randomImage.includes('?') ? '&' : '?';
  return `${randomImage}${separator}t=${timestamp}`;
}

// Fonction pour précharger les images
export const preloadWeatherImages = (main: string, description: string, temp: number, date: Date): Promise<void> => {
  return new Promise((resolve) => {
    const url = getWeatherBackground(main, description, temp, date);
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Continuer même en cas d'erreur
    img.src = url;
  });
};