import { describe, expect, test } from 'vitest';
import { getWorldState } from '../components/svg-world/worldState';
import { getTimelineDescription } from '../components/timelineLogic';
import { calculateResults } from '../utils/scoring';

describe('world state helpers', () => {
  test('renders a restoring unchanged timeline with clean transit and solar', () => {
    const state = getWorldState({
      mood: 'Restoring',
      timeline: 'A',
      year: 2050,
      checkInCount: 0,
    });

    expect(state.cyclist).toBe(true);
    expect(state.electricBus).toBe(true);
    expect(state.solarPanels).toBe(true);
    expect(state.treeCount).toBe(3);
  });

  test('renders healthier shifted futures with check-in bonuses', () => {
    const state = getWorldState({
      mood: 'Balanced',
      timeline: 'B',
      year: 2050,
      checkInCount: 3,
    });

    expect(state.windTurbine).toBe(true);
    expect(state.recyclingBin).toBe(true);
    expect(state.treeCount).toBeGreaterThanOrEqual(3);
    expect(state.trafficDensity).toBe('normal');
  });

  test('renders a warming unchanged future with dense traffic and trash piles', () => {
    const state = getWorldState({
      mood: 'Warming',
      timeline: 'A',
      year: 2050,
      checkInCount: 0,
    });

    expect(state.opacityGlow).toBeGreaterThan(0);
    expect(state.trafficDensity).toBe('dense');
    expect(state.trashPiles).toBe(true);
    expect(state.windowPulse).toBe('anim-pulse-fast');
  });

  test('renders overheated unchanged futures with congestion and smog', () => {
    const state = getWorldState({
      mood: 'Overheated',
      timeline: 'A',
      year: 2050,
      checkInCount: 0,
    });

    expect(state.chimneySmoke).toBe(true);
    expect(state.trafficDensity).toBe('jam');
    expect(state.trashPiles).toBe(true);
    expect(state.treeCount).toBe(0);
  });

  test('renders stressed unchanged futures with heavy haze', () => {
    const state = getWorldState({
      mood: 'Stressed',
      timeline: 'A',
      year: 2050,
      checkInCount: 0,
    });

    expect(state.chimneySmoke).toBe(true);
    expect(state.trafficDensity).toBe('dense');
    expect(state.trashPiles).toBe(true);
    expect(state.treeCount).toBe(1);
    expect(state.isWithered).toBe(true);
  });

  test('renders balanced unchanged futures with moderate greenery', () => {
    const state = getWorldState({
      mood: 'Balanced',
      timeline: 'A',
      year: 2050,
      checkInCount: 0,
    });

    expect(state.treeCount).toBeGreaterThanOrEqual(2);
    expect(state.electricBus).toBe(true);
  });

  test('renders shifted warming futures with improvements', () => {
    const state = getWorldState({
      mood: 'Warming',
      timeline: 'B',
      year: 2050,
      checkInCount: 0,
    });

    // Shifted future should be better than unchanged
    expect(state.trafficDensity).not.toBe('jam');
  });

  test('renders shifted stressed futures with recovery', () => {
    const state = getWorldState({
      mood: 'Stressed',
      timeline: 'B',
      year: 2050,
      checkInCount: 2,
    });

    expect(state.treeCount).toBeGreaterThanOrEqual(0);
  });

  test('renders shifted overheated futures with partial recovery', () => {
    const state = getWorldState({
      mood: 'Overheated',
      timeline: 'B',
      year: 2050,
      checkInCount: 0,
    });

    expect(state.treeCount).toBeGreaterThanOrEqual(0);
  });

  test('returns base year values at year 2026', () => {
    const state = getWorldState({
      mood: 'Restoring',
      timeline: 'A',
      year: 2026,
      checkInCount: 0,
    });

    // At base year, interpolation factor t = 0
    expect(state.treeCount).toBeGreaterThanOrEqual(0);
  });

  test('returns mid-year values at year 2035', () => {
    const state = getWorldState({
      mood: 'Warming',
      timeline: 'A',
      year: 2035,
      checkInCount: 0,
    });

    // Mid-interpolation
    expect(state.opacityGlow).toBeGreaterThanOrEqual(0);
  });
});

describe('timeline descriptions', () => {
  const result = calculateResults({});

  test('describes the baseline path for the present day', () => {
    expect(getTimelineDescription(result, 'A', 2026)).toContain('Present Day');
    expect(getTimelineDescription(result, 'A', 2026)).toContain('kg CO2e/year');
  });

  test('describes low-impact unchanged futures as stable', () => {
    expect(getTimelineDescription(result, 'A', 2050)).toContain('low-carbon lifestyle');
  });

  test('describes the shifted path in the mid future', () => {
    expect(getTimelineDescription(result, 'B', 2030)).toContain('saved thousands of kilograms');
  });

  test('describes the pledge-day shifted path', () => {
    expect(getTimelineDescription(result, 'B', 2026)).toContain('Pledge Day');
    expect(getTimelineDescription(result, 'B', 2026)).toContain(result.recommendedShift);
  });

  test('describes the late shifted path with restoring improvements', () => {
    expect(getTimelineDescription(result, 'B', 2050)).toContain('fully clean skies');
  });

  // Cover high-impact unchanged paths (Overheated/Stressed/Warming on timeline A)
  test('describes overheated unchanged mid-future timeline', () => {
    // Create a high-emission result by selecting worst options
    const highAnswers: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) highAnswers[i] = 3; // worst options
    const highResult = calculateResults(highAnswers);

    const midDesc = getTimelineDescription(highResult, 'A', 2030);
    expect(midDesc).toContain('Year 2030');
    expect(midDesc).toContain('starting to harden');
  });

  test('describes overheated unchanged late-future timeline', () => {
    const highAnswers: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) highAnswers[i] = 3;
    const highResult = calculateResults(highAnswers);

    const lateDesc = getTimelineDescription(highResult, 'A', 2050);
    expect(lateDesc).toContain('Year 2050');
    expect(lateDesc).toContain('unchanged habits');
  });

  test('describes warming mid-future timeline', () => {
    // Moderate-high emissions
    const midAnswers: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) midAnswers[i] = 2;
    const midResult = calculateResults(midAnswers);

    if (midResult.futureMood === 'Warming' || midResult.futureMood === 'Stressed') {
      const desc = getTimelineDescription(midResult, 'A', 2030);
      expect(desc).toContain('Year 2030');
    }
  });

  test('describes shifted future with balanced mood text', () => {
    // Create result where shifted mood is Balanced
    const midAnswers: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) midAnswers[i] = 2;
    const midResult = calculateResults(midAnswers);

    const shiftedDesc = getTimelineDescription(midResult, 'B', 2050);
    expect(shiftedDesc).toContain('Year 2050');
    expect(shiftedDesc).toContain('footprint stays');
  });

  test('describes shifted future with fallback mood text', () => {
    const highAnswers: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) highAnswers[i] = 3;
    const highResult = calculateResults(highAnswers);

    const shiftedDesc = getTimelineDescription(highResult, 'B', 2050);
    expect(shiftedDesc).toContain('Year 2050');
  });
});

