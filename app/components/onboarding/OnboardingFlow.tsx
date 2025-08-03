import React from 'react';
import { useSearchParams, useNavigate } from '@remix-run/react';
import { StepIndicator } from './ui/StepIndicator';
import { OnboardingDataManager, type OnboardingData } from './OnboardingData';

// AI-powered step component
import { StepChat } from './ai/StepChat';
import { PreviewConfirmStep } from './steps/PreviewConfirmStep';

const STEP_TITLES = ['业务类型', '基本信息', '服务详情', '设计偏好', '联系集成', '预览确认'];

const TOTAL_STEPS = STEP_TITLES.length;

interface OnboardingFlowProps {
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
}

export function OnboardingFlow({ sendMessage }: OnboardingFlowProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentStep = parseInt(searchParams.get('step') || '1', 10);
  const [onboardingData, setOnboardingData] = React.useState<Partial<OnboardingData>>(() =>
    OnboardingDataManager.loadData(),
  );

  const [isLoading, setIsLoading] = React.useState(false);

  // Save data whenever it changes
  React.useEffect(() => {
    OnboardingDataManager.saveData(onboardingData);
  }, [onboardingData]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setSearchParams((prev) => {
        prev.set('step', step.toString());
        return prev;
      });
    }
  };

  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    return OnboardingDataManager.validateStep(currentStep, onboardingData);
  };

  const finishOnboarding = async () => {
    setIsLoading(true);

    try {
      // Generate comprehensive prompt from collected data
      const prompt = OnboardingDataManager.generatePrompt(onboardingData as OnboardingData);

      // Clear onboarding data
      OnboardingDataManager.clearData();

      // Navigate to landing page mode with the generated prompt
      navigate('/?mode=landing-page&from=onboarding');

      // Send the message to start the chat
      if (sendMessage) {
        // Small delay to ensure the navigation completes
        setTimeout(() => {
          const mockEvent = new MouseEvent('click') as any;
          sendMessage(mockEvent, prompt);
        }, 100);
      }
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: onboardingData,
      updateData,
      onNext: goToNextStep,
      onPrev: goToPrevStep,
      canProceed: canProceed(),
    };

    // Use AI chat for steps 1-5, keep preview/confirm step for step 6
    if (currentStep >= 1 && currentStep <= 5) {
      return (
        <StepChat
          step={currentStep}
          data={onboardingData}
          updateData={updateData}
          onNext={goToNextStep}
          onPrev={goToPrevStep}
          sendMessage={sendMessage}
        />
      );
    }

    // Final step uses the preview/confirm component
    if (currentStep === 6) {
      return <PreviewConfirmStep {...stepProps} onFinish={finishOnboarding} isLoading={isLoading} />;
    }

    // Default fallback
    return (
      <StepChat
        step={1}
        data={onboardingData}
        updateData={updateData}
        onNext={goToNextStep}
        onPrev={goToPrevStep}
        sendMessage={sendMessage}
      />
    );
  };

  return (
    <div className="min-h-screen bg-bolt-elements-background-depth-1 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-bolt-elements-textPrimary">智能引导模式</span>
          </div>
          <h1 className="text-3xl font-bold text-bolt-elements-textPrimary mb-3">为您定制专业 Landing Page</h1>
          <p className="text-bolt-elements-textSecondary max-w-2xl mx-auto">
            通过几个简单步骤，我们将收集您的需求信息，然后为您生成完整的专业网站项目
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} stepTitles={STEP_TITLES} />

        {/* Current Step Content */}
        <div className="max-w-4xl mx-auto">{renderCurrentStep()}</div>

        {/* Exit Option */}
        <div className="text-center mt-8 pt-8 border-t border-bolt-elements-borderColor">
          <button
            onClick={() => navigate('/?mode=landing-page')}
            className="text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors duration-200"
          >
            跳过引导，直接开始对话 →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
