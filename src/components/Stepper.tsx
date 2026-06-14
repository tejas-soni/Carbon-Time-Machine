import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  // We can group questions by categories for clean labeling
  // Step 1-3: Transport, 4-5: Food, 6-8: Energy, 9-10: Shopping, 11-12: Waste
  const getCategoryName = (stepIndex: number) => {
    if (stepIndex <= 3) return 'Transport';
    if (stepIndex <= 5) return 'Food';
    if (stepIndex <= 8) return 'Energy';
    if (stepIndex <= 10) return 'Shopping';
    return 'Waste';
  };

  const getStepProgressText = () => {
    const category = getCategoryName(currentStep);
    return `${category} Habit — Question ${currentStep} of ${totalSteps}`;
  };

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{ width: '100%', marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--primary-hover)'
          }}
        >
          {getStepProgressText()}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>

      <div className="stepper-container">
        <div className="stepper-progress-bar">
          <div
            className="stepper-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div
              key={stepNum}
              className={`step-bubble ${isActive ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
              style={{
                // Hide middle steps on mobile to avoid overcrowding
                display:
                  totalSteps > 6 && stepNum !== 1 && stepNum !== totalSteps && !isActive && Math.abs(stepNum - currentStep) > 1
                    ? 'none'
                    : 'flex'
              }}
              title={`Question ${stepNum}`}
            >
              {isCompleted ? '✓' : stepNum}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Stepper;
