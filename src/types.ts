/**
 * @fileoverview Shared TypeScript type definitions for Carbon Time Machine.
 * Defines all interfaces, types, and enums used across the application.
 */

/** The five lifestyle impact categories assessed by the quiz. */
export type QuestionCategory = 'transport' | 'food' | 'energy' | 'shopping' | 'waste';

/** A single answer option within a quiz question. */
export interface QuestionOption {
  text: string;
  points: number;
  co2e: number; // in kg CO2e per year
}

/** A quiz question with its category, text, and available options. */
export interface Question {
  id: number;
  category: QuestionCategory;
  text: string;
  options: QuestionOption[];
}

/** Maps question IDs to the index of the user's selected option. */
export type QuizAnswers = Record<number, number>; // questionId -> selectedOptionIndex

/** Aggregated impact scores per lifestyle category. */
export interface CategoryScores {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
  waste: number;
}

/** Behavioral archetypes that characterize a user's primary carbon impact pattern. */
export type Archetype =
  | 'Convenience Commuter'
  | 'Delivery Loop'
  | 'Cooling Dependent Urbanite'
  | 'High-Street Shopper'
  | 'Packaging Accumulator'
  | 'Quiet Saver';

/** Projected future city mood states, from best to worst environmental outcome. */
export type FutureMood = 'Restoring' | 'Balanced' | 'Warming' | 'Stressed' | 'Overheated';

/** Complete quiz result data including emissions, archetype, and shift recommendations. */
export interface ResultData {
  answers: QuizAnswers;
  totalCo2e: number;
  categoryScores: CategoryScores;
  archetype: Archetype;
  futureMood: FutureMood;
  recommendedShift: string;
  shiftedCo2e: number;
  shiftedFutureMood: FutureMood;
}

/** A user's commitment to change one specific repeating habit. */
export interface Pledge {
  archetype: Archetype;
  shiftText: string;
  co2eSaving: number;
  pledgedAt: string; // ISO date string
}

/** Tracks a user's pledge and their daily check-in progress. */
export interface CheckInHistory {
  pledge: Pledge;
  checkInDates: string[]; // YYYY-MM-DD strings
}
