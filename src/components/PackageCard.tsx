import React from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';
import { PackageDetails, PackageId } from '../types';

interface PackageCardProps {
  pkg: PackageDetails;
  isSelected: boolean;
  onSelect: (id: PackageId) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className={`relative cursor-pointer rounded-xl p-5 sm:p-6 transition-all duration-200 border flex flex-col justify-between ${
        isSelected
          ? 'bg-shuruq-surfaceElevated border-shuruq-gold ring-1 ring-shuruq-gold gold-glow'
          : 'bg-shuruq-surface border-shuruq-border hover:border-shuruq-borderGold/60 hover:bg-shuruq-surfaceLight'
      }`}
    >
      {/* Top Badge */}
      {pkg.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-shuruq-bg text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-md">
          <Sparkles className="w-2.5 h-2.5" />
          {pkg.badge}
        </div>
      )}

      <div>
        {/* Header & Radio */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {pkg.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-shuruq-textSecondary mt-1">
              <Clock className="w-3.5 h-3.5 text-shuruq-gold" />
              <span>{pkg.timeline}</span>
            </div>
          </div>
          
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              isSelected
                ? 'border-shuruq-gold bg-shuruq-gold text-shuruq-bg'
                : 'border-shuruq-border bg-shuruq-bg'
            }`}
          >
            {isSelected && <div className="w-2 h-2 rounded-full bg-shuruq-bg" />}
          </div>
        </div>

        {/* Pricing */}
        <div className="my-4 py-3 border-y border-shuruq-border/60">
          <div className="text-2xl sm:text-3xl font-extrabold text-shuruq-gold font-['Montserrat']">
            {pkg.priceETB}
          </div>
          <p className="text-[11px] text-shuruq-textMuted mt-0.5">
            Fixed professional rate (Ethiopia Local)
          </p>
        </div>

        {/* Deliverables */}
        <ul className="space-y-2.5 text-xs sm:text-sm text-shuruq-textSecondary mb-6">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-shuruq-gold/15 text-shuruq-gold flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-shuruq-textSecondary leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Select button */}
      <button
        type="button"
        className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
          isSelected
            ? 'bg-shuruq-gold text-shuruq-bg shadow-lg shadow-yellow-500/10'
            : 'bg-shuruq-surfaceLight text-shuruq-textSecondary hover:text-white border border-shuruq-border'
        }`}
      >
        {isSelected ? 'Selected Package' : 'Select ' + pkg.name}
      </button>
    </div>
  );
};
