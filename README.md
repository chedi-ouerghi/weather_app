# WeatherApp - Application Météo Dynamique

Une application météo moderne et élégante construite avec React, Vite et Tailwind CSS. Elle offre une interface utilisateur immersive avec un design glassmorphisme et des animations fluides, utilisant l'API Open-Meteo gratuite.

## ✨ Fonctionnalités

- **Recherche de ville** avec auto-complétion via l'API de géocodage Open-Meteo
- **Géolocalisation automatique** pour obtenir la météo locale
- **Affichage météo complet** : température actuelle, min/max, ressentie
- **Toggle °C/°F** pour changer d'unité de température
- **Prévision 7 jours** avec graphique animé des températures
- **Indicateur de danger** basé sur les conditions météo
- **Images de fond dynamiques** selon les conditions météo
- **Historique des recherches** avec accès rapide
- **Design responsive** adapté à tous les écrans
- **Animations fluides** et micro-interactions
- **Interface sans scroll** avec layout en grille optimisé

## 🎨 Design

- **Glassmorphisme** avec arrière-plans flous et transparents
- **Palette de couleurs sombres** avec accents colorés
- **Layout en grille 12 colonnes** pour une organisation optimale
- **Design compact** sans scroll, tout le contenu visible sur une page
- **Animations fluides** pour toutes les interactions
- **Interface moderne** inspirée des meilleures applications météo
- **Responsive design** pour mobile, tablette et desktop

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repo>
   cd weather_app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application**
   ```bash
   npm run dev
   ```

L'application sera disponible sur `http://localhost:5173`

**Note :** Aucune clé API n'est requise ! L'application utilise l'API Open-Meteo qui est entièrement gratuite et ne nécessite pas d'authentification.

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Icônes modernes
- **Open-Meteo API** - Données météo gratuites

## 📁 Structure du projet

```
src/
├── components/
│   ├── BackgroundImage.tsx     # Image de fond dynamique
│   ├── CitySearch.tsx          # Recherche de ville
│   ├── DangerGauge.tsx         # Indicateur de danger
│   ├── Loader.tsx              # Composant de chargement
│   ├── TemperatureChart.tsx    # Graphique des températures
│   ├── WeatherCard.tsx         # Carte météo principale
│   └── WeatherForecast.tsx     # Prévision horaire
├── hooks/
│   ├── useGeolocation.ts       # Hook de géolocalisation
│   └── useWeather.ts           # Hook de gestion météo
├── types/
│   └── weather.ts              # Types TypeScript
├── utils/
│   ├── imageApi.ts             # Gestion des images
│   └── weatherApi.ts           # API Open-Meteo
├── App.tsx                     # Composant principal
└── main.tsx                    # Point d'entrée
```

## 🌐 APIs utilisées

- **Open-Meteo** - Données météo gratuites (pas de clé API requise)
- **Geolocation API** - Localisation utilisateur
- **Images de fond** - Gestion locale des images selon les conditions météo

## 📱 Fonctionnalités avancées

### Recherche intelligente
- Auto-complétion avec résultats en temps réel via l'API de géocodage Open-Meteo
- Historique des recherches récentes avec météo rapide
- Navigation au clavier (flèches, entrée, échap)
- Debounce pour optimiser les appels API

### Visualisation des données
- Graphique animé des températures sur 7 jours
- Indicateur de danger basé sur plusieurs critères (température, vent, visibilité)
- Conversion automatique des codes météo WMO en descriptions françaises

### Expérience utilisateur
- **Layout optimisé** : Grille 12 colonnes sans scroll
- **Colonne gauche** : Localisation, jauge de danger, détails météo
- **Colonne centrale** : Température principale et prévisions
- **Colonne droite** : Historique des recherches
- Chargement progressif des données
- Gestion d'erreur avec retry automatique
- Animations fluides et micro-interactions
- Support complet mobile et desktop

## 🔧 Scripts disponibles

- `npm run dev` - Lancer en mode développement
- `npm run build` - Construire pour la production
- `npm run preview` - Prévisualiser la build
- `npm run lint` - Linter le code

## 📊 Métriques et performance

- **Temps de chargement** optimisé avec lazy loading
- **Taille du bundle** minimisée avec tree-shaking
- **Accessibilité** respectant les standards WCAG
- **Performance** optimisée pour tous les appareils
- **Pas de clé API** : Utilisation d'Open-Meteo entièrement gratuit

## 🎯 Prochaines améliorations

- [ ] Notifications push pour les alertes météo
- [ ] Mode sombre/clair
- [ ] Widgets personnalisables
- [ ] Export des données en PDF
- [ ] Intégration avec d'autres APIs météo
- [ ] Prévisions horaires détaillées
- [ ] Alertes météo personnalisées

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**WeatherApp** - Une expérience météo moderne et intuitive 🌤️