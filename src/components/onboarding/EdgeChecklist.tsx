'use client';

import { useOnboarding } from '@/context/OnboardingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EdgeChecklist() {
  const { isOnboardingActive, steps, completeStep, progress, completeOnboarding, currentStep, nextStep, previousStep } = useOnboarding();

  if (!isOnboardingActive) return null;

  const currentStepData = steps[currentStep];
  const completedSteps = steps.filter(step => step.completed).length;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Welcome to EdgeToEquity
            </CardTitle>
            <Badge variant="secondary">
              {completedSteps}/{steps.length} Complete
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: progress + '%' }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.description}</p>
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={previousStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <Button 
                  onClick={() => {
                    completeStep(currentStepData.id);
                    if (currentStep < steps.length - 1) {
                      nextStep();
                    } else {
                      completeOnboarding();
                    }
                  }}
                >
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={'p-4 rounded-lg border ' + (
                  step.completed 
                    ? 'bg-primary/10 border-primary' 
                    : index === currentStep 
                    ? 'bg-muted border-muted-foreground' 
                    : 'bg-background border-border'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={'w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ' + (
                    step.completed 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {step.completed ? '✓' : (index + 1).toString()}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={completeOnboarding}>
              Skip Onboarding
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
