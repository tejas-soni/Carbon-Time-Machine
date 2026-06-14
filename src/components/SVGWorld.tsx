import React from 'react';
import { FutureMood } from '../types';

interface SVGWorldProps {
  mood: FutureMood;
  timeline: 'A' | 'B'; // A = Continue Unchanged, B = Shifted Habit
  year: number;       // 2026, 2030, 2035
  checkInCount: number; // Daily check-ins (adds extra green sparkles/flourish)
}

export const SVGWorld: React.FC<SVGWorldProps> = ({
  mood,
  timeline,
  year,
  checkInCount
}) => {
  // Map years to progress parameter t (0.0 to 1.0)
  const t = (year - 2026) / 9; // 2026 = 0, 2035 = 1

  // Determine the effective mood based on timeline progress
  // Today (t=0) is always relatively balanced.
  // By 2035 (t=1), it reaches the full severity of Timeline A or the improvement of Timeline B.
  const getEffectiveState = () => {
    let opacityGlow = 0;       // heat glow overlay opacity
    let skyStart = '#E0F2FE';  // sky blue
    let skyEnd = '#93C5FD';
    let treeCount = 2;         // 0 to 4
    let isWithered = false;    // withered branches
    let solarPanels = false;   // show solar panels
    let windTurbine = false;   // show turbine
    let chimneySmoke = false;  // show smoking chimney
    let trafficDensity = 'normal'; // low, normal, dense
    let electricBus = false;
    let cyclist = false;
    let trashPiles = false;
    let recyclingBin = false;
    let windowPulse = 'anim-pulse-slow';
    let windowColor = '#FEF08A'; // light yellow

    // Calculate severe level base on original mood
    let severity = 2; // 0 = restoring, 4 = overheated
    if (mood === 'Restoring') severity = 0;
    else if (mood === 'Balanced') severity = 1;
    else if (mood === 'Warming') severity = 2;
    else if (mood === 'Stressed') severity = 3;
    else if (mood === 'Overheated') severity = 4;

    if (timeline === 'A') {
      // Timeline A: Habits continue. Things get progressively worse if severity > 1.
      const currentSeverity = 1 + (severity - 1) * t;

      if (currentSeverity <= 0.8) {
        // Very healthy / Restoring
        skyStart = '#A7F3D0'; // Mint
        skyEnd = '#3B82F6';   // Clean blue
        treeCount = 3;
        cyclist = true;
        electricBus = true;
        solarPanels = true;
      } else if (currentSeverity <= 1.8) {
        // Balanced
        skyStart = '#E0F2FE';
        skyEnd = '#93C5FD';
        treeCount = 2;
        cyclist = false;
        electricBus = true;
      } else if (currentSeverity <= 2.8) {
        // Warming
        skyStart = '#FDE68A'; // Pale yellow/orange
        skyEnd = '#93C5FD';
        opacityGlow = 0.15 * t;
        treeCount = 1;
        chimneySmoke = true;
        trafficDensity = 'dense';
        trashPiles = true;
        windowColor = '#FBBF24';
        windowPulse = 'anim-pulse-fast';
      } else if (currentSeverity <= 3.8) {
        // Stressed
        skyStart = '#FED7AA'; // Orange haze
        skyEnd = '#64748B';   // Dusty grey-blue
        opacityGlow = 0.4 * t;
        treeCount = 1;
        isWithered = true;
        chimneySmoke = true;
        trafficDensity = 'dense';
        trashPiles = true;
        windowColor = '#F59E0B';
        windowPulse = 'anim-pulse-fast';
      } else {
        // Overheated
        skyStart = '#FECACA'; // Reddish smog
        skyEnd = '#475569';   // Dark grey smog
        opacityGlow = 0.7 * t;
        treeCount = 0;
        isWithered = true;
        chimneySmoke = true;
        trafficDensity = 'jam';
        trashPiles = true;
        windowColor = '#EF4444';
        windowPulse = 'anim-pulse-fast';
      }
    } else {
      // Timeline B: Shift habit. Things get progressively better.
      // Severity shifts down.
      const targetSeverity = Math.max(0, severity - 1.5);
      const currentSeverity = 1 + (targetSeverity - 1) * t;

      if (currentSeverity <= 0.8) {
        skyStart = '#A7F3D0'; // Mint green
        skyEnd = '#60A5FA';   // Bright blue
        treeCount = 3 + (checkInCount > 0 ? 1 : 0);
        cyclist = true;
        electricBus = true;
        solarPanels = true;
        windTurbine = true;
        recyclingBin = true;
        windowColor = '#ECFDF5';
        windowPulse = 'anim-pulse-slow';
      } else if (currentSeverity <= 1.8) {
        skyStart = '#E0F7FA'; // Soft teal
        skyEnd = '#93C5FD';
        treeCount = 2 + (checkInCount > 0 ? 1 : 0);
        electricBus = true;
        cyclist = true;
        solarPanels = true;
        windTurbine = true;
        recyclingBin = true;
      } else if (currentSeverity <= 2.8) {
        // Even if bad, B curves it back to a moderate warming
        skyStart = '#FEF3C7';
        skyEnd = '#E0F2FE';
        opacityGlow = 0.1 * (1 - t);
        treeCount = 2;
        electricBus = true;
        solarPanels = true;
        recyclingBin = true;
      } else {
        // Stressed but improving
        skyStart = '#FFEDD5';
        skyEnd = '#CBD5E1';
        opacityGlow = 0.25 * (1 - t);
        treeCount = 1;
        electricBus = true;
        solarPanels = true;
        trashPiles = false;
        recyclingBin = true;
      }
    }

    return {
      opacityGlow,
      skyStart,
      skyEnd,
      treeCount,
      isWithered,
      solarPanels,
      windTurbine,
      chimneySmoke,
      trafficDensity,
      electricBus,
      cyclist,
      trashPiles,
      recyclingBin,
      windowPulse,
      windowColor
    };
  };

  const state = getEffectiveState();

  return (
    <div className="svg-world-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Simulation World: {year}
        </span>
        <span
          className={`path-tag ${timeline === 'B' ? 'good' : 'bad'}`}
          style={{ textTransform: 'uppercase' }}
        >
          {timeline === 'B' ? 'Timeline B (Shifted Habit)' : 'Timeline A (Unchanged)'}
        </span>
      </div>

      <svg
        viewBox="0 0 400 300"
        className="city-svg"
        aria-label={`City simulation SVG showing a ${mood.toLowerCase()} environment under timeline ${timeline} for the year ${year}`}
      >
        <defs>
          <linearGradient id={`skyGrad-${timeline}-${year}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={state.skyStart} />
            <stop offset="100%" stopColor={state.skyEnd} />
          </linearGradient>
          <radialGradient id="heatGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Background */}
        <rect width="400" height="240" fill={`url(#skyGrad-${timeline}-${year})`} />

        {/* Heat Glow Overlay */}
        {state.opacityGlow > 0 && (
          <rect
            width="400"
            height="240"
            fill="url(#heatGlowGrad)"
            opacity={state.opacityGlow}
            style={{ transition: 'opacity 0.5s ease' }}
          />
        )}

        {/* Clouds */}
        <g opacity={state.opacityGlow > 0.4 ? 0.6 : 0.85} className="anim-cloud-float">
          {/* Cloud 1 */}
          <path
            d="M 30,60 A 15,15 0 0,1 60,60 A 20,20 0 0,1 95,65 A 15,15 0 0,1 110,80 L 25,80 Z"
            fill={state.opacityGlow > 0.3 ? '#94A3B8' : '#FFFFFF'}
          />
          {/* Cloud 2 */}
          <path
            d="M 230,40 A 10,10 0 0,1 250,40 A 15,15 0 0,1 275,45 A 10,10 0 0,1 285,55 L 225,55 Z"
            fill={state.opacityGlow > 0.3 ? '#8E9AA8' : '#FFFFFF'}
            opacity="0.8"
          />
        </g>

        {/* Sun or Hazy Heat Disk */}
        {state.opacityGlow > 0.4 ? (
          // Stressed heat dome sun
          <g>
            <circle cx="320" cy="60" r="30" fill="#EF4444" opacity="0.2" className="anim-pulse-fast" />
            <circle cx="320" cy="60" r="18" fill="#F59E0B" />
          </g>
        ) : (
          // Normal bright sun
          <circle cx="320" cy="60" r="16" fill="#FCD34D" />
        )}

        {/* Wind Turbine (Timeline B / Restoring) */}
        {state.windTurbine && (
          <g transform="translate(45, 120)">
            {/* Tower */}
            <path d="M -2,70 L 2,70 L 0.5,0 L -0.5,0 Z" fill="#94A3B8" />
            {/* Blades */}
            <g className="anim-spin-slow" transform="translate(0, 0)">
              <circle cx="0" cy="0" r="2" fill="#64748B" />
              <path d="M 0,0 L 0,-25 L 2,-25 L 1,0 Z" fill="#E2E8F0" />
              <path d="M 0,0 L 21,12 L 22,14 L 0,0 Z" fill="#E2E8F0" transform="rotate(120, 0, 0)" />
              <path d="M 0,0 L -21,12 L -22,14 L 0,0 Z" fill="#E2E8F0" transform="rotate(240, 0, 0)" />
            </g>
          </g>
        )}

        {/* Chimney & Smoke (Timeline A / Stressed / Overheated) */}
        {state.chimneySmoke && (
          <g transform="translate(350, 100)">
            {/* Factory Building */}
            <rect x="-20" y="30" width="40" height="40" fill="#475569" />
            {/* Chimney */}
            <rect x="-8" y="0" width="16" height="35" fill="#334155" />
            <rect x="-9" y="0" width="18" height="4" fill="#EF4444" />
            {/* Smoke pulses */}
            <circle cx="0" cy="-10" r="6" fill="#64748B" opacity="0.6" className="anim-pulse-fast" />
            <circle cx="8" cy="-22" r="9" fill="#475569" opacity="0.4" className="anim-pulse-slow" />
          </g>
        )}

        {/* Skyline (Buildings) */}
        <g>
          {/* Building 1 */}
          <rect x="90" y="100" width="45" height="110" fill="#3B82F6" opacity="0.85" />
          {/* Building 2 (Tallest) */}
          <rect x="150" y="70" width="60" height="140" fill="#1E3A8A" opacity="0.9" />
          {/* Building 3 */}
          <rect x="230" y="110" width="50" height="100" fill="#1D4ED8" opacity="0.85" />
          
          {/* Solar Panels on Building 2 Roof */}
          {state.solarPanels && (
            <g transform="translate(152, 60)">
              <polygon points="5,10 25,2 25,8 5,10" fill="#1E40AF" stroke="#60A5FA" strokeWidth="0.5" />
              <polygon points="30,10 50,2 50,8 30,10" fill="#1E40AF" stroke="#60A5FA" strokeWidth="0.5" />
            </g>
          )}

          {/* Windows on Building 1 */}
          <g fill={state.windowColor} className={state.windowPulse}>
            <rect x="97" y="115" width="8" height="8" />
            <rect x="115" y="115" width="8" height="8" />
            <rect x="97" y="135" width="8" height="8" />
            <rect x="115" y="135" width="8" height="8" />
            <rect x="97" y="155" width="8" height="8" />
            <rect x="115" y="155" width="8" height="8" />
            <rect x="97" y="175" width="8" height="8" />
            <rect x="115" y="175" width="8" height="8" />
          </g>

          {/* Windows on Building 2 */}
          <g fill={state.windowColor} className={state.windowPulse}>
            <rect x="160" y="85" width="10" height="10" />
            <rect x="185" y="85" width="10" height="10" />
            <rect x="160" y="110" width="10" height="10" />
            <rect x="185" y="110" width="10" height="10" />
            <rect x="160" y="135" width="10" height="10" />
            <rect x="185" y="135" width="10" height="10" />
            <rect x="160" y="160" width="10" height="10" />
            <rect x="185" y="160" width="10" height="10" />
          </g>

          {/* Windows on Building 3 */}
          <g fill={state.windowColor} className={state.windowPulse}>
            <rect x="240" y="125" width="8" height="8" />
            <rect x="260" y="125" width="8" height="8" />
            <rect x="240" y="145" width="8" height="8" />
            <rect x="260" y="145" width="8" height="8" />
            <rect x="240" y="165" width="8" height="8" />
            <rect x="260" y="165" width="8" height="8" />
          </g>
        </g>

        {/* Ground/Grass/Park */}
        <rect x="0" y="200" width="400" height="12" fill={state.treeCount > 1 ? '#10B981' : '#854D0E'} />

        {/* Trees in Park */}
        {state.treeCount >= 1 && (
          <g>
            {/* Tree 1 */}
            <g transform="translate(15, 202)">
              <rect x="-2" y="-12" width="4" height="12" fill="#78350F" />
              {state.isWithered ? (
                <path d="M -5,-12 L 0,-20 L 5,-12 L -2,-12" fill="#92400E" />
              ) : (
                <circle cx="0" cy="-15" r="10" fill="#047857" />
              )}
            </g>
            {/* Tree 2 */}
            {state.treeCount >= 2 && (
              <g transform="translate(34, 202)">
                <rect x="-1.5" y="-10" width="3" height="10" fill="#78350F" />
                {state.isWithered ? (
                  <path d="M -4,-10 L 0,-18 L 4,-10 L -1.5,-10" fill="#92400E" />
                ) : (
                  <circle cx="0" cy="-12" r="8" fill="#059669" />
                )}
              </g>
            )}
            {/* Tree 3 */}
            {state.treeCount >= 3 && (
              <g transform="translate(70, 202)">
                <rect x="-2" y="-14" width="4" height="14" fill="#78350F" />
                <circle cx="0" cy="-16" r="11" fill="#047857" />
              </g>
            )}
            {/* Tree 4 (Bonus Check-in tree) */}
            {state.treeCount >= 4 && (
              <g transform="translate(52, 202)">
                <rect x="-1" y="-8" width="2" height="8" fill="#78350F" />
                <circle cx="0" cy="-10" r="6" fill="#34D399" />
                {/* Visual spark/bloom star */}
                <polygon points="0,-16 2,-12 6,-12 3,-10 4,-6 0,-8 -4,-6 -3,-10 -6,-12 -2,-12" fill="#FBBF24" />
              </g>
            )}
          </g>
        )}

        {/* Road surface */}
        <rect x="0" y="210" width="400" height="30" fill="#475569" />
        {/* Road stripes */}
        <line x1="0" y1="225" x2="400" y2="225" stroke="#FFFFFF" strokeDasharray="15,15" strokeWidth="1.5" opacity="0.6" />

        {/* Traffic on Road */}
        {/* Low / Clean Traffic: Green electric bus, cyclist */}
        {state.electricBus && (
          <g className="anim-bus-move" transform="translate(0, 212)">
            {/* Bus Body */}
            <rect x="0" y="0" width="32" height="12" fill="#10B981" rx="2" />
            {/* Windows */}
            <rect x="3" y="2" width="6" height="4" fill="#EFF6FF" />
            <rect x="11" y="2" width="6" height="4" fill="#EFF6FF" />
            <rect x="19" y="2" width="6" height="4" fill="#EFF6FF" />
            {/* Wheels */}
            <circle cx="7" cy="12" r="3" fill="#1E293B" />
            <circle cx="25" cy="12" r="3" fill="#1E293B" />
            {/* Clean Badge */}
            <rect x="26" y="2" width="4" height="4" fill="#60A5FA" />
          </g>
        )}

        {state.cyclist && (
          <g transform="translate(210, 224)" opacity="0.9">
            {/* Wheels */}
            <circle cx="-6" cy="0" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="6" cy="0" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            {/* Frame */}
            <polygon points="-6,0 0,-5 6,0 0,0" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            {/* Rider simplified */}
            <circle cx="0" cy="-9" r="2.5" fill="#E2E8F0" />
            <line x1="0" y1="-6.5" x2="0" y2="-1" stroke="#E2E8F0" strokeWidth="1.5" />
          </g>
        )}

        {/* Dense traffic / Fossil Cars (Timeline A / Stressed / Overheated) */}
        {state.trafficDensity === 'dense' && (
          <g className="anim-car-move" transform="translate(0, 214)">
            {/* Car 1 */}
            <g transform="translate(0, 0)">
              <rect x="0" y="2" width="18" height="8" fill="#EF4444" rx="1.5" />
              <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
              <circle cx="4" cy="10" r="2" fill="#000000" />
              <circle cx="14" cy="10" r="2" fill="#000000" />
            </g>
            {/* Car 2 */}
            <g transform="translate(50, 2)">
              <rect x="0" y="2" width="18" height="8" fill="#64748B" rx="1.5" />
              <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
              <circle cx="4" cy="10" r="2" fill="#000000" />
              <circle cx="14" cy="10" r="2" fill="#000000" />
            </g>
          </g>
        )}

        {state.trafficDensity === 'jam' && (
          <g transform="translate(0, 214)">
            {/* Car 1 (Stuck) */}
            <g transform="translate(10, 0)">
              <rect x="0" y="2" width="18" height="8" fill="#EF4444" rx="1.5" />
              <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
              <circle cx="4" cy="10" r="2" fill="#000000" />
              <circle cx="14" cy="10" r="2" fill="#000000" />
              {/* Puff of exhaust */}
              <circle cx="-4" cy="6" r="2" fill="#B45309" opacity="0.6" className="anim-pulse-fast" />
            </g>
            {/* Car 2 (Stuck) */}
            <g transform="translate(45, 1)">
              <rect x="0" y="2" width="20" height="8" fill="#F59E0B" rx="1.5" />
              <rect x="5" y="0" width="11" height="5" fill="#1E293B" />
              <circle cx="5" cy="10" r="2" fill="#000000" />
              <circle cx="15" cy="10" r="2" fill="#000000" />
            </g>
            {/* Car 3 (Stuck) */}
            <g transform="translate(80, 0)">
              <rect x="0" y="2" width="18" height="8" fill="#94A3B8" rx="1.5" />
              <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
              <circle cx="4" cy="10" r="2" fill="#000000" />
              <circle cx="14" cy="10" r="2" fill="#000000" />
              {/* Puff of exhaust */}
              <circle cx="-4" cy="6" r="2" fill="#B45309" opacity="0.6" className="anim-pulse-slow" />
            </g>
            {/* Car 4 (Stuck) */}
            <g transform="translate(115, 2)">
              <rect x="0" y="2" width="18" height="8" fill="#EF4444" rx="1.5" />
              <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
              <circle cx="4" cy="10" r="2" fill="#000000" />
              <circle cx="14" cy="10" r="2" fill="#000000" />
            </g>
            {/* SUV 5 (Stuck) */}
            <g transform="translate(150, 0)">
              <rect x="0" y="0" width="24" height="10" fill="#334155" rx="2" />
              <rect x="5" y="0" width="14" height="5" fill="#CBD5E1" />
              <circle cx="6" cy="10" r="2.5" fill="#000000" />
              <circle cx="18" cy="10" r="2.5" fill="#000000" />
            </g>
          </g>
        )}

        {/* Trash/Packaging clutter (Fossil / Delivery loop) */}
        {state.trashPiles && (
          <g transform="translate(300, 222)">
            {/* Cardboard boxes */}
            <rect x="0" y="4" width="12" height="8" fill="#B45309" />
            <line x1="0" y1="4" x2="12" y2="12" stroke="#78350F" strokeWidth="0.7" />
            <rect x="10" y="1" width="10" height="11" fill="#D97706" />
            <rect x="8" y="7" width="9" height="5" fill="#F59E0B" />
            {/* Plastic bottles scattered */}
            <circle cx="23" cy="10" r="1.5" fill="#38BDF8" opacity="0.8" />
            <ellipse cx="26" cy="11" rx="2.5" ry="1" fill="#38BDF8" opacity="0.8" />
          </g>
        )}

        {/* Recycling Bin / Organized Waste (Timeline B / Restoring) */}
        {state.recyclingBin && (
          <g transform="translate(330, 218)">
            {/* Green Bin */}
            <rect x="0" y="0" width="10" height="14" fill="#059669" rx="1" />
            <rect x="-1" y="-1" width="12" height="2" fill="#10B981" rx="0.5" />
            {/* White recycling logo icon mockup */}
            <polygon points="5,3 3,7 7,7" fill="#FFFFFF" opacity="0.7" />
            
            {/* Blue paper bin */}
            <rect x="14" y="2" width="9" height="12" fill="#2563EB" rx="1" />
            <rect x="13" y="1" width="11" height="2" fill="#3B82F6" rx="0.5" />
          </g>
        )}

        {/* Bottom border of frame */}
        <rect x="0" y="238" width="400" height="2" fill="rgba(16, 185, 129, 0.2)" />
      </svg>

      {/* Screen Reader Details (Accessibility) */}
      <div className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        City future visual for year {year}. Sky is {state.opacityGlow > 0.4 ? 'hazy with heavy heat index' : 'clear and clean'}.
        There are {state.treeCount} trees visible. Traffic density is {state.trafficDensity}. 
        {state.windTurbine ? 'Wind energy and solar panels are active.' : ''}
        {state.chimneySmoke ? 'Industrial carbon emissions are releasing smoke.' : ''}
        {state.trashPiles ? 'Packaging waste clutter is visible along the road.' : 'Waste is cleanly managed in sorting bins.'}
      </div>
    </div>
  );
};
export default SVGWorld;
