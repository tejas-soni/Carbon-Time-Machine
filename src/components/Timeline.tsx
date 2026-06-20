/**
 * @fileoverview Interactive Timeline Component.
 * Allows users to scrub forward in time (2026-2050) to see
 * the diverging futures between their Unchanged path (A) and Shifted path (B).
 */
import { useState, ChangeEvent, FC } from 'react';
import { ResultData } from '../types';
import { getFutureMood } from '../utils/scoring';
import SVGWorld from './SVGWorld';

const BASE_YEAR = 2026;
const TARGET_YEAR = 2050;
const MID_YEAR_START = 2029;
const MID_YEAR_END = 2033;


interface TimelineProps {
  result: ResultData;
  checkInCount: number;
}

export const Timeline: FC<TimelineProps> = ({ result, checkInCount }) => {
  const [selectedYear, setSelectedYear] = useState<number>(TARGET_YEAR);
  const [mobileTab, setMobileTab] = useState<'A' | 'B'>('A');

  const { archetype, totalCo2e, futureMood, recommendedShift, shiftedCo2e, shiftedFutureMood } = result;

  /** Updates the currently selected year when the slider moves. */
  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  /** Generates contextual narrative based on the selected year and timeline path. */
  const getTimelineDescription = (timeline: 'A' | 'B', year: number) => {
    const isMidFuture = year >= MID_YEAR_START && year < MID_YEAR_END;

    if (timeline === 'A') {
      if (year === BASE_YEAR) {
        return `Present Day. Your lifestyle habits are generating a footprint of ${totalCo2e.toLocaleString()} kg CO2e/year. The baseline city experiences moderate traffic, average cooling loads, and typical landfill stress.`;
      }
      
      if (futureMood === 'Restoring' || futureMood === 'Balanced') {
        return `Year ${year}. Your low-carbon lifestyle helps maintain a stable atmosphere. The city's visual footprint is light, public transit runs clean, and tree canopies remain healthy. Your timeline is steady.`;
      }
      
      const impactDesc = 
        futureMood === 'Overheated' ? 'severe heat island domes, massive traffic blockages, and choking grey smog' :
        futureMood === 'Stressed' ? 'heavy utility loads, notable haze, and cardboard/plastic waste piles' :
        'rising grid stress, noticeable temperature spikes, and fewer green spots';

      if (isMidFuture) {
        return `Year ${year}. As your ${archetype.toLowerCase()} habits continue, carbon effects compile. The city experiences early signs of ${impactDesc}. The timeline is starting to harden.`;
      }
      return `Year ${year}. A decade of unchanged habits. The city is locked into a ${futureMood.toLowerCase()} state, defined by ${impactDesc}. Total emissions continue at ${totalCo2e.toLocaleString()} kg/year.`;
    } else {
      // Timeline B (Shifted)
      if (year === BASE_YEAR) {
        return `Pledge Day. You start making your one habit shift: "${recommendedShift}". Your baseline carbon footprint drops instantly by ${Math.round(totalCo2e - shiftedCo2e)} kg CO2e/year. The timeline starts bending.`;
      }
      
      if (isMidFuture) {
        return `Year ${year}. By swapping just one repeating habit, you've saved thousands of kilograms of carbon over the years. The grid is relaxed, new public transit is introduced, and trees are flourishing.`;
      }
      
      const moodImprovementText = 
        shiftedFutureMood === 'Restoring' ? 'fully clean skies, thriving urban gardens, and active cyclist lanes' :
        shiftedFutureMood === 'Balanced' ? 'stable summer cooling grids, clear air, and organized recycling programs' :
        'a significantly reduced heat burden and cleaner traffic conditions compared to the unchanged path';

      return `Year ${year}. The cumulative bending of your timeline. By sticking to your shift, your year-over-year footprint stays at a lower ${shiftedCo2e.toLocaleString()} kg CO2e/year, paving the way for ${moodImprovementText}.`;
    }
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
              {selectedYear === BASE_YEAR ? futureMood : getFutureMood(totalCo2e)} Future
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
              {getTimelineDescription('A', selectedYear)}
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
              {getTimelineDescription('B', selectedYear)}
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};
export default Timeline;
