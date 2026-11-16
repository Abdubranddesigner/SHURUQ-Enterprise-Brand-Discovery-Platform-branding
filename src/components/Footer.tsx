import React from 'react';
import { Phone, Mail, ShieldCheck, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import { COMPANY_INFO, SOCIAL_LINKS } from '../lib/constants';

// Clean SVG icon for TikTok
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.35 0 .69.06 1 .18V9.45a6.37 6.37 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.71 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V8.58a8.31 8.31 0 0 0 4.91 1.58V6.71a4.9 4.9 0 0 1-1-.02z" />
  </svg>
);

// Clean SVG icon for Telegram
const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

export const Footer: React.FC = () => {
  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'LinkedIn':
        return <Linkedin className="w-4 h-4" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4" />;
      case 'TikTok':
        return <TikTokIcon className="w-4 h-4" />;
      case 'YouTube':
        return <Youtube className="w-4 h-4" />;
      case 'Telegram':
        return <TelegramIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-shuruq-border bg-shuruq-surface/60 backdrop-blur-md mt-16 text-shuruq-textMuted text-xs">
      {/* Main Footer Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <div className="inline-block">
              <img
                src="/logos/shuruq-logo.png"
                alt="SHURUQ Enterprise"
                className="h-9 w-auto object-contain mx-auto md:mx-0"
              />
            </div>
            <p className="text-sm text-shuruq-textSecondary max-w-sm leading-relaxed mx-auto md:mx-0">
              {COMPANY_INFO.tagline} Crafting iconic, timeless brand identities and strategic visual systems for ambitious businesses worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-1">
              <a
                href={`tel:${COMPANY_INFO.directLine.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-shuruq-textSecondary hover:text-shuruq-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-shuruq-gold" />
                <span>{COMPANY_INFO.directLine}</span>
              </a>
              <span className="text-shuruq-border hidden sm:inline">&bull;</span>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-1.5 text-shuruq-textSecondary hover:text-shuruq-gold transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-shuruq-gold" />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Social Channels Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-widest text-shuruq-gold block mb-1">
                Official Channels
              </span>
              <h3 className="text-sm font-semibold text-white">
                Follow & Connect with SHURUQ Enterprise
              </h3>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-shuruq-bg border border-shuruq-border hover:border-shuruq-gold/60 hover:bg-shuruq-gold/10 text-shuruq-textSecondary hover:text-shuruq-gold transition-all duration-200 group"
                  title={`${social.name} - ${social.handle}`}
                >
                  <span className="text-shuruq-textMuted group-hover:text-shuruq-gold transition-colors">
                    {getSocialIcon(social.name)}
                  </span>
                  <div className="text-left overflow-hidden">
                    <span className="block text-xs font-semibold text-white group-hover:text-shuruq-gold transition-colors leading-tight">
                      {social.name}
                    </span>
                    <span className="block text-[10px] text-shuruq-textMuted truncate">
                      {social.handle}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Security */}
        <div className="mt-10 pt-6 border-t border-shuruq-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-shuruq-textMuted">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-shuruq-gold font-semibold">{COMPANY_INFO.name}</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-shuruq-textSecondary">
            <ShieldCheck className="w-3.5 h-3.5 text-shuruq-gold" />
            <span>Confidential Discovery & Onboarding &bull; 256-Bit SSL Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
