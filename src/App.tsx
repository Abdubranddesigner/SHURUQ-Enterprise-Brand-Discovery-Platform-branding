import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Send, RotateCcw, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { StepClientAndPackage } from './components/StepClientAndPackage';
import { StepBusinessFoundation } from './components/StepBusinessFoundation';
import { StepMarketPositioning } from './components/StepMarketPositioning';
import { StepVisualDirection } from './components/StepVisualDirection';
import { StepProjectRequirements } from './components/StepProjectRequirements';
import { SuccessModal } from './components/SuccessModal';
import { ErrorAlert } from './components/ErrorAlert';
import { Footer } from './components/Footer';
import { ClientInfo, PackageId, QuestionnaireAnswers, SubmissionPayload, ApiResponse } from './types';
import { STORAGE_KEY } from './lib/constants';
import { generateDiscoveryPdf } from './lib/pdfGenerator';

const INITIAL_CLIENT_INFO: ClientInfo = {
  fullName: '',
  businessName: '',
  whatsappNumber: '',
  preferredContactMethod: 'whatsapp',
  email: '',
  additionalComments: '',
  honeypot: '',
};

const INITIAL_ANSWERS: QuestionnaireAnswers = {
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
  q6: '',
  q7: '',
  q8: '',
  q9: '',
  q10: '',
  q11: '',
  q12: '',
  inspirationUrls: [],
  q13: '',
  q14: '',
  q15: '',
};

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [clientInfo, setClientInfo] = useState<ClientInfo>(INITIAL_CLIENT_INFO);
  const [selectedPackage, setSelectedPackage] = useState<PackageId>('pro');
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(INITIAL_ANSWERS);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<{ referenceId: string } | null>(null);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.clientInfo) setClientInfo(parsed.clientInfo);
        if (parsed.selectedPackage) setSelectedPackage(parsed.selectedPackage);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.completedSteps) setCompletedSteps(parsed.completedSteps);
      }
    } catch (e) {
      console.warn('Could not read saved draft from localStorage:', e);
    }
  }, []);

  // Persist draft on changes
  useEffect(() => {
    if (successResponse) return; // Don't persist after success
    try {
      const payload = {
        clientInfo,
        selectedPackage,
        answers,
        currentStep,
        completedSteps,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not save draft to localStorage:', e);
    }
  }, [clientInfo, selectedPackage, answers, currentStep, completedSteps, successResponse]);

  const handleClientInfoChange = (field: keyof ClientInfo, value: string) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAnswerChange = (field: keyof QuestionnaireAnswers, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePackageSelect = (id: PackageId) => {
    setSelectedPackage(id);
  };

  // Validation per step
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!clientInfo.fullName.trim() || clientInfo.fullName.trim().length < 2) {
        errors.fullName = 'Full name is required (minimum 2 characters).';
      }
      if (!clientInfo.businessName.trim() || clientInfo.businessName.trim().length < 2) {
        errors.businessName = 'Business name is required (minimum 2 characters).';
      }
      const digits = clientInfo.whatsappNumber.replace(/[^0-9]/g, '');
      if (!clientInfo.whatsappNumber.trim() || digits.length < 9) {
        errors.whatsappNumber = 'Please provide a valid phone/WhatsApp number (at least 9 digits).';
      }
    } else if (currentStep === 2) {
      if (!answers.q1.trim()) {
        errors.q1 = 'Please briefly describe your product or service.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepJump = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear your current draft and reset all answers?')) {
      localStorage.removeItem(STORAGE_KEY);
      setClientInfo(INITIAL_CLIENT_INFO);
      setSelectedPackage('pro');
      setAnswers(INITIAL_ANSWERS);
      setCurrentStep(1);
      setCompletedSteps([]);
      setFieldErrors({});
      setSubmissionError(null);
    }
  };

  // Final Form Submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    const referenceId = `SHQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Pre-render the official discovery PDF directly in the client browser
    let pdfBase64: string | undefined = undefined;
    try {
      const doc = generateDiscoveryPdf({ clientInfo, selectedPackage, answers }, referenceId);
      const uri = doc.output('datauristring');
      if (uri && uri.includes(',')) {
        pdfBase64 = uri.split(',')[1];
      }
    } catch (e) {
      console.warn('Client-side PDF rendering error:', e);
    }

    const payload: SubmissionPayload = {
      clientInfo,
      selectedPackage,
      answers,
      referenceId,
      pdfBase64,
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: ApiResponse;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server responded with HTTP ${response.status}`);
      }

      if (response.ok && data.success) {
        // Successful SMTP delivery
        localStorage.removeItem(STORAGE_KEY);
        setSuccessResponse({ referenceId: data.referenceId || 'SHQ-SUCCESS' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Backend rejection or SMTP error
        setSubmissionError(
          data.message ||
            'Failed to transmit questionnaire through SMTP. Please verify your connection or reach out on WhatsApp.'
        );
      }
    } catch (err: unknown) {
      const error = err as Error;
      setSubmissionError(
        `Network error: Could not reach the submission server (${error.message || 'Connection failed'}). All your answers are safely preserved.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAfterSuccess = () => {
    setSuccessResponse(null);
    setClientInfo(INITIAL_CLIENT_INFO);
    setSelectedPackage('pro');
    setAnswers(INITIAL_ANSWERS);
    setCurrentStep(1);
    setCompletedSteps([]);
    setFieldErrors({});
    setSubmissionError(null);
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSuccessResponse(null);
    setClientInfo(INITIAL_CLIENT_INFO);
    setSelectedPackage('pro');
    setAnswers(INITIAL_ANSWERS);
    setCurrentStep(1);
    setCompletedSteps([]);
    setFieldErrors({});
    setSubmissionError(null);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-shuruq-bg text-shuruq-textPrimary flex flex-col justify-between">
      {/* Navigation Header with Restart Handler */}
      <Header onRestart={handleRestart} />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {successResponse ? (
          <SuccessModal
            referenceId={successResponse.referenceId}
            clientInfo={clientInfo}
            selectedPackage={selectedPackage}
            answers={answers}
            onReset={handleResetAfterSuccess}
          />
        ) : (
          <div>
            {/* Top Hero Banner */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-shuruq-gold/10 border border-shuruq-borderGold text-shuruq-gold text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Brand Discovery Process</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Montserrat']">
                Shape Your Brand Identity
              </h1>
              <p className="text-sm sm:text-base text-shuruq-textSecondary max-w-xl mx-auto mt-2 leading-relaxed">
                Complete this discovery questionnaire so our senior brand architects can understand your vision and design an iconic visual identity for your business.
              </p>
            </div>

            {/* Error Notification Alert */}
            {submissionError && (
              <ErrorAlert
                message={submissionError}
                onRetry={handleSubmit}
                onDismiss={() => setSubmissionError(null)}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Progress Stepper */}
            <ProgressBar
              currentStep={currentStep}
              totalSteps={5}
              onStepClick={handleStepJump}
              completedSteps={completedSteps}
            />

            {/* Step Views */}
            <div className="mb-8">
              {currentStep === 1 && (
                <StepClientAndPackage
                  clientInfo={clientInfo}
                  selectedPackage={selectedPackage}
                  onClientInfoChange={handleClientInfoChange}
                  onPackageSelect={handlePackageSelect}
                  errors={fieldErrors}
                />
              )}

              {currentStep === 2 && (
                <StepBusinessFoundation
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  errors={fieldErrors}
                />
              )}

              {currentStep === 3 && (
                <StepMarketPositioning
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              )}

              {currentStep === 4 && (
                <StepVisualDirection
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              )}

              {currentStep === 5 && (
                <StepProjectRequirements
                  clientInfo={clientInfo}
                  selectedPackage={selectedPackage}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  onClientInfoChange={handleClientInfoChange}
                />
              )}
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-shuruq-border">
              {/* Reset draft button */}
              <button
                type="button"
                onClick={handleClearDraft}
                className="text-xs text-shuruq-textMuted hover:text-red-400 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Questionnaire</span>
              </button>

              {/* Prev / Next / Submit actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePrevStep}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-shuruq-surface hover:bg-shuruq-surfaceLight border border-shuruq-border text-shuruq-textSecondary hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-shuruq-gold hover:bg-shuruq-goldHover text-shuruq-bg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-yellow-500/10"
                  >
                    <span>Next Section</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="flex-1 sm:flex-none px-8 py-3 rounded-lg bg-shuruq-gold hover:bg-shuruq-goldHover disabled:opacity-60 text-shuruq-bg font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-yellow-500/15"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending via Gmail SMTP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Questionnaire</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Footer with Social Channels */}
      <Footer />
    </div>
  );
};
