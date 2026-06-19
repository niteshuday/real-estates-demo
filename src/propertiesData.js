import { DUMMY_PROPERTIES_NOMENCLATURE } from './config.js';

// Import our custom pre-generated high-quality images
import luxuryVillaSunset from './assets/images/luxury_villa_sunset_1781881543596.jpg';
import cityPenthouseLiving from './assets/images/city_penthouse_living_1781881562564.jpg';
import minimalTownhouseExterior from './assets/images/minimal_townhouse_exterior_1781881580520.jpg';

export const PROPERTIES = [
  {
    id: 'prop-1',
    title: DUMMY_PROPERTIES_NOMENCLATURE.prop1.title,
    price: 485000000,
    type: 'villa',
    location: DUMMY_PROPERTIES_NOMENCLATURE.prop1.location,
    beds: 5,
    baths: 6,
    sqft: 6850,
    image: luxuryVillaSunset,
    description: 'An architectural masterwork nestled on a tranquil hillside, offering seamless indoor-outdoor living, an expansive glass infinity pool with premium coastal vistas, bespoke marble layouts, and state-of-the-art home-automation system. Perfect for ultra-premium coastal privacy.',
    amenities: DUMMY_PROPERTIES_NOMENCLATURE.prop1.amenities,
    featured: true,
    yearBuilt: 2024,
    status: 'available'
  },
  {
    id: 'prop-2',
    title: DUMMY_PROPERTIES_NOMENCLATURE.prop2.title,
    price: 750000000,
    type: 'penthouse',
    location: DUMMY_PROPERTIES_NOMENCLATURE.prop2.location,
    beds: 4,
    baths: 5,
    sqft: 8400,
    image: cityPenthouseLiving,
    description: 'Breathtaking boutique mansion design featuring double-height colonial pillars, a grand sprawling central courtyard staircase, and wrapping floor-to-ceiling glass panel windows facing manicured lawns. Located in an ultra-exclusive political and administrative district.',
    amenities: DUMMY_PROPERTIES_NOMENCLATURE.prop2.amenities,
    featured: true,
    yearBuilt: 2023,
    status: 'available'
  },
  {
    id: 'prop-3',
    title: DUMMY_PROPERTIES_NOMENCLATURE.prop3.title,
    price: 520000000,
    type: 'townhouse',
    location: DUMMY_PROPERTIES_NOMENCLATURE.prop3.location,
    beds: 3,
    baths: 4,
    sqft: 4500,
    image: minimalTownhouseExterior,
    description: 'Contemporary sky penthouse home showcasing uninterrupted panoramas of the iconic shoreline bridge. Tailored with Italian Carrara marble floor tiles, high-ceiling visual voids, and a gorgeous private sky deck.',
    amenities: DUMMY_PROPERTIES_NOMENCLATURE.prop3.amenities,
    featured: true,
    yearBuilt: 2025,
    status: 'available'
  },
  {
    id: 'prop-4',
    title: DUMMY_PROPERTIES_NOMENCLATURE.prop4.title,
    price: 185000000,
    type: 'villa',
    location: DUMMY_PROPERTIES_NOMENCLATURE.prop4.location,
    beds: 4,
    baths: 4.5,
    sqft: 5200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'A stunning modern estate perched on the tranquil foothills. Experience beautiful early-morning mist from your cantilevered timber decks, surrounded by organic orchards and infinity pool views.',
    amenities: DUMMY_PROPERTIES_NOMENCLATURE.prop4.amenities,
    featured: false,
    yearBuilt: 2022,
    status: 'available'
  },
  {
    id: 'prop-5',
    title: DUMMY_PROPERTIES_NOMENCLATURE.prop5.title,
    price: 125000000,
    type: 'apartment',
    location: DUMMY_PROPERTIES_NOMENCLATURE.prop5.location,
    beds: 4,
    baths: 4,
    sqft: 4100,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    description: 'A high-contrast Scandinavian-tropical boutique villa blending exposed brick partitions with polished coconut-wood details. Highlighted by a secret tropical splash garden, premium brass fittings, and private terrace lounge.',
    amenities: DUMMY_PROPERTIES_NOMENCLATURE.prop5.amenities,
    featured: false,
    yearBuilt: 2021,
    status: 'available'
  },
  {
    id: 'prop-6',
    title: DUMMY_PROPERTIES_NOMENCLATURE.prop6.title,
    price: 310000000,
    type: 'villa',
    location: DUMMY_PROPERTIES_NOMENCLATURE.prop6.location,
    beds: 4,
    baths: 5,
    sqft: 6100,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    description: 'Directly overlooking lush standard golf fairways. Features elegant acoustic-insulated ceiling treatments, high-end automated air-purification arrays, and customized walk-in wardrobes with fingerprint entry access.',
    amenities: DUMMY_PROPERTIES_NOMENCLATURE.prop6.amenities,
    featured: false,
    yearBuilt: 2019,
    status: 'available'
  }
];
