import React from 'react';
import { useBackgroundImage } from '../hooks/useBackgroundImage';

interface BackgroundImageProps {
  weatherMain: string;
  description: string;
  temp: number;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ weatherMain, description, temp }) => {
  // On utilise la date locale pour le moment de la journée
  const now = new Date();
  const { imageUrl, loading, fadeOut } = useBackgroundImage(weatherMain, description, temp, now);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-all duration-1000" />
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: 'brightness(0.3) saturate(1.2)',
        }}
        key={`${weatherMain}-${description}-${temp}-${now.getHours()}`}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-slate-900/50" />
    </div>
  );
};

export default BackgroundImage;