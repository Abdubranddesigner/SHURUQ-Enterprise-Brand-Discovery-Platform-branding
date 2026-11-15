import React from 'react';
import { Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../lib/constants';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-shuruq-border bg-shuruq-surface/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo & Wordmark */}
        <div className="flex items-center gap-3.5">
          <img
            src="/logos/Asset 11.svg"
            alt="SHURUQ Enterprise Logo"
            className="h-10 w-auto object-contain rounded"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-widest text-shuruq-gold text-lg sm:text-xl font-['Montserrat']">
                SHURUQ
              </span>
              <span className="text-xs tracking-[0.25em] text-shuruq-textSecondary font-semibold uppercase">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-shuruq-textMuted tracking-wider font-medium">
              Brand Discovery & Client Onboarding
            </p>
          </div>
        </div>

        {/* Direct Contact & Status */}
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
