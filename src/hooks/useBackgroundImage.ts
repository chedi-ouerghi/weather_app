import { useEffect, useRef, useState } from 'react';
import { getWeatherBackground } from '../utils/imageApi';

export const useBackgroundImage = (main: string, description: string, temp: number, date: Date) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const previousKeyRef = useRef<string>('');
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

        const key = `${main}-${description}-${temp}-${date.getHours()}`;

        const updateBackground = async () => {
            // Si la météo a changé, déclencher une transition
            if (previousKeyRef.current && previousKeyRef.current !== key) {
                setFadeOut(true);

                setTimeout(async () => {
                    try {
                        const newUrl = getWeatherBackground(main, description, temp, date);
                        await loadImage(newUrl);
                        setImageUrl(newUrl);
                        setLoading(false);
                        setFadeOut(false);
                        previousKeyRef.current = key;
                        imageCacheRef.current.set(key, newUrl);
                    } catch (error) {
                        setImageUrl('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920');
                        setLoading(false);
                        setFadeOut(false);
                    }
                }, 300);
            } else {
                try {
                    const url = getWeatherBackground(main, description, temp, date);
                    await loadImage(url);
                    setImageUrl(url);
                    setLoading(false);
                    previousKeyRef.current = key;
                    imageCacheRef.current.set(key, url);
                } catch (error) {
                    setImageUrl('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920');
                    setLoading(false);
                }
            }
        };

        updateBackground();
    }, [main, description, temp, date]);

    return {
        imageUrl,
        loading,
        fadeOut,
    };
}; 