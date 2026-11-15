import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const STEP_LABELS = [
  'Client & Package',
  'A: Foundation',
  'B: Market',
  'C: Visual',
  'D: Review & Send',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  completedSteps,
}) => {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full bg-shuruq-surface border border-shuruq-border rounded-xl p-4 sm:p-5 mb-8">
      {/* Top row: step name and progress % */}
      <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
        <span className="text-shuruq-textSecondary">
          Step <strong className="text-shuruq-gold">{currentStep}</strong> of {totalSteps}:{' '}
          <span className="text-white font-medium">{STEP_LABELS[currentStep - 1]}</span>
        </span>
        <span className="font-semibold text-shuruq-gold">
          {percentage}% Completed
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-shuruq-bg rounded-full overflow-hidden mb-5 border border-shuruq-border/60">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-shuruq-gold transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2">
        {STEP_LABELS.map((label, idx) => {
          const stepNumber = idx + 1;
          const isCurrent = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);
          const isClickable = stepNumber < currentStep || isCompleted;

          return (
            <button
              key={label}
              type="button"
              disabled={!isClickable && !isCurrent}
              onClick={() => onStepClick(stepNumber)}
              className={`flex flex-col items-center text-center transition-all group ${
                isClickable || isCurrent ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                  isCurrent
                    ? 'bg-shuruq-gold text-shuruq-bg ring-4 ring-shuruq-gold/20'
                    : isCompleted
                    ? 'bg-shuruq-gold/20 border border-shuruq-gold text-shuruq-gold'
                    : 'bg-shuruq-surfaceLight border border-shuruq-border text-shuruq-textMuted'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs truncate max-w-full font-medium ${
                  isCurrent
                    ? 'text-shuruq-gold'
                    : isCompleted
                    ? 'text-shuruq-textSecondary'
                    : 'text-shuruq-textMuted'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
