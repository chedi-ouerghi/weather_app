import React, { useState, useEffect } from 'react';
import { getBackgroundImage } from '../utils/imageApi';

interface BackgroundImageProps {
  weatherMain: string;
  description: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ weatherMain, description }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = getBackgroundImage(weatherMain, description);
    setImageUrl(url);
    setLoading(false);
  }, [weatherMain, description]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-all duration-1000" />
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: 'brightness(0.3) saturate(1.2)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-slate-900/50" />
    </div>
  );
};

export default BackgroundImage;