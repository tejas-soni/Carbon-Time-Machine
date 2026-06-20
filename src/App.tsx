/**
 * @fileoverview Main application controller and routing component.
 * Manages the state and transitions between the landing, quiz, results, and pledge screens.
 */
import React, { useState, useEffect } from 'react';
import { LandingScreen } from './components/screens/LandingScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { PledgeScreen } from './components/screens/PledgeScreen';
import { QUESTIONS, calculateResults, ARCHETYPE_RECOMMENDATIONS } from './utils/scoring';
import {
  loadResultData,
  saveResultData,
  loadCheckInHistory,
  createPledge,
  addCheckInToday,
  clearAllData
} from './utils/storage';
import { log } from './utils/logger';
import { generateFutureNote } from './utils/templates';
import { QuizAnswers, ResultData, CheckInHistory } from './types';

/** Screen state type for routing within the app. */
type ScreenState = 'landing' | 'quiz' | 'results' | 'pledge';

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
        <LandingScreen onStartQuiz={() => setScreen('quiz')} />
      )}

      {/* Quiz Questionnaire */}
      {screen === 'quiz' && (
        <QuizScreen
          currentQIndex={currentQIndex}
          answers={answers}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {/* Results Dashboard */}
      {screen === 'results' && result && (
        <ResultsScreen
          result={result}
          onCommitPledge={handleCommitPledge}
          showNote={showNote}
          isGeneratingNote={isGeneratingNote}
          noteContent={noteContent}
          onLoadNote={handleLoadNote}
        />
      )}

      {/* Pledge & Daily Return Tracker Screen */}
      {screen === 'pledge' && result && history && (
        <PledgeScreen
          result={result}
          history={history}
          onCheckIn={handleCheckIn}
          onReset={handleReset}
          onViewDashboard={() => setScreen('results')}
        />
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
