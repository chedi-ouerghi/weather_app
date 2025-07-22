import { useEffect, useState } from 'react';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  error: string | null;
  loading: boolean;
  denied: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    error: null,
    loading: true,
    denied: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'La géolocalisation n\'est pas supportée par ce navigateur',
        loading: false,
        denied: true,
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        error: null,
        loading: false,
        denied: false,
      });
    };

    const handleError = (_error: GeolocationPositionError) => {
      let errorMessage = 'Erreur de géolocalisation';
      let denied = false;
      switch (_error.code) {
        case _error.PERMISSION_DENIED:
          errorMessage = 'Permission de géolocalisation refusée';
          denied = true;
          break;
        case _error.POSITION_UNAVAILABLE:
          errorMessage = 'Position indisponible';
          break;
        case _error.TIMEOUT:
          errorMessage = 'Timeout de géolocalisation';
          break;
      }
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        denied,
      }));
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  }, []);

  const requestLocation = () => {
    setState(prev => ({ ...prev, loading: true, error: null, denied: false }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          loading: false,
          denied: false,
        });
      },
      (_error) => {
        let errorMessage = 'Impossible d\'obtenir votre position';
        let denied = false;
        if (_error.code === _error.PERMISSION_DENIED) {
          errorMessage = 'Permission de géolocalisation refusée';
          denied = true;
        }
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
          denied,
        }));
      }
    );
  };

  return { ...state, requestLocation };
};