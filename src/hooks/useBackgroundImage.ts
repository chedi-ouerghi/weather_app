import { useState, useEffect, useRef } from 'react';
import { getBackgroundImage } from '../utils/imageApi';

export const useBackgroundImage = (weatherMain: string) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const previousWeatherRef = useRef<string>('');
    const imageCacheRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        const loadImage = async (url: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = url;
            });
        };

        const updateBackground = async () => {
            // Si la météo a changé, déclencher une transition
            if (previousWeatherRef.current && previousWeatherRef.current !== weatherMain) {
                setFadeOut(true);

                // Attendre la fin de la transition de fade-out
                setTimeout(async () => {
                    try {
                        const newUrl = getBackgroundImage(weatherMain);

                        // Précharger l'image
                        await loadImage(newUrl);

                        setImageUrl(newUrl);
                        setLoading(false);
                        setFadeOut(false);
                        previousWeatherRef.current = weatherMain;

                        // Mettre en cache
                        imageCacheRef.current.set(weatherMain, newUrl);
                    } catch (error) {
                        console.error('Erreur lors du chargement de l\'image:', error);
                        // Utiliser une image de fallback
                        setImageUrl('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920');
                        setLoading(false);
                        setFadeOut(false);
                    }
                }, 300);
            } else {
                // Première charge ou même météo
                try {
                    const url = getBackgroundImage(weatherMain);

                    // Précharger l'image
                    await loadImage(url);

                    setImageUrl(url);
                    setLoading(false);
                    previousWeatherRef.current = weatherMain;

                    // Mettre en cache
                    imageCacheRef.current.set(weatherMain, url);
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'image:', error);
                    // Utiliser une image de fallback
                    setImageUrl('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920');
                    setLoading(false);
                }
            }
        };

        updateBackground();
    }, [weatherMain]);

    return {
        imageUrl,
        loading,
        fadeOut,
    };
}; 