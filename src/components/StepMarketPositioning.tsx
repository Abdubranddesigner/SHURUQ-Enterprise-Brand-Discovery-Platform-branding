import React from 'react';
import { QuestionnaireAnswers } from '../types';

interface StepMarketPositioningProps {
  answers: QuestionnaireAnswers;
  onAnswerChange: (field: keyof QuestionnaireAnswers, value: string) => void;
}

export const StepMarketPositioning: React.FC<StepMarketPositioningProps> = ({
  answers,
  onAnswerChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6 border-l-4 border-l-shuruq-gold">
        <span className="text-xs font-bold uppercase tracking-widest text-shuruq-gold block mb-1">
          Section B
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Market & Positioning
        </h2>
        <p className="text-sm text-shuruq-textSecondary mt-1 leading-relaxed">
          Define your target demographics, competitive landscape, and unique positioning.
        </p>
      </div>

      <div className="space-y-5">
        {/* Q6 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              06
            </span>
            <label className="text-sm font-semibold text-white">
              How do you differ from your competitors? What sets you apart?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q6}
            onChange={(e) => onAnswerChange('q6', e.target.value)}
            placeholder="Highlight your unique selling propositions (USPs), superior service, pricing, or innovation..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q7 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              07
            </span>
            <label className="text-sm font-semibold text-white">
              How old is your target audience?
            </label>
          </div>
          <input
            type="text"
            value={answers.q7}
            onChange={(e) => onAnswerChange('q7', e.target.value)}
            placeholder="e.g. 20-35 young professionals, business owners, B2B executives..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q8 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              08
            </span>
            <label className="text-sm font-semibold text-white">
              Where are your target audience based?
            </label>
          </div>
          <input
            type="text"
            value={answers.q8}
            onChange={(e) => onAnswerChange('q8', e.target.value)}
            placeholder="e.g. Addis Ababa, regional cities across Ethiopia, East Africa, International diaspora..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
