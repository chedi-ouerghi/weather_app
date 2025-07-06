import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Clock, Navigation } from 'lucide-react';
import { SearchResult, RecentSearch } from '../types/weather';

interface CitySearchProps {
  onSearch: (query: string) => void;
  onSelectCity: (result: SearchResult) => void;
  onSelectRecent: (recent: RecentSearch) => void;
  searchResults: SearchResult[];
  recentSearches: RecentSearch[];
  onRequestLocation: () => void;
  loading: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({
  onSearch,
  onSelectCity,
  onSelectRecent,
  searchResults,
  recentSearches,
  onRequestLocation,
  loading,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Fonction de recherche avec debounce
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(searchQuery);
      }, 300); // Attendre 300ms après la dernière frappe
    } else {
      onSearch('');
    }
  }, [onSearch]);

  // Gérer les changements de requête
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length > 0) {
      setIsOpen(true);
      debouncedSearch(newQuery);
    } else {
      setIsOpen(false);
      debouncedSearch('');
    }
  }, [debouncedSearch]);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = searchResults.length + recentSearches.length + 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex === 0) {
          onRequestLocation();
        } else if (activeIndex <= searchResults.length) {
          const result = searchResults[activeIndex - 1];
          if (result) {
            onSelectCity(result);
            setQuery('');
            setIsOpen(false);
          }
        } else {
          const recent = recentSearches[activeIndex - searchResults.length - 1];
          if (recent) {
            onSelectRecent(recent);
            setQuery('');
            setIsOpen(false);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div className="relative w-96">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 group-hover:text-blue-400 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder="Rechercher une ville..."
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 text-lg group-hover:bg-white/15"
          />
        </div>
      </div>

      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto shadow-2xl"
        >
          {/* Bouton de géolocalisation */}
          <button
            onClick={onRequestLocation}
            disabled={loading}
            className={`w-full px-4 py-4 flex items-center gap-3 hover:bg-white/10 transition-all duration-300 ${activeIndex === 0 ? 'bg-white/20' : ''
              }`}
          >
            <div className="relative">
              <Navigation className="w-5 h-5 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-white font-medium">Utiliser ma position</span>
            {loading && (
              <div className="ml-auto w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </button>

          {/* Résultats de recherche */}
          {searchResults.length > 0 && (
            <div className="border-t border-white/10">
              <div className="px-4 py-2 text-white/60 text-sm font-medium bg-white/5">
                Résultats de recherche
              </div>
              {searchResults.map((result, index) => (
                <button
                  key={`${result.lat}-${result.lon}`}
                  onClick={() => {
                    onSelectCity(result);
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-4 flex items-center gap-3 hover:bg-white/10 transition-all duration-300 ${activeIndex === index + 1 ? 'bg-white/20' : ''
                    }`}
                >
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium">{result.name}</div>
                    <div className="text-white/60 text-sm">
                      {result.state ? `${result.state}, ` : ''}{result.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recherches récentes */}
          {recentSearches.length > 0 && query.length === 0 && (
            <div className="border-t border-white/10">
              <div className="px-4 py-2 text-white/60 text-sm font-medium bg-white/5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                Recherches récentes
              </div>
              {recentSearches.map((recent, index) => (
                <button
                  key={recent.id}
                  onClick={() => {
                    onSelectRecent(recent);
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-4 flex items-center gap-3 hover:bg-white/10 transition-all duration-300 ${activeIndex === index + searchResults.length + 1 ? 'bg-white/20' : ''
                    }`}
                >
                  <div className="relative">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium">{recent.name}</div>
                    <div className="text-white/60 text-sm">{recent.country}</div>
                  </div>
                  {recent.quickWeather && (
                    <div className="text-right">
                      <div className="text-white text-lg font-bold">
                        {Math.round(recent.quickWeather.temp)}°C
                      </div>
                      <div className="text-white/60 text-xs capitalize">
                        {recent.quickWeather.description}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Message si aucun résultat */}
          {searchResults.length === 0 && query.length > 0 && (
            <div className="px-4 py-6 text-center">
              <div className="text-white/60 text-sm">
                Aucune ville trouvée pour "{query}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearch;