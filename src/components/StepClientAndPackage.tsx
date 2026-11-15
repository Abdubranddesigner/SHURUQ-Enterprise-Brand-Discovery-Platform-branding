import React from 'react';
import { User, Building, Phone, Send, Mail } from 'lucide-react';
import { ClientInfo, PackageId } from '../types';
import { OFFICIAL_PACKAGES } from '../lib/constants';
import { PackageCard } from './PackageCard';

interface StepClientAndPackageProps {
  clientInfo: ClientInfo;
  selectedPackage: PackageId;
  onClientInfoChange: (field: keyof ClientInfo, value: string) => void;
  onPackageSelect: (id: PackageId) => void;
  errors: Record<string, string>;
}

export const StepClientAndPackage: React.FC<StepClientAndPackageProps> = ({
  clientInfo,
  selectedPackage,
  onClientInfoChange,
  onPackageSelect,
  errors,
}) => {
  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
          Client Information & Branding Package
        </h2>
        <p className="text-sm text-shuruq-textSecondary leading-relaxed">
          Welcome to the official SHURUQ Enterprise Brand Discovery Portal. Please enter your business details and select your preferred branding package.
        </p>
      </div>

      {/* Honeypot field for bot protection */}
      <input
        type="text"
        name="website_hp"
        value={clientInfo.honeypot || ''}
        onChange={(e) => onClientInfoChange('honeypot', e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* Client Information Form */}
      <div className="bg-shuruq-surface border border-shuruq-border rounded-xl p-5 sm:p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-shuruq-gold border-b border-shuruq-border pb-2.5">
          1. Your Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-shuruq-textSecondary uppercase tracking-wider mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-shuruq-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={clientInfo.fullName}
                onChange={(e) => onClientInfoChange('fullName', e.target.value)}
                placeholder="e.g. Abdurahman Seid"
                className={`w-full bg-shuruq-bg border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-shuruq-border hover:border-shuruq-textMuted'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-400 mt-1.5">{errors.fullName}</p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold text-shuruq-textSecondary uppercase tracking-wider mb-2">
              Business / Trade Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-shuruq-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={clientInfo.businessName}
                onChange={(e) => onClientInfoChange('businessName', e.target.value)}
                placeholder="e.g. FALAKit Enterprise"
                className={`w-full bg-shuruq-bg border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors ${
                  errors.businessName ? 'border-red-500' : 'border-shuruq-border hover:border-shuruq-textMuted'
                }`}
              />
            </div>
            {errors.businessName && (
              <p className="text-xs text-red-400 mt-1.5">{errors.businessName}</p>
            )}
          </div>

          {/* WhatsApp / Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-shuruq-textSecondary uppercase tracking-wider mb-2">
              WhatsApp / Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-shuruq-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={clientInfo.whatsappNumber}
                onChange={(e) => onClientInfoChange('whatsappNumber', e.target.value)}
                placeholder="e.g. +251 912 345 678"
                className={`w-full bg-shuruq-bg border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors ${
                  errors.whatsappNumber ? 'border-red-500' : 'border-shuruq-border hover:border-shuruq-textMuted'
                }`}
              />
            </div>
            {errors.whatsappNumber && (
              <p className="text-xs text-red-400 mt-1.5">{errors.whatsappNumber}</p>
            )}
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-xs font-semibold text-shuruq-textSecondary uppercase tracking-wider mb-2">
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['whatsapp', 'call', 'telegram'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => onClientInfoChange('preferredContactMethod', method)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
                    clientInfo.preferredContactMethod === method
                      ? 'bg-shuruq-gold/15 border-shuruq-gold text-shuruq-gold'
                      : 'bg-shuruq-bg border-shuruq-border text-shuruq-textSecondary hover:text-white'
                  }`}
                >
                  {method === 'whatsapp' ? 'WhatsApp' : method === 'call' ? 'Phone Call' : 'Telegram'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Email */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-shuruq-textSecondary uppercase tracking-wider mb-2">
            Email Address <span className="text-shuruq-textMuted font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-shuruq-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={clientInfo.email || ''}
              onChange={(e) => onClientInfoChange('email', e.target.value)}
              placeholder="e.g. client@example.com (No account required)"
              className="w-full bg-shuruq-bg border border-shuruq-border hover:border-shuruq-textMuted rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-shuruq-textMuted focus:outline-none focus:ring-1 focus:ring-shuruq-gold transition-colors"
            />
          </div>
          <p className="text-[11px] text-shuruq-textMuted mt-1">
            Email is completely optional. We primarily deliver updates via WhatsApp.
          </p>
        </div>
      </div>

      {/* Package Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-shuruq-border pb-2.5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-shuruq-gold flex items-center gap-2">
            <Send className="w-4 h-4" />
            2. Select Your Branding Package
          </h3>
          <span className="text-xs text-shuruq-textSecondary">
            All prices in Ethiopian Birr (ETB)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {(Object.values(OFFICIAL_PACKAGES)).map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isSelected={selectedPackage === pkg.id}
              onSelect={onPackageSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
