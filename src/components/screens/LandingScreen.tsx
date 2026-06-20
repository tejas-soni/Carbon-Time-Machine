import React from 'react';

interface LandingScreenProps {
  onStartQuiz: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartQuiz }) => {
  return (
    <section className="landing-hero" aria-labelledby="hero-title">
      <div className="hero-content">
        <h2 id="hero-title" className="hero-title">
          See the future your habits are quietly building.
        </h2>
        <p className="hero-desc">
          This is not just a carbon calculator. It is an interactive time portal connecting your daily, repeating habits to the future state of our shared city. Swap a single habit today, and watch the timeline bend.
        </p>
        <div className="margin-top-10">
          <button
            className="btn btn-primary"
            onClick={onStartQuiz}
            aria-label="Enter the time machine and start lifestyle questionnaire"
          >
            Enter the Time Machine →
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="portal-container">
          <div className="portal-graphic" />
          <div className="portal-face">
            <span className="portal-emoji">🌇</span>
            <h3 className="portal-heading">Dual Futures Portal</h3>
            <p className="portal-desc">
              Interactive visualization adjusts based on 12 lifestyle habits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
