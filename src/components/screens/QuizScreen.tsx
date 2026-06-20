import React from 'react';
import { QUESTIONS } from '../../utils/scoring';
import { QuizAnswers, QuestionCategory } from '../../types';
import Stepper from '../Stepper';

interface QuizScreenProps {
  currentQIndex: number;
  answers: QuizAnswers;
  onAnswerSelect: (idx: number) => void;
  onNext: () => void;
  onBack: () => void;
}

/** Maps impact categories to their respective emoji icons. */
const renderCategoryIcon = (category: string) => {
  const icons: Record<QuestionCategory | string, string> = { transport: '🚲', food: '🥗', energy: '⚡', shopping: '🛍️', waste: '♻️' };
  return icons[category] || '📍';
};

export const QuizScreen: React.FC<QuizScreenProps> = ({
  currentQIndex,
  answers,
  onAnswerSelect,
  onNext,
  onBack
}) => {
  const currentQuestion = QUESTIONS[currentQIndex];
  const isQuestionAnswered = answers[currentQuestion?.id] !== undefined;

  if (!currentQuestion) return null;

  return (
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
                onClick={() => onAnswerSelect(idx)}
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
            onClick={onBack}
            disabled={currentQIndex === 0}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!isQuestionAnswered}
          >
            {currentQIndex === QUESTIONS.length - 1 ? 'See My Future →' : 'Next Question'}
          </button>
        </div>
      </div>
    </section>
  );
};
