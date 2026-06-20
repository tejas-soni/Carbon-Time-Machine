/**
 * @fileoverview Main application controller and routing component.
 * Manages the state and transitions between the landing, quiz, results, and pledge screens.
 */
import { useState, useEffect } from 'react';
import { QUESTIONS, calculateResults, ARCHETYPE_RECOMMENDATIONS } from './utils/scoring';
import {
  loadResultData,
  saveResultData,
  loadCheckInHistory,
  createPledge,
  addCheckInToday,
  clearAllData,
  getTodayDateString
} from './utils/storage';
import { log } from './utils/logger';
import { generateFutureNote } from './utils/templates';
import { QuizAnswers, ResultData, CheckInHistory, Archetype, QuestionCategory } from './types';
import Timeline from './components/Timeline';
import ShareCard from './components/ShareCard';
import Stepper from './components/Stepper';
import SVGWorld from './components/SVGWorld';

/** Screen state type for routing within the app. */
type ScreenState = 'landing' | 'quiz' | 'results' | 'pledge';

/** Maps archetypes to their corresponding emoji icon. */
const ARCHETYPE_ICONS: Record<Archetype, string> = {
  'Convenience Commuter': '🚗',
  'Delivery Loop': '🍕',
  'Cooling Dependent Urbanite': '❄️',
  'High-Street Shopper': '🛍️',
  'Packaging Accumulator': '📦',
  'Quiet Saver': '🌱'
};

/** Maximum possible points per quiz category for percentage calculations. */
const CATEGORY_MAX_SCORES: Record<QuestionCategory, number> = {
  transport: 12, food: 8, energy: 10, shopping: 8, waste: 7,
};

/** Minimum visible width percentage for category bars. */
const MIN_BAR_PERCENT = 8;

/** Generates a random timeline verification ID. */
const generateTimelineId = (): number => Math.floor(Math.random() * 89999 + 10000);

/**
 * Main Application Component.
 * Acts as the primary controller for routing between screens (landing, quiz, results, pledge).
 * Manages all top-level state and API interactions.
 */
export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const [history, setHistory] = useState<CheckInHistory | null>(null);
  
  // Future Self Note States
  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [cachedAiNote, setCachedAiNote] = useState('');

  // Load initial states from localStorage on mount
  useEffect(() => {
    const savedHistory = loadCheckInHistory();
    const savedResult = loadResultData();

    if (savedHistory) {
      setHistory(savedHistory);
      setResult(savedResult);
      setScreen('pledge');
    } else if (savedResult) {
      setResult(savedResult);
      setScreen('results');
    }
  }, []);

  // Scroll to top on screen change, with a slight delay to allow DOM painting
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [screen]);

  /** Records the user's selected answer for a specific question. */
  const handleAnswerSelect = (optionIdx: number) => {
    const q = QUESTIONS[currentQIndex];
    setAnswers((prev) => ({
      ...prev,
      [q.id]: optionIdx
    }));
  };

  /** Advances to the next question, or calculates and shows results if at the end. */
  const handleNext = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Quiz complete
      const finalResult = calculateResults(answers);
      saveResultData(finalResult);
      setResult(finalResult);
      setScreen('results');
    }
  };

  /** Returns to the previous question. */
  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  /** Commits the user to their recommended habit shift and initializes their daily tracker. */
  const handleCommitPledge = () => {
    if (!result) return;
    
    const saving = ARCHETYPE_RECOMMENDATIONS[result.archetype]?.co2eSaving || 150;

    const newPledge = {
      archetype: result.archetype,
      shiftText: result.recommendedShift,
      co2eSaving: saving,
      pledgedAt: new Date().toISOString()
    };

    const newHistory = createPledge(newPledge);
    setHistory(newHistory);
    setScreen('pledge');
  };

  /** Records a daily check-in for the active pledge. */
  const handleCheckIn = () => {
    const updated = addCheckInToday();
    if (updated) {
      setHistory(updated);
    }
  };

  /** Clears all local data and resets the app state back to the landing screen. */
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your Time Machine history? This clears all saved results and pledges.')) {
      clearAllData();
      setAnswers({});
      setCurrentQIndex(0);
      setResult(null);
      setHistory(null);
      setShowNote(false);
      setNoteContent('');
      setCachedAiNote('');
      setScreen('landing');
    }
  };

  /** 
   * Loads the future self note, either generating via AI or using a local template.
   * @param mode - Whether to load the 'local' template or 'ai' generated note.
   */
  const handleLoadNote = async (mode: 'local' | 'ai') => {
    if (!result) return;
    setShowNote(true);

    if (mode === 'local') {
      const text = generateFutureNote(result.archetype);
      setNoteContent(text);
    } else {
      if (cachedAiNote) {
        setNoteContent(cachedAiNote);
        return;
      }
      setIsGeneratingNote(true);
      setNoteContent('');
      try {
        const prompt = `You are the user's future self writing to them from the year 2050. Their carbon footprint archetype is "${result.archetype}" emitting ${result.totalCo2e} kg CO2e/year. They just pledged to change this habit: "${result.recommendedShift}". Write a short, emotional, personalized 3-paragraph letter from 2050 thanking them for bending the timeline and avoiding a ${result.futureMood} city future. Keep it brief and hopeful.`;
        
        const res = await fetch(`/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
          const finalNote = `🤖 AI PERSONALIZED CORRESPONDENCE 📬\nTimestamp: May 12, 2050\nTransmission Protocol: Low-emission fiber\n\n${data.candidates[0].content.parts[0].text}\n\n[Status: Verified Bended Timeline #${generateTimelineId()}]`;
          setNoteContent(finalNote);
          setCachedAiNote(finalNote);
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        log('error', "AI Generation failed:", err);
        const baseNote = generateFutureNote(result.archetype);
        const aiEnhancedNote = `🤖 AI PERSONALIZED CORRESPONDENCE 📬\nTimestamp: May 12, 2050\n[Note: Add GEMINI_API_KEY to Vercel Environment Variables for real AI generation]\n\n${baseNote}\n\n[Status: Verified Bended Timeline #${generateTimelineId()}]`;
        setNoteContent(aiEnhancedNote);
      } finally {
        setIsGeneratingNote(false);
      }
    }
  };

  const currentQuestion = QUESTIONS[currentQIndex];
  const isQuestionAnswered = answers[currentQuestion?.id] !== undefined;

  /** Maps impact categories to their respective emoji icons. */
  const renderCategoryIcon = (category: string) => {
    const icons: Record<QuestionCategory | string, string> = { transport: '🚲', food: '🥗', energy: '⚡', shopping: '🛍️', waste: '♻️' };
    return icons[category] || '📍';
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-group">
          <span className="logo-icon" aria-hidden="true">⏳</span>
          <div>
            <h1 className="logo-text">Carbon Time Machine</h1>
            <span className="logo-tagline">See the future your habits are quietly building.</span>
          </div>
        </div>
        {screen !== 'landing' && screen !== 'quiz' && (
          <button className="btn btn-outline btn-header-reset" onClick={handleReset} aria-label="Reset all quiz data and restart">
            Reset Machine
          </button>
        )}
      </header>
      
      <main id="main-content">

      {/* Landing Page */}
      {screen === 'landing' && (
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
                onClick={() => setScreen('quiz')}
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
      )}

      {/* Quiz Questionnaire */}
      {screen === 'quiz' && (
        <section aria-labelledby="quiz-section-title">
          <h2 id="quiz-section-title" className="sr-only">Questionnaire</h2>
          <div className="card quiz-card">
            <Stepper currentStep={currentQIndex + 1} totalSteps={QUESTIONS.length} />

            <div className="quiz-header">
              <span className={`quiz-category-badge badge-${currentQuestion.category}`}>
                {renderCategoryIcon(currentQuestion.category)} {currentQuestion.category}
              </span>
              <span className="quiz-meta">
                Q {currentQIndex + 1} of {QUESTIONS.length}
              </span>
            </div>

            <h3 className="quiz-question-text">{currentQuestion.text}</h3>

            <div className="quiz-options-list" role="radiogroup" aria-label={currentQuestion.text}>
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    role="radio"
                    aria-checked={isSelected}
                    className={`quiz-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(idx)}
                  >
                    <span>{opt.text}</span>
                    <span className="option-marker" />
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer">
              <button
                className={`btn btn-outline ${currentQIndex === 0 ? 'visibility-hidden' : ''}`}
                onClick={handleBack}
                disabled={currentQIndex === 0}
              >
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!isQuestionAnswered}
              >
                {currentQIndex === QUESTIONS.length - 1 ? 'See My Future →' : 'Next Question'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Results Dashboard */}
      {screen === 'results' && result && (
        <section aria-labelledby="results-section-title">
          <h2 id="results-section-title" className="sr-only">Carbon Footprint Results</h2>
          <div className="results-container">
            {/* Analysis & Details Column */}
            <div className="flex-col-gap-24">
              <div className="card dashboard-card">
                <div className="archetype-banner">
                  <div>
                    <span className="archetype-badge">YOUR BEHAVIOR PATTERN</span>
                    <h3 className="archetype-title">{result.archetype}</h3>
                    <p className="archetype-description">
                      {result.archetype === 'Quiet Saver' 
                        ? 'Your habits are already very light. You lead by quiet example.' 
                        : `Your footprint is primarily driven by your repeating ${result.archetype.replace('The ', '')} habits.`}
                    </p>
                  </div>
                  <span className="archetype-icon" aria-hidden="true">
                    {ARCHETYPE_ICONS[result.archetype] || '🌱'}
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

                {/* Categories Bar Chart */}
                <h4 className="breakdown-heading">Impact Contribution Breakdown</h4>
                <div className="analysis-category-grid">
                  {(['transport', 'food', 'energy', 'shopping', 'waste'] as const).map((cat) => {
                    const score = result.categoryScores[cat];
                    const maxScore = CATEGORY_MAX_SCORES[cat];
                    const pct = Math.min(100, Math.max(MIN_BAR_PERCENT, (score / maxScore) * 100));
                    
                    return (
                      <div key={cat} className={`category-bar-card category-bar-card--${cat}`}>
                        <span className="category-bar-label">
                          {renderCategoryIcon(cat)} {cat}
                        </span>
                        <div className="category-bar-outer">
                          <div
                            className="category-bar-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="category-score-value">
                          {score} pts
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="disclaimer-text">
                  * Disclaimer: This is an awareness estimate, not official carbon accounting. Real emissions vary by region, energy mix, lifestyle context, and product details.
                </p>
              </div>

              {/* Recommendation Shift card */}
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
                    <span className="impact-label">
                      IMPACT RECOVERY
                    </span>
                    <h4 className="impact-value">
                      -{Math.round(result.totalCo2e - result.shiftedCo2e)} kg CO₂e / Year
                    </h4>
                  </div>
                  <button className="btn btn-primary" onClick={handleCommitPledge} aria-label="Commit to your recommended habit shift">
                    Commit to Habit Shift
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Future Column */}
            <div className="flex-col-gap-24">
              <Timeline result={result} checkInCount={0} />

              {/* Future Self Note Module */}
              <div className="card">
                <h3>Reflection: Note From 2050</h3>
                <p className="timeline-desc">
                  Read a message sent back in time from your future self.
                </p>
                
                <div className="note-buttons">
                  <button className="btn btn-outline note-btn" onClick={() => handleLoadNote('local')}>
                    Read Note
                  </button>
                  <button className="btn btn-secondary note-btn" onClick={() => handleLoadNote('ai')}>
                    Personalize with AI
                  </button>
                </div>

                {showNote && (
                  <div className="margin-top-10">
                    {isGeneratingNote ? (
                      <div className="future-note-box note-loading">
                        <div>
                          <div className="note-spinner">⌛</div>
                          <p>Opening time portal, synthesizing future note...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="future-note-box">
                        {noteContent}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pledge & Daily Return Tracker Screen */}
      {screen === 'pledge' && result && history && (
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
                <button className="btn btn-primary pledge-checkin-btn" onClick={handleCheckIn} aria-label="Record today's habit shift check-in">
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
              <button className="btn btn-outline" onClick={() => setScreen('results')}>
                ← View Analysis Dashboard
              </button>
              <button className="btn btn-danger" onClick={handleReset}>
                Reset & Restart Quiz
              </button>
            </div>
          </div>
        </section>
      )}

      </main>
      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Carbon Time Machine. Built for PromptWars Challenge 3.</p>
        <p className="footer-sub">
          Fully client-side simulator. Private data stored exclusively in your local browser's storage.
        </p>
      </footer>
    </div>
  );
};
export default App;
