import { describe, expect, test } from 'vitest';
import { getWorldState } from '../components/svg-world/worldState';
import { getTimelineDescription } from '../components/timelineLogic';
import { calculateResults } from '../utils/scoring';

describe('world state helpers', () => {
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
});

describe('timeline descriptions', () => {
  const result = calculateResults({});

  test('describes the baseline path for the present day', () => {
    expect(getTimelineDescription(result, 'A', 2026)).toContain('Present Day');
    expect(getTimelineDescription(result, 'A', 2026)).toContain('kg CO2e/year');
  });

  test('describes the shifted path in the mid future', () => {
    expect(getTimelineDescription(result, 'B', 2030)).toContain('saved thousands of kilograms');
  });
});
