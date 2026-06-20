import { FutureMood } from '../../types';

export interface WorldState {
  opacityGlow: number;
  skyStart: string;
  skyEnd: string;
  treeCount: number;
  isWithered: boolean;
  solarPanels: boolean;
  windTurbine: boolean;
  chimneySmoke: boolean;
  trafficDensity: 'normal' | 'dense' | 'jam';
  electricBus: boolean;
  cyclist: boolean;
  trashPiles: boolean;
  recyclingBin: boolean;
  windowPulse: string;
  windowColor: string;
}

export interface WorldStateInput {
  mood: FutureMood;
  timeline: 'A' | 'B';
  year: number;
  checkInCount: number;
}

const BASE_YEAR = 2026;
const TARGET_YEAR = 2050;

function getSeverityFromMood(mood: FutureMood): number {
  if (mood === 'Restoring') return 0;
  if (mood === 'Balanced') return 1;
  if (mood === 'Warming') return 2;
  if (mood === 'Stressed') return 3;
  return 4;
}

export function getWorldState({
  mood,
  timeline,
  year,
  checkInCount,
}: WorldStateInput): WorldState {
  const t = (year - BASE_YEAR) / (TARGET_YEAR - BASE_YEAR);
  const severity = getSeverityFromMood(mood);

  const state: WorldState = {
    opacityGlow: 0,
    skyStart: '#E0F2FE',
    skyEnd: '#93C5FD',
    treeCount: 2,
    isWithered: false,
    solarPanels: false,
    windTurbine: false,
    chimneySmoke: false,
    trafficDensity: 'normal',
    electricBus: false,
    cyclist: false,
    trashPiles: false,
    recyclingBin: false,
    windowPulse: 'anim-pulse-slow',
    windowColor: '#FEF08A',
  };

  if (timeline === 'A') {
    const currentSeverity = 1 + (severity - 1) * t;

    if (currentSeverity <= 0.8) {
      state.skyStart = '#A7F3D0';
      state.skyEnd = '#3B82F6';
      state.treeCount = 3;
      state.cyclist = true;
      state.electricBus = true;
      state.solarPanels = true;
      return state;
    }

    if (currentSeverity <= 1.8) {
      state.electricBus = true;
      return state;
    }

    if (currentSeverity <= 2.8) {
      state.skyStart = '#FDE68A';
      state.opacityGlow = 0.15 * t;
      state.treeCount = 1;
      state.chimneySmoke = true;
      state.trafficDensity = 'dense';
      state.trashPiles = true;
      state.windowColor = '#FBBF24';
      state.windowPulse = 'anim-pulse-fast';
      return state;
    }

    if (currentSeverity <= 3.8) {
      state.skyStart = '#FED7AA';
      state.skyEnd = '#64748B';
      state.opacityGlow = 0.4 * t;
      state.treeCount = 1;
      state.isWithered = true;
      state.chimneySmoke = true;
      state.trafficDensity = 'dense';
      state.trashPiles = true;
      state.windowColor = '#F59E0B';
      state.windowPulse = 'anim-pulse-fast';
      return state;
    }

    state.skyStart = '#FECACA';
    state.skyEnd = '#475569';
    state.opacityGlow = 0.7 * t;
    state.treeCount = 0;
    state.isWithered = true;
    state.chimneySmoke = true;
    state.trafficDensity = 'jam';
    state.trashPiles = true;
    state.windowColor = '#EF4444';
    state.windowPulse = 'anim-pulse-fast';
    return state;
  }

  const targetSeverity = Math.max(0, severity - 1.5);
  const currentSeverity = 1 + (targetSeverity - 1) * t;

  if (currentSeverity <= 0.8) {
    state.skyStart = '#A7F3D0';
    state.skyEnd = '#60A5FA';
    state.treeCount = 3 + (checkInCount > 0 ? 1 : 0);
    state.cyclist = true;
    state.electricBus = true;
    state.solarPanels = true;
    state.windTurbine = true;
    state.recyclingBin = true;
    state.windowColor = '#ECFDF5';
    return state;
  }

  if (currentSeverity <= 1.8) {
    state.skyStart = '#E0F7FA';
    state.treeCount = 2 + (checkInCount > 0 ? 1 : 0);
    state.cyclist = true;
    state.electricBus = true;
    state.solarPanels = true;
    state.windTurbine = true;
    state.recyclingBin = true;
    return state;
  }

  if (currentSeverity <= 2.8) {
    state.skyStart = '#FEF3C7';
    state.opacityGlow = 0.1 * (1 - t);
    state.electricBus = true;
    state.treeCount = 2;
    state.solarPanels = true;
    state.recyclingBin = true;
    return state;
  }

  state.skyStart = '#FFEDD5';
  state.skyEnd = '#CBD5E1';
  state.opacityGlow = 0.25 * (1 - t);
  state.treeCount = 1;
  state.electricBus = true;
  state.solarPanels = true;
  state.recyclingBin = true;
  return state;
}
