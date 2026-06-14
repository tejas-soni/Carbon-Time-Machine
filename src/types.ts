export type QuestionCategory = 'transport' | 'food' | 'energy' | 'shopping' | 'waste';

export interface QuestionOption {
  text: string;
  points: number;
  co2e: number; // in kg CO2e per year
}

export interface Question {
  id: number;
  category: QuestionCategory;
  text: string;
  options: QuestionOption[];
}

export type QuizAnswers = Record<number, number>; // questionId -> selectedOptionIndex

export interface CategoryScores {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
  waste: number;
}

export type Archetype =
  | 'Convenience Commuter'
  | 'Delivery Loop'
  | 'Cooling Dependent Urbanite'
  | 'High-Street Shopper'
  | 'Packaging Accumulator'
  | 'Quiet Saver';

export type FutureMood = 'Restoring' | 'Balanced' | 'Warming' | 'Stressed' | 'Overheated';

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

export interface Pledge {
  archetype: Archetype;
  shiftText: string;
  co2eSaving: number;
  pledgedAt: string; // ISO date string
}

export interface CheckInHistory {
  pledge: Pledge;
  checkInDates: string[]; // YYYY-MM-DD strings
}
