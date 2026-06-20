/**
 * @fileoverview Procedural SVG City Simulation.
 * Renders a visual representation of the future city based on the user's
 * carbon emissions, behavioral archetype, and timeline shift.
 */
import { FC } from 'react';
import { FutureMood } from '../types';
import { CityLayer } from './svg-world/CityLayer';
import { GroundLayer } from './svg-world/GroundLayer';
import { SkyLayer } from './svg-world/SkyLayer';
import { getWorldState } from './svg-world/worldState';

interface SVGWorldProps {
  mood: FutureMood;
  timeline: 'A' | 'B'; // A = Continue Unchanged, B = Shifted Habit
  year: number;       // 2026, 2030, 2050
  checkInCount: number; // Daily check-ins (adds extra green sparkles/flourish)
}

/**
 * Procedural SVG City Simulation.
 * Renders a visual representation of the future city based on the user's
 * carbon emissions, behavioral archetype, and timeline shift.
 */
export const SVGWorld: FC<SVGWorldProps> = ({
  mood,
  timeline,
  year,
  checkInCount
}) => {
  const state = getWorldState({ mood, timeline, year, checkInCount });

  return (
    <div className="svg-world-wrapper">
      <div className="svg-world-header">
        <span className="svg-world-meta">
          Simulation World: {year}
        </span>
        <span
          className={`path-tag path-tag-uppercase ${timeline === 'B' ? 'good' : 'bad'}`}
        >
          {timeline === 'B' ? 'Timeline B (Shifted Habit)' : 'Timeline A (Unchanged)'}
        </span>
      </div>

      <svg
        viewBox="0 0 400 300"
        className="city-svg"
        aria-label={`City simulation SVG showing a ${mood.toLowerCase()} environment under timeline ${timeline} for the year ${year}`}
      >
        <SkyLayer state={state} timeline={timeline} year={year} />
        <CityLayer state={state} />
        <GroundLayer state={state} />
      </svg>

      {/* Screen Reader Details (Accessibility) */}
      <div className="sr-only">
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
