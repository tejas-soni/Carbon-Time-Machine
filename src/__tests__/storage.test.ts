/**
 * @fileoverview Unit tests for localStorage persistence.
 * Validates JSON serialization, corrupt data handling, and pledge check-in logic.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import {
  saveResultData,
  loadResultData,
  clearAllData,
  createPledge,
  addCheckInToday,
  loadCheckInHistory,
  getTodayDateString
} from '../utils/storage';
import { ResultData, Pledge } from '../types';

// Mock localStorage for Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Storage Helpers Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('can save and load result data', () => {
    const dummyResult: ResultData = {
      answers: { 1: 2, 2: 1 },
      totalCo2e: 1200,
      categoryScores: { transport: 3, food: 0, energy: 0, shopping: 0, waste: 0 },
      archetype: 'Quiet Saver',
      futureMood: 'Restoring',
      recommendedShift: 'Walk instead of cab',
      shiftedCo2e: 1000,
      shiftedFutureMood: 'Restoring'
    };

    saveResultData(dummyResult);
    const loaded = loadResultData();
    expect(loaded).toEqual(dummyResult);
  });

  test('can create a pledge and perform daily check-ins', () => {
    const pledge: Pledge = {
      archetype: 'Convenience Commuter',
      shiftText: 'Replace short cab rides',
      co2eSaving: 400,
      pledgedAt: new Date().toISOString()
    };

    const history = createPledge(pledge);
    expect(history.pledge).toEqual(pledge);
    expect(history.checkInDates).toHaveLength(0);

    const loaded = loadCheckInHistory();
    expect(loaded).toEqual(history);
  });

  test('adds check-in today and prevents duplicates', () => {
    const pledge: Pledge = {
      archetype: 'Convenience Commuter',
      shiftText: 'Replace short cab rides',
      co2eSaving: 400,
      pledgedAt: new Date().toISOString()
    };
    createPledge(pledge);
    
    let history = addCheckInToday();
    
    expect(history).not.toBeNull();
    expect(history?.checkInDates.length).toBe(1);
    
    // Try again today
    history = addCheckInToday();
    expect(history?.checkInDates.length).toBe(1); // Still 1
  });

  test('handles multiple check-ins on different simulated days', () => {
    const pledge: Pledge = {
      archetype: 'Convenience Commuter',
      shiftText: 'Replace short cab rides',
      co2eSaving: 400,
      pledgedAt: new Date().toISOString()
    };
    createPledge(pledge);
    
    // Simulate day 1 check-in
    const history1 = addCheckInToday()!;
    expect(history1.checkInDates.length).toBe(1);
    
    // Manually manipulate storage to simulate a previous day
    const oldDate = '2020-01-01';
    history1.checkInDates = [oldDate];
    localStorage.setItem('ctm_checkin_history', JSON.stringify(history1));
    
    // Simulate check-in "today"
    const history2 = addCheckInToday()!;
    expect(history2.checkInDates.length).toBe(2);
    expect(history2.checkInDates).toContain(oldDate);
    expect(history2.checkInDates).toContain(getTodayDateString());
  });

  test('clearAllData removes results and check-in history', () => {
    const pledge: Pledge = {
      archetype: 'Quiet Saver',
      shiftText: 'Share journey',
      co2eSaving: 150,
      pledgedAt: new Date().toISOString()
    };
    createPledge(pledge);
    
    const dummyResult: ResultData = {
      answers: {},
      totalCo2e: 500,
      categoryScores: { transport: 0, food: 0, energy: 0, shopping: 0, waste: 0 },
      archetype: 'Quiet Saver',
      futureMood: 'Restoring',
      recommendedShift: 'Share journey',
      shiftedCo2e: 350,
      shiftedFutureMood: 'Restoring'
    };
    saveResultData(dummyResult);

    expect(loadResultData()).not.toBeNull();
    expect(loadCheckInHistory()).not.toBeNull();

    clearAllData();

    expect(loadResultData()).toBeNull();
    expect(loadCheckInHistory()).toBeNull();
  });

  test('getTodayDateString returns YYYY-MM-DD format', () => {
    const today = getTodayDateString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('loadResultData returns null for corrupted JSON', () => {
    localStorage.setItem('ctm_result_data', 'not-valid-json{{{');
    const result = loadResultData();
    expect(result).toBeNull();
  });

  test('loadCheckInHistory returns null for corrupted JSON', () => {
    localStorage.setItem('ctm_checkin_history', '<<<invalid>>>');
    const result = loadCheckInHistory();
    expect(result).toBeNull();
  });

  test('addCheckInToday returns null when no pledge exists', () => {
    const result = addCheckInToday();
    expect(result).toBeNull();
  });
});
