// theme/colors.ts
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

export const colors = fullConfig.theme?.colors as Record<string, any>;

export const customMapStyles = [
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#cadde8" }]
  },
    {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#b1e3d6" }]
  },
];
