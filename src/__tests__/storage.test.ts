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

    const todayStr = getTodayDateString();
    const updatedHistory = addCheckInToday();
    
    expect(updatedHistory).not.toBeNull();
    expect(updatedHistory?.checkInDates).toContain(todayStr);
    expect(updatedHistory?.checkInDates).toHaveLength(1);

    // Repeated check-in on the same day shouldn't duplicate
    const checkinAgain = addCheckInToday();
    expect(checkinAgain?.checkInDates).toHaveLength(1);
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
});
