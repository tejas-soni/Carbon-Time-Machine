/**
 * @fileoverview Browser localStorage persistence layer.
 * Manages saving/loading of quiz results, pledge commitments,
 * and daily check-in history with error-safe JSON serialization.
 */

import { ResultData, CheckInHistory, Pledge } from '../types';
import { log } from './logger';

const RESULT_KEY = 'ctm_result_data';
const HISTORY_KEY = 'ctm_checkin_history';

/** Persists quiz result data to localStorage. */
export function saveResultData(data: ResultData): void {
  try {
    localStorage.setItem(RESULT_KEY, JSON.stringify(data));
  } catch (e) {
    log('error', 'Error saving result data to localStorage', e);
  }
}

/** Retrieves previously saved quiz result data from localStorage. @returns The saved result data, or null if none exists or data is corrupted. */
export function loadResultData(): ResultData | null {
  try {
    const val = localStorage.getItem(RESULT_KEY);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    log('error', 'Error loading result data from localStorage', e);
    return null;
  }
}

/** Persists check-in history and pledge data to localStorage. */
export function saveCheckInHistory(history: CheckInHistory): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    log('error', 'Error saving check-in history to localStorage', e);
  }
}

/** Retrieves check-in history from localStorage. @returns The saved history, or null if none exists. */
export function loadCheckInHistory(): CheckInHistory | null {
  try {
    const val = localStorage.getItem(HISTORY_KEY);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    log('error', 'Error loading check-in history from localStorage', e);
    return null;
  }
}

/** Returns today's date as a YYYY-MM-DD string in local timezone. */
export function getTodayDateString(): string {
  // Returns date as YYYY-MM-DD in local time
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Records a daily check-in for today. Prevents duplicate entries for the same day. @returns Updated check-in history, or null if no active pledge exists. */
export function addCheckInToday(): CheckInHistory | null {
  const history = loadCheckInHistory();
  if (!history) return null;

  const todayStr = getTodayDateString();
  if (!history.checkInDates.includes(todayStr)) {
    history.checkInDates.push(todayStr);
    saveCheckInHistory(history);
  }
  return history;
}

/**
 * Creates a new pledge commitment and initializes empty check-in tracking.
 * @param pledge - The pledge details including archetype and habit shift text.
 * @returns The newly created check-in history.
 */
export function createPledge(pledge: Pledge): CheckInHistory {
  const history: CheckInHistory = {
    pledge,
    checkInDates: []
  };
  saveCheckInHistory(history);
  return history;
}

/** Removes all Carbon Time Machine data from localStorage. */
export function clearAllData(): void {
  try {
    localStorage.removeItem(RESULT_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    log('error', 'Error clearing localStorage', e);
  }
}
