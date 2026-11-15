import React from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, Download, RotateCcw } from 'lucide-react';
import { ClientInfo, PackageId, QuestionnaireAnswers } from '../types';
import { OFFICIAL_PACKAGES, COMPANY_INFO } from '../lib/constants';

interface SuccessModalProps {
  referenceId: string;
  clientInfo: ClientInfo;
  selectedPackage: PackageId;
  answers: QuestionnaireAnswers;
  onReset: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  referenceId,
  clientInfo,
  selectedPackage,
  answers,
  onReset,
}) => {
  const pkg = OFFICIAL_PACKAGES[selectedPackage] || OFFICIAL_PACKAGES.pro;

  const whatsappMessage = encodeURIComponent(
    `Hello SHURUQ Enterprise! I have just submitted my Brand Discovery Questionnaire for "${clientInfo.businessName}" (Reference ID: ${referenceId}, Package: ${pkg.name}). Looking forward to starting our branding journey!`
  );

  const handleDownloadBackup = () => {
    const backupData = {
      referenceId,
      timestamp: new Date().toISOString(),
      clientInfo,
      package: pkg,
      answers,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SHURUQ-Brand-Discovery-${referenceId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-shuruq-surface border border-shuruq-borderGold rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto text-center gold-glow animate-fade-in space-y-6">
      {/* Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-shuruq-gold/15 border-2 border-shuruq-gold flex items-center justify-center mx-auto text-shuruq-gold">
        <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5]" />
      </div>

      {/* Headings */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-shuruq-gold block mb-1">
          Submission Accepted via Gmail SMTP
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Brand Discovery Received!
        </h2>
        <p className="text-sm text-shuruq-textSecondary mt-2 max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-white">{clientInfo.fullName}</strong>. Your full brand discovery dossier for <strong className="text-shuruq-gold">{clientInfo.businessName}</strong> has been transmitted and logged directly to our executive creative inbox.
        </p>
      </div>

      {/* Reference Card */}
      <div className="bg-shuruq-bg border border-shuruq-border rounded-xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-2.5">
        <div className="flex items-center justify-between text-xs border-b border-shuruq-border pb-2">
          <span className="text-shuruq-textMuted uppercase font-semibold tracking-wider">Reference ID</span>
          <span className="font-mono font-bold text-shuruq-gold text-sm tracking-wider">{referenceId}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-shuruq-textSecondary">Selected Package:</span>
          <span className="font-semibold text-white">{pkg.name} ({pkg.priceETB})</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-shuruq-textSecondary">Delivery Timeline:</span>
          <span className="font-semibold text-white">{pkg.timeline}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-shuruq-textSecondary">Official Recipient:</span>
          <span className="text-shuruq-gold">{COMPANY_INFO.email}</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-shuruq-gold hover:bg-shuruq-goldHover text-shuruq-bg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/10"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Connect on WhatsApp Now</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <button
          type="button"
          onClick={handleDownloadBackup}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-shuruq-surfaceLight hover:bg-shuruq-surfaceElevated border border-shuruq-border text-shuruq-textSecondary hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Summary (.json)</span>
        </button>
      </div>

      {/* Start New Submission link */}
      <div className="pt-4 border-t border-shuruq-border/60">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-shuruq-textMuted hover:text-shuruq-gold flex items-center justify-center gap-1.5 mx-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Submit Another Brand Questionnaire</span>
        </button>
      </div>
    </div>
  );
};
