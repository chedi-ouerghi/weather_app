import React from 'react';
import { useBackgroundImage } from '../hooks/useBackgroundImage';

interface BackgroundImageProps {
  weatherMain: string;
  description: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ weatherMain }) => {
  const { imageUrl, loading, fadeOut } = useBackgroundImage(weatherMain);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-all duration-1000" />
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: 'brightness(0.3) saturate(1.2)',
        }}
        key={`${weatherMain}-${Date.now()}`} // Force le re-render
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-slate-900/50" />
    </div>
  );
};

export default BackgroundImage;