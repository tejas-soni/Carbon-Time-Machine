import React, { useState } from 'react';
import { ResultData } from '../types';
import { getFutureMood } from '../utils/scoring';
import SVGWorld from './SVGWorld';

interface TimelineProps {
  result: ResultData;
  checkInCount: number;
}

export const Timeline: React.FC<TimelineProps> = ({ result, checkInCount }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2035);
  const [mobileTab, setMobileTab] = useState<'A' | 'B'>('A');

  const { archetype, totalCo2e, futureMood, recommendedShift, shiftedCo2e, shiftedFutureMood } = result;

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  // Interpolate future descriptions based on current year and mood
  const getTimelineDescription = (timeline: 'A' | 'B', year: number) => {
    const isMidFuture = year >= 2029 && year < 2033;

    if (timeline === 'A') {
      if (year === 2026) {
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
      if (year === 2026) {
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
      <h2 style={{ marginBottom: '8px' }}>Habit Time Machine</h2>
      <p style={{ marginBottom: '20px' }}>
        Slide the timeline to see how today's choices shape two alternative paths for the next 10 years.
      </p>

      {/* Slider Container */}
      <div className="slider-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-hover)' }}>
            Destination Year:
          </span>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {selectedYear}
          </span>
        </div>
        <input
          type="range"
          min="2026"
          max="2035"
          step="1"
          value={selectedYear}
          onChange={handleYearChange}
          className="range-input"
          aria-label="Select year for city simulation"
        />
        <div className="year-labels">
          <span>Today (2026)</span>
          <span>2030</span>
          <span>Future (2035)</span>
        </div>
      </div>

      {/* Mobile-only switcher tabs */}
      <div
        className="mobile-only-flex"
        style={{
          display: 'none',
          gap: '8px',
          margin: '16px 0',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={() => setMobileTab('A')}
          className={`btn ${mobileTab === 'A' ? 'btn-danger' : 'btn-outline'}`}
          style={{ flex: 1, minHeight: '40px', padding: '8px' }}
        >
          Timeline A (Unchanged)
        </button>
        <button
          onClick={() => setMobileTab('B')}
          className={`btn ${mobileTab === 'B' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1, minHeight: '40px', padding: '8px' }}
        >
          Timeline B (One Shift)
        </button>
      </div>

      {/* Timeline Flex Grid */}
      <div className="timeline-flex">
        {/* Timeline A: Continue Unchanged */}
        <div
          className={`timeline-path bad-path ${mobileTab === 'A' ? 'active-mobile-path' : ''}`}
          style={{
            display:
              window.innerWidth <= 768 && mobileTab !== 'A' ? 'none' : 'block'
          }}
        >
          <div className="path-header">
            <span className="path-tag bad">Timeline A: Continue Pattern</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
              {selectedYear === 2026 ? futureMood : getFutureMood(totalCo2e)} Future
            </span>
          </div>

          <SVGWorld
            mood={futureMood}
            timeline="A"
            year={selectedYear}
            checkInCount={0}
          />

          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
              {getTimelineDescription('A', selectedYear)}
            </p>
          </div>
        </div>

        {/* Timeline B: Shift One Habit */}
        <div
          className={`timeline-path active-path ${mobileTab === 'B' ? 'active-mobile-path' : ''}`}
          style={{
            display:
              window.innerWidth <= 768 && mobileTab !== 'B' ? 'none' : 'block'
          }}
        >
          <div className="path-header">
            <span className="path-tag good">Timeline B: Shift One Habit</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
              {selectedYear === 2026 ? 'Bending...' : shiftedFutureMood} Future
            </span>
          </div>

          <SVGWorld
            mood={futureMood}
            timeline="B"
            year={selectedYear}
            checkInCount={checkInCount}
          />

          <div style={{ marginTop: '16px' }}>
            <div
              style={{
                background: '#ECFDF5',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-hover)',
                marginBottom: '10px'
              }}
            >
              Action: {recommendedShift}
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
              {getTimelineDescription('B', selectedYear)}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-only-flex {
            display: flex !important;
          }
          .timeline-path {
            display: none;
          }
          .timeline-path.active-mobile-path {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Timeline;
