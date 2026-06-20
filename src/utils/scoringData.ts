import { Archetype, Question } from '../types';
import type { RecommendationInfo } from './scoring';

/** Complete set of 12 lifestyle habit questions across 5 impact categories. */
export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'transport',
    text: 'How do you get to work, school, or errands most days?',
    options: [
      { text: 'Walk, cycle, or run', points: 0, co2e: 0 },
      { text: 'Work from home / rarely commute', points: 0, co2e: 50 },
      { text: 'Train, bus, or metro (public transit)', points: 1, co2e: 300 },
      { text: 'Motorbike or scooter', points: 2, co2e: 800 },
      { text: 'Car or private ride-share/cab', points: 4, co2e: 2500 },
    ],
  },
  {
    id: 2,
    category: 'transport',
    text: 'How often do you take short car or cab rides (under 10 minutes)?',
    options: [
      { text: 'Never or rarely', points: 0, co2e: 0 },
      { text: '1-2 times per week', points: 1, co2e: 150 },
      { text: '3-5 times per week', points: 2, co2e: 400 },
      { text: 'Daily or almost daily', points: 4, co2e: 1000 },
    ],
  },
  {
    id: 3,
    category: 'transport',
    text: 'How many flights do you take in a typical year?',
    options: [
      { text: '0 flights', points: 0, co2e: 0 },
      { text: '1-2 short flights', points: 2, co2e: 800 },
      { text: '3-5 flights', points: 3, co2e: 2000 },
      { text: '6+ flights', points: 4, co2e: 5000 },
    ],
  },
  {
    id: 4,
    category: 'food',
    text: 'How often do you order food delivery?',
    options: [
      { text: 'Rarely or never', points: 0, co2e: 50 },
      { text: 'Weekly', points: 1, co2e: 150 },
      { text: '3-5 times per week', points: 3, co2e: 450 },
      { text: 'Daily', points: 4, co2e: 800 },
    ],
  },
  {
    id: 5,
    category: 'food',
    text: 'How often do you eat meat-heavy meals?',
    options: [
      { text: 'Never / fully plant-based', points: 0, co2e: 300 },
      { text: 'Weekly', points: 1, co2e: 600 },
      { text: '3-5 times per week', points: 3, co2e: 1200 },
      { text: 'Daily', points: 4, co2e: 2000 },
    ],
  },
  {
    id: 6,
    category: 'energy',
    text: 'On hot days, how long does your air conditioning run?',
    options: [
      { text: "We don't have/use AC", points: 0, co2e: 0 },
      { text: '1-2 hours', points: 1, co2e: 200 },
      { text: '3-6 hours', points: 2, co2e: 500 },
      { text: '7+ hours', points: 4, co2e: 1200 },
    ],
  },
  {
    id: 7,
    category: 'energy',
    text: 'What is your usual cooling temperature habit?',
    options: [
      { text: 'Fan / natural cooling first', points: 0, co2e: 50 },
      { text: 'AC at moderate temperature (24°C+)', points: 1, co2e: 300 },
      { text: 'AC set very cold (18°C-21°C)', points: 3, co2e: 800 },
    ],
  },
  {
    id: 8,
    category: 'energy',
    text: 'What is your typical hot water / shower routine?',
    options: [
      { text: 'Cold showers / short hot showers (<5 mins)', points: 0, co2e: 50 },
      { text: 'Moderate hot showers (5-10 mins)', points: 1, co2e: 200 },
      { text: 'Long hot showers or deep baths (>10 mins)', points: 3, co2e: 500 },
    ],
  },
  {
    id: 9,
    category: 'shopping',
    text: 'How many new clothing items do you buy in a month on average?',
    options: [
      { text: '0 items', points: 0, co2e: 50 },
      { text: '1 item', points: 1, co2e: 200 },
      { text: '2-3 items', points: 2, co2e: 500 },
      { text: '4+ items', points: 4, co2e: 1200 },
    ],
  },
  {
    id: 10,
    category: 'shopping',
    text: 'How many online package deliveries do you receive monthly?',
    options: [
      { text: '0-1 deliveries', points: 0, co2e: 100 },
      { text: '2-3 deliveries', points: 1, co2e: 250 },
      { text: '4-8 deliveries', points: 2, co2e: 500 },
      { text: '9+ deliveries', points: 4, co2e: 1000 },
    ],
  },
  {
    id: 11,
    category: 'waste',
    text: 'How often do you use single-use plastics (bottles, bags, containers)?',
    options: [
      { text: 'Rarely / try to avoid', points: 0, co2e: 20 },
      { text: 'Sometimes', points: 1, co2e: 80 },
      { text: 'Often', points: 2, co2e: 200 },
      { text: 'Daily', points: 4, co2e: 400 },
    ],
  },
  {
    id: 12,
    category: 'waste',
    text: 'What describes your recycling and reusing habit?',
    options: [
      { text: 'Active recycler and composter', points: 0, co2e: -100 },
      { text: 'Recycler but do not compost', points: 1, co2e: -30 },
      { text: 'Rarely recycle or reuse', points: 2, co2e: 0 },
      { text: 'Not currently doing either', points: 3, co2e: 100 },
    ],
  },
];

/** Maps each behavioral archetype to its recommended habit shift and estimated COâ‚‚e savings. */
export const ARCHETYPE_RECOMMENDATIONS: Record<Archetype, RecommendationInfo> = {
  'Convenience Commuter': {
    shiftText: 'Replace two short cab/car rides this week with walking, cycling, or public transit.',
    co2eSaving: 400,
  },
  'Delivery Loop': {
    shiftText: 'Replace one food delivery order this week with a home-cooked, low-packaging plant-based meal.',
    co2eSaving: 300,
  },
  'Cooling Dependent Urbanite': {
    shiftText: 'Raise your AC thermostat by 1Â°C (or use natural ventilation/fans) for five nights this week.',
    co2eSaving: 250,
  },
  'High-Street Shopper': {
    shiftText: 'Delay one non-essential clothing or online purchase by 7 days to break the impulse buy cycle.',
    co2eSaving: 350,
  },
  'Packaging Accumulator': {
    shiftText: 'Commit to using reusable bags and bottles all week, and set up a dedicated recycling bin.',
    co2eSaving: 200,
  },
  'Quiet Saver': {
    shiftText: 'Share your carbon journey with one friend to help spread awareness and start a collective habit change.',
    co2eSaving: 150,
  },
};
