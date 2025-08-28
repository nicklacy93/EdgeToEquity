'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingContextType {
  currentStep: number;
  isComplete: boolean;
  showWelcomeModal: boolean;
  progress: number;
  isOnboardingActive: boolean;
  steps: OnboardingStep[];
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  dismissWelcomeModal: () => void;
  skipOnboarding: () => void;
  completeStep: (stepId: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { 
      id: 'welcome', 
      title: 'Welcome to EdgeToEquity', 
      description: 'Get started with your professional trading platform',
      completed: false 
    },
    { 
      id: 'profile', 
      title: 'Complete Your Profile', 
      description: 'Set up your trading profile and preferences',
      completed: false 
    },
    { 
      id: 'preferences', 
      title: 'Set Trading Preferences', 
      description: 'Configure your default trading settings and risk parameters',
      completed: false 
    },
    { 
      id: 'verification', 
      title: 'Account Verification', 
      description: 'Verify your identity to unlock all platform features',
      completed: false 
    },
    { 
      id: 'dashboard', 
      title: 'Explore Dashboard', 
      description: 'Familiarize yourself with the trading interface and tools',
      completed: false 
    },
  ]);

  const totalSteps = steps.length;
  const isOnboardingActive = !isComplete;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  const completeOnboarding = () => {
    setIsComplete(true);
    setShowWelcomeModal(false);
    setSteps(prev => prev.map(step => ({ ...step, completed: true })));
  };

  const dismissWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const skipOnboarding = () => {
    setIsComplete(true);
    setShowWelcomeModal(false);
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / totalSteps) * 100;

  const value: OnboardingContextType = {
    currentStep,
    isComplete,
    showWelcomeModal,
    progress,
    isOnboardingActive,
    steps,
    nextStep,
    previousStep,
    completeOnboarding,
    dismissWelcomeModal,
    skipOnboarding,
    completeStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
