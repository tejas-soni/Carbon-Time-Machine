import React, { useState, useEffect } from 'react';
import { QUESTIONS, calculateResults } from './utils/scoring';
import {
  loadResultData,
  saveResultData,
  loadCheckInHistory,
  createPledge,
  addCheckInToday,
  clearAllData,
  getTodayDateString
} from './utils/storage';
import { generateFutureNote } from './utils/templates';
import { QuizAnswers, ResultData, CheckInHistory } from './types';
import Timeline from './components/Timeline';
import ShareCard from './components/ShareCard';
import Stepper from './components/Stepper';
import SVGWorld from './components/SVGWorld';

type ScreenState = 'landing' | 'quiz' | 'results' | 'pledge';

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

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  // Quiz helper: navigate to next question or complete
  const handleAnswerSelect = (optionIdx: number) => {
    const q = QUESTIONS[currentQIndex];
    setAnswers((prev) => ({
      ...prev,
      [q.id]: optionIdx
    }));
  };

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

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  // Pledge commit helper
  const handleCommitPledge = () => {
    if (!result) return;
    
    // Determine saving based on archetype
    let saving = 150;
    if (result.archetype === 'Convenience Commuter') saving = 400;
    else if (result.archetype === 'Delivery Loop') saving = 300;
    else if (result.archetype === 'Cooling Dependent Urbanite') saving = 250;
    else if (result.archetype === 'High-Street Shopper') saving = 350;
    else if (result.archetype === 'Packaging Accumulator') saving = 200;

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

  // Check-In helper
  const handleCheckIn = () => {
    const updated = addCheckInToday();
    if (updated) {
      setHistory(updated);
    }
  };

  // Reset/Restart helper
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

  const handleLoadNote = async (mode: 'local' | 'ai') => {
    if (!result) return;
    setShowNote(true);

    if (mode === 'local') {
      const text = generateFutureNote(result.archetype, result.totalCo2e, result.archetype, result.recommendedShift);
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
          const finalNote = `🤖 AI PERSONALIZED CORRESPONDENCE 📬\nTimestamp: May 12, 2050\nTransmission Protocol: Low-emission fiber\n\n${data.candidates[0].content.parts[0].text}\n\n[Status: Verified Bended Timeline #${Math.floor(Math.random()*89999 + 10000)}]`;
          setNoteContent(finalNote);
          setCachedAiNote(finalNote);
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        console.error("AI Generation failed:", err);
        const baseNote = generateFutureNote(result.archetype, result.totalCo2e, result.archetype, result.recommendedShift);
        const aiEnhancedNote = `🤖 AI PERSONALIZED CORRESPONDENCE 📬\nTimestamp: May 12, 2050\n[Note: Add GEMINI_API_KEY to Vercel Environment Variables for real AI generation]\n\n${baseNote}\n\n[Status: Verified Bended Timeline #${Math.floor(Math.random()*89999 + 10000)}]`;
        setNoteContent(aiEnhancedNote);
      } finally {
        setIsGeneratingNote(false);
      }
    }
  };

  const currentQuestion = QUESTIONS[currentQIndex];
  const isQuestionAnswered = answers[currentQuestion?.id] !== undefined;

  // Render helpers
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport': return '🚲';
      case 'food': return '🥗';
      case 'energy': return '⚡';
      case 'shopping': return '🛍️';
      case 'waste': return '♻️';
      default: return '📍';
    }
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
          <button className="btn btn-outline" style={{ minHeight: '38px', padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleReset}>
            Reset Machine
          </button>
        )}
      </header>

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
            <div style={{ marginTop: '10px' }}>
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
                <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🌇</span>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Dual Futures Portal</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
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
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
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
                className="btn btn-outline"
                onClick={handleBack}
                disabled={currentQIndex === 0}
                style={{ visibility: currentQIndex === 0 ? 'hidden' : 'visible' }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card dashboard-card">
                <div className="archetype-banner">
                  <div>
                    <span className="archetype-badge">YOUR BEHAVIOR PATTERN</span>
                    <h3 className="archetype-title">{result.archetype}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {result.archetype === 'Quiet Saver' 
                        ? 'Your habits are already very light. You lead by quiet example.' 
                        : `Your footprint is primarily driven by your repeating ${result.archetype.replace('The ', '')} habits.`}
                    </p>
                  </div>
                  <span style={{ fontSize: '3rem' }}>
                    {result.archetype === 'Convenience Commuter' ? '🚗' :
                     result.archetype === 'Delivery Loop' ? '🍕' :
                     result.archetype === 'Cooling Dependent Urbanite' ? '❄️' :
                     result.archetype === 'High-Street Shopper' ? '🛍️' :
                     result.archetype === 'Packaging Accumulator' ? '📦' : '🌱'}
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
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                      Estimated Footprint: {(result.totalCo2e / 1000).toFixed(2)} Tons CO₂e / Year
                    </h4>
                    <p style={{ fontSize: '0.9rem' }}>
                      If this pattern continues, your timeline bends toward a <strong>{result.futureMood.toLowerCase()}</strong> future.
                    </p>
                  </div>
                </div>

                {/* Categories Bar Chart */}
                <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Impact Contribution Breakdown</h4>
                <div className="analysis-category-grid">
                  {(['transport', 'food', 'energy', 'shopping', 'waste'] as const).map((cat) => {
                    const score = result.categoryScores[cat];
                    // Max values for each category to calculate relative percentages:
                    // transport: 12, food: 8, energy: 10, shopping: 8, waste: 7
                    const maxScore = cat === 'transport' ? 12 : cat === 'food' ? 8 : cat === 'energy' ? 10 : cat === 'shopping' ? 8 : 7;
                    const pct = Math.min(100, Math.max(8, (score / maxScore) * 100));
                    
                    const barColor = cat === 'transport' ? 'var(--secondary)' : cat === 'food' ? '#F59E0B' : cat === 'energy' ? '#EF4444' : cat === 'shopping' ? '#8B5CF6' : '#0284C7';
                    const lightBg = cat === 'transport' ? 'var(--secondary-light)' : cat === 'food' ? '#FEF3C7' : cat === 'energy' ? '#FEE2E2' : cat === 'shopping' ? '#F5F3FF' : '#E0F2FE';

                    return (
                      <div key={cat} className="category-bar-card" style={{ backgroundColor: lightBg }}>
                        <span className="category-bar-label" style={{ color: barColor }}>
                          {renderCategoryIcon(cat)} {cat}
                        </span>
                        <div className="category-bar-outer">
                          <div
                            className="category-bar-fill"
                            style={{ width: `${pct}%`, backgroundColor: barColor }}
                          />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {score} pts
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
                  * Disclaimer: This is an awareness estimate, not official carbon accounting. Real emissions vary by region, energy mix, lifestyle context, and product details.
                </p>
              </div>

              {/* Recommendation Shift card */}
              <div className="card" style={{ border: '2px solid var(--primary)', backgroundColor: 'var(--primary-light)' }}>
                <span className="archetype-badge" style={{ backgroundColor: 'var(--primary-hover)' }}>YOUR TIMELINE SHIFT</span>
                <h3 style={{ margin: '10px 0 6px', color: 'var(--primary-hover)' }}>The Habit Shift</h3>
                <p style={{ marginBottom: '14px', fontSize: '1rem', color: 'var(--text-main)' }}>
                  Behavior changes fail when we attempt too much. Change just <strong>one repeating pattern</strong> to bend the timeline:
                </p>
                <div className="shift-highlight-box">
                  "{result.recommendedShift}"
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                      IMPACT RECOVERY
                    </span>
                    <h4 style={{ color: 'var(--primary-hover)' }}>
                      -{Math.round(result.totalCo2e - result.shiftedCo2e)} kg CO₂e / Year
                    </h4>
                  </div>
                  <button className="btn btn-primary" onClick={handleCommitPledge}>
                    Commit to Habit Shift
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Future Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Timeline result={result} checkInCount={0} />

              {/* Future Self Note Module */}
              <div className="card">
                <h3>Reflection: Note From 2050</h3>
                <p style={{ marginBottom: '16px' }}>
                  Read a message sent back in time from your future self.
                </p>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button className="btn btn-outline" style={{ flex: 1, minHeight: '40px' }} onClick={() => handleLoadNote('local')}>
                    Read Note
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, minHeight: '40px' }} onClick={() => handleLoadNote('ai')}>
                    Personalize with AI
                  </button>
                </div>

                {showNote && (
                  <div style={{ marginTop: '12px' }}>
                    {isGeneratingNote ? (
                      <div className="future-note-box" style={{ textAlign: 'center', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div>
                          <div style={{ fontSize: '2rem', animation: 'svgSpin 2s linear infinite', display: 'inline-block', marginBottom: '8px' }}>⌛</div>
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
            <span className="hero-tag" style={{ alignSelf: 'center', marginBottom: '8px' }}>
              ACTIVE PLEDGE
            </span>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Your Habit Shift Commitment</h2>
            <p>You committed to changing this repeating pattern to bend the future:</p>

            <div className="shift-highlight-box">
              "{history.pledge.shiftText}"
            </div>

            {/* Daily Return Check-in tracker */}
            <div className="daily-tracker-card">
              <h3>Daily Check-in Log</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
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
                      <span style={{ fontSize: '0.9rem', marginTop: '-2px' }}>{idx + 1}</span>
                    </div>
                  );
                })}
              </div>

              {/* Checkin button */}
              {history.checkInDates.includes(getTodayDateString()) ? (
                <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', color: 'var(--primary-hover)', fontWeight: 600 }}>
                  ✓ You completed today's shift! Great job. Come back tomorrow to record the next day.
                </div>
              ) : (
                <button className="btn btn-primary" onClick={handleCheckIn} style={{ width: '100%', maxWidth: '280px' }}>
                  I stuck to my shift today!
                </button>
              )}
            </div>

            {/* Live City Simulation under shifted pledge */}
            <div style={{ marginTop: '24px', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '8px' }}>Your Shifted Future City</h3>
              <p style={{ marginBottom: '16px' }}>
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

            <div style={{ marginTop: '30px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
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

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Carbon Time Machine. Built for PromptWars Challenge 3.</p>
        <p style={{ fontSize: '0.75rem' }}>
          Fully client-side simulator. Private data stored exclusively in your local browser's storage.
        </p>
      </footer>
    </div>
  );
};
export default App;
