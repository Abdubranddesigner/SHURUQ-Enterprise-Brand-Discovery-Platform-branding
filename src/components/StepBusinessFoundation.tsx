import React from 'react';
import { QuestionnaireAnswers } from '../types';

interface StepBusinessFoundationProps {
  answers: QuestionnaireAnswers;
  onAnswerChange: (field: keyof QuestionnaireAnswers, value: string) => void;
  errors: Record<string, string>;
}

export const StepBusinessFoundation: React.FC<StepBusinessFoundationProps> = ({
  answers,
  onAnswerChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6 border-l-4 border-l-shuruq-gold">
        <span className="text-xs font-bold uppercase tracking-widest text-shuruq-gold block mb-1">
          Section A
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Business Foundation
        </h2>
        <p className="text-sm text-shuruq-textSecondary mt-1 leading-relaxed">
          Help us understand the core purpose, products, and founding ethos of your enterprise.
        </p>
      </div>

      <div className="space-y-5">
        {/* Q1 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              01
            </span>
            <label className="text-sm font-semibold text-white">
              What is your product? What do you do? Or what service do you provide? <span className="text-red-400">*</span>
            </label>
          </div>
          <textarea
            rows={4}
            value={answers.q1}
            onChange={(e) => onAnswerChange('q1', e.target.value)}
            placeholder="Describe your products, services, or solutions in detail..."
            className={`w-full bg-shuruq-bg border rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors ${
              errors.q1 ? 'border-red-500' : 'border-shuruq-border hover:border-shuruq-textMuted'
            }`}
          />
          {errors.q1 && <p className="text-xs text-red-400 mt-1">{errors.q1}</p>}
        </div>

        {/* Q2 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              02
            </span>
            <label className="text-sm font-semibold text-white">
              Why does your company exist? What are the functional, symbolic or experiential benefits?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q2}
            onChange={(e) => onAnswerChange('q2', e.target.value)}
            placeholder="Explain the tangible and emotional value your clients experience..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q3 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              03
            </span>
            <label className="text-sm font-semibold text-white">
              What is the full name of your business?
            </label>
          </div>
          <input
            type="text"
            value={answers.q3}
            onChange={(e) => onAnswerChange('q3', e.target.value)}
            placeholder="Official legal or brand name..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q4 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              04
            </span>
            <label className="text-sm font-semibold text-white">
              Is there a compelling story behind your company? How did you get started?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q4}
            onChange={(e) => onAnswerChange('q4', e.target.value)}
            placeholder="Share your inspiration, milestones, and how the business came to life..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q5 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              05
            </span>
            <label className="text-sm font-semibold text-white">
              What values does your company live by?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q5}
            onChange={(e) => onAnswerChange('q5', e.target.value)}
            placeholder="e.g., Integrity, Craftsmanship, Modernity, Customer-Centricity..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
