/**
 * @fileoverview Quiz progress visualization component.
 * Displays a visual progress bar and bubbles to indicate the user's progression
 * through the carbon habit assessment.
 */
import { FC } from 'react';

/** Question step boundaries for each category group. */
const CATEGORY_BOUNDARIES = { transport: 3, food: 5, energy: 8, shopping: 10 } as const;

/** Minimum steps before hiding non-adjacent bubbles on mobile. */
const MOBILE_HIDE_THRESHOLD = 6;

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper: FC<StepperProps> = ({ currentStep, totalSteps }) => {
  /** 
   * Maps a step index to its corresponding quiz category.
   * @param stepIndex - The current 1-indexed step number.
   * @returns The name of the category for the given step.
   */
  const getCategoryName = (stepIndex: number) => {
    if (stepIndex <= CATEGORY_BOUNDARIES.transport) return 'Transport';
    if (stepIndex <= CATEGORY_BOUNDARIES.food) return 'Food';
    if (stepIndex <= CATEGORY_BOUNDARIES.energy) return 'Energy';
    if (stepIndex <= CATEGORY_BOUNDARIES.shopping) return 'Shopping';
    return 'Waste';
  };

  /** 
   * Formats the current progress text.
   * @returns A descriptive string showing category and step progress.
   */
  const getStepProgressText = () => {
    const category = getCategoryName(currentStep);
    return `${category} Habit — Question ${currentStep} of ${totalSteps}`;
  };

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="stepper-wrapper" role="region" aria-label="Quiz Progress">
      <div className="stepper-header">
        <span className="stepper-label" aria-live="polite">
          {getStepProgressText()}
        </span>
        <span className="stepper-percentage">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>

      <div 
        className="stepper-container" 
        role="progressbar" 
        aria-valuenow={currentStep} 
        aria-valuemin={1} 
        aria-valuemax={totalSteps}
      >
        <div className="stepper-progress-bar">
          <div
            className="stepper-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div role="list" style={{ display: 'contents' }}>
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div
                key={stepNum}
                role="listitem"
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Question ${stepNum}${isCompleted ? ', completed' : ''}`}
                className={`step-bubble ${isActive ? 'active' : ''} ${
                  isCompleted ? 'completed' : ''
                } ${
                  totalSteps > MOBILE_HIDE_THRESHOLD && stepNum !== 1 && stepNum !== totalSteps && !isActive && Math.abs(stepNum - currentStep) > 1 ? 'step-bubble-hidden-mobile' : ''
                }`}
                title={`Question ${stepNum}`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Stepper;
