/**
 * @fileoverview Carbon footprint scoring engine.
 * Calculates COâ‚‚e emissions, determines behavioral archetypes,
 * maps future mood states, and generates habit shift recommendations.
 */

import { QuizAnswers, ResultData, Archetype, FutureMood, CategoryScores } from '../types';
import { ARCHETYPE_RECOMMENDATIONS, QUESTIONS } from './scoringData';

/** COâ‚‚e threshold boundaries (kg/year) for determining future city mood. */
const CO2E_THRESHOLDS = {
  RESTORING_MAX: 1500,
  BALANCED_MAX: 3500,
  WARMING_MAX: 6000,
  STRESSED_MAX: 10000,
} as const;

/** Minimum total quiz points required to assign a specific archetype. Below this, user is a 'Quiet Saver'. */
const MIN_ARCHETYPE_POINTS = 10;

/** Maps quiz categories to their corresponding behavioral archetypes. */
const CATEGORY_TO_ARCHETYPE: Record<keyof CategoryScores, Archetype> = {
  transport: 'Convenience Commuter',
  food: 'Delivery Loop',
  energy: 'Cooling Dependent Urbanite',
  shopping: 'High-Street Shopper',
  waste: 'Packaging Accumulator',
};

export interface RecommendationInfo {
  shiftText: string;
  co2eSaving: number;
}

/**
 * Determines the future city mood based on annual COâ‚‚e emissions.
 * @param co2e - Total annual carbon emissions in kg COâ‚‚e.
 * @returns The projected future mood classification.
 */
export function getFutureMood(co2e: number): FutureMood {
  if (co2e < CO2E_THRESHOLDS.RESTORING_MAX) return 'Restoring';
  if (co2e < CO2E_THRESHOLDS.BALANCED_MAX) return 'Balanced';
  if (co2e < CO2E_THRESHOLDS.WARMING_MAX) return 'Warming';
  if (co2e < CO2E_THRESHOLDS.STRESSED_MAX) return 'Stressed';
  return 'Overheated';
}

/**
 * Processes quiz answers to produce a complete carbon footprint analysis.
 * Calculates total emissions, determines the behavioral archetype,
 * projects the future mood, and recommends a single habit shift.
 * @param answers - Map of question IDs to selected option indices.
 * @returns Complete result data including emissions, archetype, and recommendations.
 */
export function calculateResults(answers: QuizAnswers): ResultData {
  let totalCo2e = 0;
  const categoryScores: CategoryScores = {
    transport: 0,
    food: 0,
    energy: 0,
    shopping: 0,
    waste: 0,
  };

  QUESTIONS.forEach((question) => {
    const selectedIdx = answers[question.id];
    const option =
      selectedIdx !== undefined && question.options[selectedIdx]
        ? question.options[selectedIdx]
        : question.options[0];

    totalCo2e += option.co2e;
    categoryScores[question.category] += option.points;
  });

  let archetype: Archetype = 'Quiet Saver';
  let maxScore = -1;
  const categories: (keyof CategoryScores)[] = ['transport', 'food', 'energy', 'shopping', 'waste'];
  const totalPoints = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);

  if (totalPoints >= MIN_ARCHETYPE_POINTS) {
    categories.forEach((category) => {
      if (categoryScores[category] > maxScore) {
        maxScore = categoryScores[category];
        archetype = CATEGORY_TO_ARCHETYPE[category];
      }
    });
  }

  const futureMood = getFutureMood(totalCo2e);
  const recommendation = ARCHETYPE_RECOMMENDATIONS[archetype];
  const shiftedCo2e = Math.max(0, totalCo2e - recommendation.co2eSaving);
  let shiftedFutureMood = getFutureMood(shiftedCo2e);

  if (shiftedFutureMood === futureMood) {
    const moods: FutureMood[] = ['Restoring', 'Balanced', 'Warming', 'Stressed', 'Overheated'];
    const idx = moods.indexOf(futureMood);
    if (idx > 0) {
      shiftedFutureMood = moods[idx - 1];
    }
  }

  return {
    answers,
    totalCo2e,
    categoryScores,
    archetype,
    futureMood,
    recommendedShift: recommendation.shiftText,
    shiftedCo2e,
    shiftedFutureMood,
  };
}

export { ARCHETYPE_RECOMMENDATIONS, QUESTIONS };
