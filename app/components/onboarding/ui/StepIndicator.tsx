import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-bolt-elements-borderColor rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="absolute top-0 right-0 text-xs text-bolt-elements-textSecondary mt-3">
          第 {currentStep} 步，共 {totalSteps} 步
        </div>
      </div>

      {/* Step Dots */}
      <div className="flex justify-between items-center">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary border-2 border-bolt-elements-borderColor'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <div
                className={`
                text-xs mt-2 text-center transition-colors duration-300 px-2
                ${
                  isCurrent
                    ? 'text-bolt-elements-textPrimary font-medium'
                    : isCompleted
                      ? 'text-bolt-elements-textSecondary'
                      : 'text-bolt-elements-textSecondary opacity-60'
                }
              `}
              >
                {title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
