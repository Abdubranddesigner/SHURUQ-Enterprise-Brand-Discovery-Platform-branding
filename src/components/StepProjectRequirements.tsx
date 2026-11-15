import React from 'react';
import { PackageCheck, ShieldCheck, UserCheck } from 'lucide-react';
import { ClientInfo, PackageId, QuestionnaireAnswers } from '../types';
import { OFFICIAL_PACKAGES } from '../lib/constants';

interface StepProjectRequirementsProps {
  clientInfo: ClientInfo;
  selectedPackage: PackageId;
  answers: QuestionnaireAnswers;
  onAnswerChange: (field: keyof QuestionnaireAnswers, value: string) => void;
  onClientInfoChange: (field: keyof ClientInfo, value: string) => void;
}

export const StepProjectRequirements: React.FC<StepProjectRequirementsProps> = ({
  clientInfo,
  selectedPackage,
  answers,
  onAnswerChange,
  onClientInfoChange,
}) => {
  const pkg = OFFICIAL_PACKAGES[selectedPackage] || OFFICIAL_PACKAGES.pro;

  return (
    <div className="space-y-6">
      <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6 border-l-4 border-l-shuruq-gold">
        <span className="text-xs font-bold uppercase tracking-widest text-shuruq-gold block mb-1">
          Section D
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Project Requirements & Final Review
        </h2>
        <p className="text-sm text-shuruq-textSecondary mt-1 leading-relaxed">
          Specify any additional deliverables, success criteria, and review your complete submission before sending.
        </p>
      </div>

      <div className="space-y-5">
        {/* Q13 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              13
            </span>
            <label className="text-sm font-semibold text-white">
              Do you require any additional supporting designs alongside your logo? (e.g., business cards, social media kits, packaging)
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q13}
            onChange={(e) => onAnswerChange('q13', e.target.value)}
            placeholder="List any collateral (business cards, stationery, invoices, 3D packaging mockups)..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q14 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              14
            </span>
            <label className="text-sm font-semibold text-white">
              Any questions or comments?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q14}
            onChange={(e) => onAnswerChange('q14', e.target.value)}
            placeholder="Any specific questions regarding workflow, file formats, or design execution..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Q15 */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-shuruq-gold/15 text-shuruq-gold font-bold text-xs">
              15
            </span>
            <label className="text-sm font-semibold text-white">
              And finally, what does success look like for this project?
            </label>
          </div>
          <textarea
            rows={3}
            value={answers.q15}
            onChange={(e) => onAnswerChange('q15', e.target.value)}
            placeholder="What milestone or standard of quality will make this brand engagement a total victory?"
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Additional Comments */}
        <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
          <label className="block text-sm font-semibold text-white mb-2">
            General Client Notes / Urgent Deadlines (Optional)
          </label>
          <textarea
            rows={2}
            value={clientInfo.additionalComments || ''}
            onChange={(e) => onClientInfoChange('additionalComments', e.target.value)}
            placeholder="Any other notes you want the design director to know before your consultation..."
            className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg p-3 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
          />
        </div>

        {/* Final Submission Preview Card */}
        <div className="bg-gradient-to-b from-shuruq-surface to-shuruq-surfaceElevated border border-shuruq-borderGold rounded-xl p-5 sm:p-6 gold-glow">
          <div className="flex items-center gap-2 text-shuruq-gold font-bold text-sm uppercase tracking-wider mb-4 border-b border-shuruq-border pb-3">
            <ShieldCheck className="w-5 h-5" />
            <span>Submission Summary Preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-shuruq-textSecondary">
                <UserCheck className="w-4 h-4 text-shuruq-gold" />
                <span className="text-white font-semibold">{clientInfo.fullName || 'Not specified'}</span>
              </div>
              <div className="text-shuruq-textSecondary">
                Business: <span className="text-shuruq-gold font-semibold">{clientInfo.businessName || 'Not specified'}</span>
              </div>
              <div className="text-shuruq-textSecondary">
                Contact: <span className="text-white">{clientInfo.whatsappNumber} ({clientInfo.preferredContactMethod})</span>
              </div>
            </div>

            <div className="space-y-2 sm:border-l sm:border-shuruq-border sm:pl-4">
              <div className="flex items-center gap-2 text-shuruq-textSecondary">
                <PackageCheck className="w-4 h-4 text-shuruq-gold" />
                <span className="text-white font-semibold">{pkg.name} Package</span>
              </div>
              <div className="text-shuruq-gold font-bold text-lg font-['Montserrat']">
                {pkg.priceETB}
              </div>
              <div className="text-shuruq-textMuted text-xs">
                Timeline: {pkg.timeline}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-shuruq-border/60 text-[11px] text-shuruq-textMuted flex items-center justify-between">
            <span>Official recipient: shuruqenterprise@gmail.com</span>
            <span>Gmail SMTP TLS Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
