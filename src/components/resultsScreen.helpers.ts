import { Archetype, QuestionCategory, ResultData } from '../types';

const MIN_BAR_PERCENT = 8;

export const RESULT_CATEGORIES: QuestionCategory[] = ['transport', 'food', 'energy', 'shopping', 'waste'];

const ARCHETYPE_ICONS: Record<Archetype, string> = {
    'Convenience Commuter': '🚗',
    'Delivery Loop': '🍕',
    'Cooling Dependent Urbanite': '❄️',
    'High-Street Shopper': '🛍️',
    'Packaging Accumulator': '📦',
    'Quiet Saver': '🌱'
};

const CATEGORY_ICONS: Record<QuestionCategory, string> = { transport: '🚲', food: '🥗', energy: '⚡', shopping: '🛍️', waste: '♻️' };

const CATEGORY_MAX_SCORES: Record<QuestionCategory, number> = {
  transport: 12,
  food: 8,
  energy: 10,
  shopping: 8,
  waste: 7,
};

export function getArchetypeIcon(archetype: Archetype): string {
  return ARCHETYPE_ICONS[archetype] || ARCHETYPE_ICONS['Quiet Saver'];
}

export function getArchetypeDescription(archetype: Archetype): string {
  if (archetype === 'Quiet Saver') {
    return 'Your habits are already very light. You lead by quiet example.';
  }

  return `Your footprint is primarily driven by your repeating ${archetype.replace('The ', '')} habits.`;
}

export function getCategoryLabel(category: QuestionCategory): string {
  return `${CATEGORY_ICONS[category]} ${category}`;
}

export function getCategoryBreakdown(result: ResultData) {
  return RESULT_CATEGORIES.map((category) => {
    const score = result.categoryScores[category];
    const maxScore = CATEGORY_MAX_SCORES[category];
    const pct = Math.min(100, Math.max(MIN_BAR_PERCENT, (score / maxScore) * 100));

    return {
      category,
      label: getCategoryLabel(category),
      score,
      pct,
    };
  });
}
