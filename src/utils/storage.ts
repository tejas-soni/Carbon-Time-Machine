import { ResultData, CheckInHistory, Pledge } from '../types';

const RESULT_KEY = 'ctm_result_data';
const HISTORY_KEY = 'ctm_checkin_history';

export function saveResultData(data: ResultData): void {
  try {
    localStorage.setItem(RESULT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving result data to localStorage', e);
  }
}

export function loadResultData(): ResultData | null {
  try {
    const val = localStorage.getItem(RESULT_KEY);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Error loading result data from localStorage', e);
    return null;
  }
}

export function saveCheckInHistory(history: CheckInHistory): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving check-in history to localStorage', e);
  }
}

export function loadCheckInHistory(): CheckInHistory | null {
  try {
    const val = localStorage.getItem(HISTORY_KEY);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Error loading check-in history from localStorage', e);
    return null;
  }
}

export function getTodayDateString(): string {
  // Returns date as YYYY-MM-DD in local time
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

export function createPledge(pledge: Pledge): CheckInHistory {
  const history: CheckInHistory = {
    pledge,
    checkInDates: []
  };
  saveCheckInHistory(history);
  return history;
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(RESULT_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Error clearing localStorage', e);
  }
}
