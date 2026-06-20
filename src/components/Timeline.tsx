/**
 * @fileoverview Interactive Timeline Component.
 * Allows users to scrub forward in time (2026-2050) to see
 * the diverging futures between their Unchanged path (A) and Shifted path (B).
 */
import { useState, ChangeEvent, FC } from 'react';
import { ResultData } from '../types';

import SVGWorld from './SVGWorld';
import { getTimelineDescription } from './timelineLogic';

const BASE_YEAR = 2026;
const TARGET_YEAR = 2050;


interface TimelineProps {
  result: ResultData;
  checkInCount: number;
}

export const Timeline: FC<TimelineProps> = ({ result, checkInCount }) => {
  const [selectedYear, setSelectedYear] = useState<number>(TARGET_YEAR);
  const [mobileTab, setMobileTab] = useState<'A' | 'B'>('A');

  const { futureMood, recommendedShift, shiftedFutureMood } = result;

  /** Updates the currently selected year when the slider moves. */
  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="card timeline-slider-card">
      <h2 className="timeline-heading">Habit Time Machine</h2>
      <p className="timeline-desc">
        Slide the timeline to see how today's choices shape two alternative paths for the next 10 years.
      </p>

      {/* Slider Container */}
      <div className="slider-container">
        <div className="timeline-destination-row">
          <span className="timeline-destination-label">
            Destination Year:
          </span>
          <span className="timeline-destination-year">
            {selectedYear}
          </span>
        </div>
        <input
          type="range"
          min={BASE_YEAR}
          max={TARGET_YEAR}
          step="1"
          value={selectedYear}
          onChange={handleYearChange}
          className="range-input"
          aria-label="Select year for city simulation"
        />
        <div className="year-labels">
          <span>Today ({BASE_YEAR})</span>
          <span>2030</span>
          <span>Future ({TARGET_YEAR})</span>
        </div>
      </div>

      {/* Mobile-only switcher tabs */}
      <div className="mobile-tab-row">
        <button
          onClick={() => setMobileTab('A')}
          className={`btn mobile-tab-btn ${mobileTab === 'A' ? 'btn-danger' : 'btn-outline'}`}
        >
          Timeline A (Unchanged)
        </button>
        <button
          onClick={() => setMobileTab('B')}
          className={`btn mobile-tab-btn ${mobileTab === 'B' ? 'btn-primary' : 'btn-outline'}`}
        >
          Timeline B (One Shift)
        </button>
      </div>

      {/* Timeline Flex Grid */}
      <div className="timeline-flex">
        {/* Timeline A: Continue Unchanged */}
        <div
          className={`timeline-path bad-path ${mobileTab === 'A' ? 'active-mobile-path' : ''}`}
        >
          <div className="path-header">
            <span className="path-tag bad">Timeline A: Continue Pattern</span>
            <span className="timeline-mood-label timeline-mood-label--bad">
              {futureMood} Future
            </span>
          </div>

          <SVGWorld
            mood={futureMood}
            timeline="A"
            year={selectedYear}
            checkInCount={0}
          />

          <div className="timeline-description-container">
            <p className="timeline-description">
              {getTimelineDescription(result, 'A', selectedYear)}
            </p>
          </div>
        </div>

        {/* Timeline B: Shift One Habit */}
        <div
          className={`timeline-path active-path ${mobileTab === 'B' ? 'active-mobile-path' : ''}`}
        >
          <div className="path-header">
            <span className="path-tag good">Timeline B: Shift One Habit</span>
            <span className="timeline-mood-label timeline-mood-label--good">
              {selectedYear === BASE_YEAR ? 'Bending...' : shiftedFutureMood} Future
            </span>
          </div>

          <SVGWorld
            mood={futureMood}
            timeline="B"
            year={selectedYear}
            checkInCount={checkInCount}
          />

          <div className="timeline-description-container">
            <div className="timeline-action-banner">
              Action: {recommendedShift}
            </div>
            <p className="timeline-description">
              {getTimelineDescription(result, 'B', selectedYear)}
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};
export default Timeline;
