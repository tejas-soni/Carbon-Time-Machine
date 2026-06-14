import { describe, test, expect } from 'vitest';
import { calculateResults, getFutureMood } from '../utils/scoring';
import { QuizAnswers } from '../types';

describe('Carbon Scoring Engine Tests', () => {
  test('all lowest impact responses result in lowest footprint and Quiet Saver archetype', () => {
    // Select option 0 for all 12 questions
    const answers: QuizAnswers = {};
    for (let i = 1; i <= 12; i++) {
      answers[i] = 0;
    }

    const results = calculateResults(answers);

    // Summing option 0 values:
    // Q1: 0 kg, Q2: 0 kg, Q3: 0 kg, Q4: 50 kg, Q5: 300 kg,
    // Q6: 0 kg, Q7: 50 kg, Q8: 50 kg, Q9: 50 kg, Q10: 100 kg,
    // Q11: 20 kg, Q12: -100 kg.
    // Total = 0+0+0+50+300+0+50+50+50+100+20-100 = 520 kg CO2e.
    expect(results.totalCo2e).toBe(520);
    expect(results.futureMood).toBe('Restoring');
    
    // Total points should be very low, mapping to Quiet Saver
    expect(results.archetype).toBe('Quiet Saver');
    expect(results.shiftedCo2e).toBeLessThan(results.totalCo2e);
    expect(results.shiftedFutureMood).toBe('Restoring');
  });

  test('all highest impact responses result in highest footprint and Overheated mood', () => {
    // Select the maximum options (index 4 or index 3 depending on question length)
    const answers: QuizAnswers = {
      1: 4, // Car: 4 pts, 2500 kg
      2: 3, // Daily: 4 pts, 1000 kg
      3: 3, // 6+ flights: 4 pts, 5000 kg
      4: 3, // Daily delivery: 4 pts, 800 kg
      5: 3, // Daily meat: 4 pts, 2000 kg
      6: 3, // 7+ hours AC: 4 pts, 1200 kg
      7: 2, // AC set very cold: 3 pts, 800 kg
      8: 2, // Long hot shower: 3 pts, 500 kg
      9: 3, // 4+ clothes: 4 pts, 1200 kg
      10: 3, // 9+ packages: 4 pts, 1000 kg
      11: 3, // Daily plastics: 4 pts, 400 kg
      12: 3  // No recycle: 3 pts, 100 kg
    };

    const results = calculateResults(answers);
    
    // Total CO2e should be max possible: 2500 + 1000 + 5000 + 800 + 2000 + 1200 + 800 + 500 + 1200 + 1000 + 400 + 100 = 16,500 kg CO2e
    expect(results.totalCo2e).toBe(16500);
    expect(results.futureMood).toBe('Overheated');
    expect(results.shiftedCo2e).toBe(16500 - 400); // Convenience Commuter (highest points is transport Q1+Q2+Q3 = 12 pts)
    expect(results.shiftedFutureMood).toBe('Overheated');
  });

  test('correctly maps future moods according to thresholds', () => {
    expect(getFutureMood(500)).toBe('Restoring');
    expect(getFutureMood(1499)).toBe('Restoring');
    expect(getFutureMood(1500)).toBe('Balanced');
    expect(getFutureMood(3499)).toBe('Balanced');
    expect(getFutureMood(3500)).toBe('Warming');
    expect(getFutureMood(5999)).toBe('Warming');
    expect(getFutureMood(6000)).toBe('Stressed');
    expect(getFutureMood(9999)).toBe('Stressed');
    expect(getFutureMood(10000)).toBe('Overheated');
    expect(getFutureMood(20000)).toBe('Overheated');
  });

  test('correctly maps archetype based on highest score category', () => {
    // Make Transport very high:
    // Transport: Q1 (idx 4 = 4 pts), Q2 (idx 3 = 4 pts), Q3 (idx 3 = 4 pts) -> Total = 12 pts
    // Food: Q4 (idx 0 = 0 pts), Q5 (idx 0 = 0 pts) -> 0 pts
    // All others 0 pts
    const answers: QuizAnswers = {
      1: 4, 2: 3, 3: 3,
      4: 0, 5: 0,
      6: 0, 7: 0, 8: 0,
      9: 0, 10: 0,
      11: 0, 12: 0
    };

    const results = calculateResults(answers);
    expect(results.archetype).toBe('Convenience Commuter');

    // Make Waste highest (Q11: idx 3 = 4 pts, Q12: idx 3 = 3 pts -> Total = 7 pts)
    // Keep total points >= 10 to prevent Quiet Saver fallback
    // Transport: 1 (idx 2 = 1 pt)
    // Energy: 6 (idx 2 = 2 pt)
    // Shopping: 9 (idx 1 = 1 pt)
    // Food: 4 (idx 1 = 1 pt)
    // Total points = 7 + 1 + 2 + 1 + 1 = 12 pts.
    const wasteAnswers: QuizAnswers = {
      1: 2, 2: 0, 3: 0, // Transport: 1 pt
      4: 1, 5: 0,       // Food: 1 pt
      6: 2, 7: 0, 8: 0, // Energy: 2 pts
      9: 1, 10: 0,      // Shopping: 1 pt
      11: 3, 12: 3      // Waste: 7 pts (highest)
    };

    const wasteResults = calculateResults(wasteAnswers);
    expect(wasteResults.archetype).toBe('Packaging Accumulator');
  });
});
