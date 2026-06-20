import React from 'react';
import { ResultData } from '../../types';
import Timeline from '../Timeline';
import {
  getArchetypeDescription,
  getArchetypeIcon,
  getCategoryBreakdown,
} from '../resultsScreen.helpers';

interface ResultsScreenProps {
  result: ResultData;
  onCommitPledge: () => void;
  showNote: boolean;
  isGeneratingNote: boolean;
  noteContent: string;
  onLoadNote: (mode: 'local' | 'ai') => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onCommitPledge,
  showNote,
  isGeneratingNote,
  noteContent,
  onLoadNote,
}) => {
  const categoryBreakdown = getCategoryBreakdown(result);

  return (
    <section aria-labelledby="results-section-title">
      <h2 id="results-section-title" className="sr-only">Carbon Footprint Results</h2>
      <div className="results-container">
        <div className="flex-col-gap-24">
          <div className="card dashboard-card">
            <div className="archetype-banner">
              <div>
                <span className="archetype-badge">YOUR BEHAVIOR PATTERN</span>
                <h3 className="archetype-title">{result.archetype}</h3>
                <p className="archetype-description">
                  {getArchetypeDescription(result.archetype)}
                </p>
              </div>
              <span className="archetype-icon" aria-hidden="true">
                {getArchetypeIcon(result.archetype)}
              </span>
            </div>

            <div className="footprint-indicator">
              <div className={`footprint-circle ${result.futureMood}`}>
                <span className="footprint-number">
                  {Math.round(result.totalCo2e / 100) / 10}
                </span>
                <span className="footprint-unit">Tons/Yr</span>
              </div>
              <div>
                <h4 className="footprint-title">
                  Estimated Footprint: {(result.totalCo2e / 1000).toFixed(2)} Tons CO₂e / Year
                </h4>
                <p className="footprint-desc">
                  If this pattern continues, your timeline bends toward a <strong>{result.futureMood.toLowerCase()}</strong> future.
                </p>
              </div>
            </div>

            <h4 className="breakdown-heading">Impact Contribution Breakdown</h4>
            <div className="analysis-category-grid">
              {categoryBreakdown.map(({ category, label, pct, score }) => (
                <div key={category} className={`category-bar-card category-bar-card--${category}`}>
                  <span className="category-bar-label">{label}</span>
                  <div className="category-bar-outer">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="category-score-value">{score} pts</span>
                </div>
              ))}
            </div>

            <p className="disclaimer-text">
              * Disclaimer: This is an awareness estimate, not official carbon accounting. Real emissions vary by region, energy mix, lifestyle context, and product details.
            </p>
          </div>

          <div className="card shift-card">
            <span className="archetype-badge shift-card-badge">YOUR TIMELINE SHIFT</span>
            <h3 className="shift-card-title">The Habit Shift</h3>
            <p className="shift-card-desc">
              Behavior changes fail when we attempt too much. Change just <strong>one repeating pattern</strong> to bend the timeline:
            </p>
            <div className="shift-highlight-box">
              "{result.recommendedShift}"
            </div>
            <div className="shift-impact-row">
              <div>
                <span className="impact-label">IMPACT RECOVERY</span>
                <h4 className="impact-value">
                  -{Math.round(result.totalCo2e - result.shiftedCo2e)} kg CO₂e / Year
                </h4>
              </div>
              <button className="btn btn-primary" onClick={onCommitPledge} aria-label="Commit to your recommended habit shift">
                Commit to Habit Shift
              </button>
            </div>
          </div>
        </div>

        <div className="flex-col-gap-24">
          <Timeline result={result} checkInCount={0} />

          <div className="card">
            <h3>Reflection: Note From 2050</h3>
            <p className="timeline-desc">
              Read a message sent back in time from your future self.
            </p>

            <div className="note-buttons">
              <button className="btn btn-outline note-btn" onClick={() => onLoadNote('local')}>
                Read Note
              </button>
              <button className="btn btn-secondary note-btn" onClick={() => onLoadNote('ai')}>
                Personalize with AI
              </button>
            </div>

            {showNote && (
              <div className="margin-top-10">
                {isGeneratingNote ? (
                  <div className="future-note-box note-loading">
                    <div>
                      <div className="note-spinner">âŒ›</div>
                      <p>Opening time portal, synthesizing future note...</p>
                    </div>
                  </div>
                ) : (
                  <div className="future-note-box">{noteContent}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
