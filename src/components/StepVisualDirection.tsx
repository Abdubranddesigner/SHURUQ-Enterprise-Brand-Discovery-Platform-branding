import React, { useState } from 'react';
import { Link2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { QuestionnaireAnswers } from '../types';

interface StepVisualDirectionProps {
  answers: QuestionnaireAnswers;
  onAnswerChange: (field: keyof QuestionnaireAnswers, value: string | string[]) => void;
}

export const StepVisualDirection: React.FC<StepVisualDirectionProps> = ({
  answers,
  onAnswerChange,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleAddUrl = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;

    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        setUrlError('Please enter a valid website link (http or https).');
        return;
      }
      
      const currentUrls = answers.inspirationUrls || [];
      if (!currentUrls.includes(parsed.toString())) {
        onAnswerChange('inspirationUrls', [...currentUrls, parsed.toString()]);
      }
      setNewUrl('');
      setUrlError('');
    } catch {
      setUrlError('Please enter a valid URL (e.g. https://dribbble.com/shots/...)');
    }
  };

  const handleRemoveUrl = (index: number) => {
    const currentUrls = [...(answers.inspirationUrls || [])];
    currentUrls.splice(index, 1);
    onAnswerChange('inspirationUrls', currentUrls);
  };

  return (
    <div className="space-y-6">
      <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6 border-l-4 border-l-shuruq-gold">
        <span className="text-xs font-bold uppercase tracking-widest text-shuruq-gold block mb-1">
          Section C
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Visual Direction & Inspiration
        </h2>
        <p className="text-sm text-shuruq-textSecondary mt-1 leading-relaxed">
          Guide our design team on your aesthetic preferences, colors, and inspirational references.
        </p>
      </div>

      <div className="space-y-5">
        {/* Q9 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              09
            </span>
            <label className="text-sm font-semibold text-white">
              Do you have a specific idea in mind for your new logo?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q9}
            onChange={(e) => onAnswerChange('q9', e.target.value)}
            placeholder="Describe any symbols, monogram styles, emblems, minimalist geometry, or typography you envision..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q10 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              10
            </span>
            <label className="text-sm font-semibold text-white">
              Do you want to use existing brand colours or a particular range of colours?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q10}
            onChange={(e) => onAnswerChange('q10', e.target.value)}
            placeholder="e.g. Obsidian Black & Champagne Gold, Royal Blue & Silver, or specify existing hex colors..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q11 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              11
            </span>
            <label className="text-sm font-semibold text-white">
              Does your logo need a tagline?
            </label>
          </div>
          <input
            type="text"
            value={answers.q11}
            onChange={(e) => onAnswerChange('q11', e.target.value)}
            placeholder="e.g. 'Empowering Ideas. Building the Future.' or 'Need assistance crafting one'"
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q12 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              12
            </span>
            <label className="text-sm font-semibold text-white">
              What current logos do you like and why? Provide links if you can. Try dribbble.com or behance.net for some inspiration.
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q12}
            onChange={(e) => onAnswerChange('q12', e.target.value)}
            placeholder="Describe aesthetics, fonts, or iconic brands you admire..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Inspiration Links Manager */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-shuruq-gold" />
            <label className="text-sm font-semibold text-white">
              Inspiration & Reference Links (Behance, Dribbble, Pinterest, Websites)
            </label>
          </div>
          <p className="text-xs text-shuruq-textMuted mb-3">
            Add links to designs or visual references you want our designers to inspect.
          </p>

          <div className="flex gap-2">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                setUrlError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="https://behance.net/gallery/... or https://dribbble.com/..."
              className="flex-1 bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg px-3 py-2 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-shuruq-gold/15 hover:bg-shuruq-gold text-shuruq-gold hover:text-shuruq-bg border border-shuruq-borderGold rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>
          {urlError && <p className="text-xs text-red-400 mt-1.5">{urlError}</p>}

          {/* URLs List */}
          {(answers.inspirationUrls || []).length > 0 && (
            <div className="mt-4 space-y-2 border-t border-shuruq-border/60 pt-3">
              {(answers.inspirationUrls || []).map((url, idx) => (
                <div
                  key={url + idx}
                  className="flex items-center justify-between gap-3 bg-shuruq-bg/80 border border-shuruq-border px-3.5 py-2 rounded-lg text-xs"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shuruq-gold hover:underline truncate flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(idx)}
                    className="text-shuruq-textMuted hover:text-red-400 p-1 transition-colors"
                    title="Remove Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
