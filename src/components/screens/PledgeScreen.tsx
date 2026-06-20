import React from 'react';
import { ResultData, CheckInHistory } from '../../types';
import { getTodayDateString } from '../../utils/storage';
import SVGWorld from '../SVGWorld';
import ShareCard from '../ShareCard';

interface PledgeScreenProps {
  result: ResultData;
  history: CheckInHistory;
  onCheckIn: () => void;
  onReset: () => void;
  onViewDashboard: () => void;
}

export const PledgeScreen: React.FC<PledgeScreenProps> = ({
  result,
  history,
  onCheckIn,
  onReset,
  onViewDashboard
}) => {
  return (
    <section aria-labelledby="pledge-section-title" className="pledge-panel">
      <h2 id="pledge-section-title" className="sr-only">Your Carbon Pledge</h2>
      <div className="card">
        <span className="hero-tag pledge-tag-centered">
          ACTIVE PLEDGE
        </span>
        <h2 className="pledge-title">Your Habit Shift Commitment</h2>
        <p>You committed to changing this repeating pattern to bend the future:</p>

        <div className="shift-highlight-box">
          "{history.pledge.shiftText}"
        </div>

        {/* Daily Return Check-in tracker */}
        <div className="daily-tracker-card">
          <h3>Daily Check-in Log</h3>
          <p className="timeline-desc text-sm">
            Track your progress. Every check-in plants trees and cleans the sky in your simulated future!
          </p>

          {/* 7-Day progress chain */}
          <div className="checkin-row" role="group" aria-label="7 Day Progress tracking">
            {Array.from({ length: 7 }).map((_, idx) => {
              const isChecked = idx < history.checkInDates.length;
              return (
                <div
                  key={idx}
                  className={`checkin-day-bubble ${isChecked ? 'checked' : ''}`}
                  aria-label={`Day ${idx + 1} ${isChecked ? 'completed' : 'pending'}`}
                >
                  <span>Day</span>
                  <span className="checkin-day-number">{idx + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Checkin button */}
          {history.checkInDates.includes(getTodayDateString()) ? (
            <div className="pledge-checkin-success" role="alert">
              ✓ You completed today's shift! Great job. Come back tomorrow to record the next day.
            </div>
          ) : (
            <button className="btn btn-primary pledge-checkin-btn" onClick={onCheckIn} aria-label="Record today's habit shift check-in">
              I stuck to my shift today!
            </button>
          )}
        </div>

        {/* Live City Simulation under shifted pledge */}
        <div className="pledge-city-section">
          <h3 className="pledge-city-heading">Your Shifted Future City</h3>
          <p className="pledge-city-desc">
            Visual simulation of your future in 2050 with {history.checkInDates.length} check-in day(s) recorded:
          </p>
          <SVGWorld
            mood={result.futureMood}
            timeline="B"
            year={2050}
            checkInCount={history.checkInDates.length}
          />
        </div>

        {/* Share Card & Action options */}
        <div className="share-section">
          <ShareCard result={result} />
        </div>

        <div className="margin-top-30 flex-row-center-gap-12">
          <button className="btn btn-outline" onClick={onViewDashboard}>
            ← View Analysis Dashboard
          </button>
          <button className="btn btn-danger" onClick={onReset}>
            Reset & Restart Quiz
          </button>
        </div>
      </div>
    </section>
  );
};
