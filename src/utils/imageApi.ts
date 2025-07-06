// Cache pour éviter de recharger les mêmes images
const imageCache = new Map<string, string>();

export const getBackgroundImage = (weatherMain: string): string => {
  // Utiliser des images de Pexels avec des URLs prédéfinies selon la météo
  const weatherImages: { [key: string]: string[] } = {
    'Clear': [
      'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    'Clouds': [
      'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    'Rain': [
      'https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/534297/pexels-photo-534297.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    'Drizzle': [
      'https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    'Thunderstorm': [
      'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/534297/pexels-photo-534297.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/534283/pexels-photo-534283.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/534297/pexels-photo-534297.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    'Snow': [
      'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1198802/pexels-photo-1198802.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1009136/pexels-photo-1009136.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/534297/pexels-photo-534297.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    'Mist': [
      'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1172207/pexels-photo-1172207.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
    'Fog': [
      'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1172207/pexels-photo-1172207.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ],
  };

  // Images de fallback en cas d'erreur
  const fallbackImages = [
    'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];

  const images = weatherImages[weatherMain] || weatherImages['Clear'] || fallbackImages;

  // Sélectionner une image aléatoire
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // Ajouter un timestamp unique pour éviter le cache
  const timestamp = Date.now();
  const separator = randomImage.includes('?') ? '&' : '?';
  const finalUrl = `${randomImage}${separator}t=${timestamp}`;

  // Mettre en cache pour cette session
  imageCache.set(weatherMain, finalUrl);

  return finalUrl;
};

// Fonction pour précharger les images
export const preloadWeatherImages = (weatherMain: string): Promise<void> => {
  return new Promise((resolve) => {
    const url = getBackgroundImage(weatherMain);
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Continuer même en cas d'erreur
    img.src = url;
  });
};