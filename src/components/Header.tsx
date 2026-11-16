import React from 'react';
import { Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO, STORAGE_KEY } from '../lib/constants';

interface HeaderProps {
  onRestart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRestart }) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onRestart) {
      onRestart();
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('Could not clear local draft storage:', err);
      }
      window.location.href = '/';
    }
  };

  return (
    <header className="border-b border-shuruq-border bg-shuruq-surface/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Clickable Brand Logo - Refreshes & Restarts */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-3.5 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-shuruq-gold rounded-lg p-1 -m-1 transition-all active:scale-[0.98]"
          title="SHURUQ Enterprise - Click to refresh and restart"
        >
          <img
            src="/logos/shuruq-logo.png"
            alt="SHURUQ Enterprise Logo"
            className="h-8 sm:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
          />
          <div className="hidden sm:block border-l border-shuruq-border pl-3 text-left">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-shuruq-gold group-hover:text-amber-300 transition-colors">
              Brand Discovery
            </span>
            <span className="block text-[10px] text-shuruq-textMuted font-medium tracking-normal">
              Client Onboarding Platform
            </span>
          </div>
        </button>

        {/* Direct Contact & Security Status */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-shuruq-bg border border-shuruq-border text-shuruq-textSecondary">
            <ShieldCheck className="w-3.5 h-3.5 text-shuruq-gold" />
            <span>Secure 256-Bit SSL</span>
          </div>

          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-shuruq-gold/10 border border-shuruq-borderGold text-shuruq-gold hover:bg-shuruq-gold hover:text-shuruq-bg transition-all duration-200 font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Direct</span>
          </a>

          <a
            href={`tel:${COMPANY_INFO.directLine.replace(/\s+/g, '')}`}
            className="hidden sm:flex items-center gap-1.5 text-shuruq-textSecondary hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-shuruq-gold" />
            <span>{COMPANY_INFO.directLine}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
