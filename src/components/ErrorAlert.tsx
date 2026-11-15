import React from 'react';
import { AlertCircle, RotateCcw, MessageSquare, X } from 'lucide-react';
import { COMPANY_INFO } from '../lib/constants';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
  isSubmitting: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onDismiss,
  isSubmitting,
}) => {
  return (
    <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 sm:p-5 text-left mb-6 relative animate-shake">
      <button
        onClick={onDismiss}
        className="absolute right-3.5 top-3.5 text-red-400/80 hover:text-red-200 transition-colors p-1"
        aria-label="Close error message"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-bold text-red-300">
              Submission Delivery Incomplete
            </h4>
            <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onRetry}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Submission</span>
            </button>

            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-shuruq-surface border border-shuruq-border text-shuruq-gold hover:text-white rounded-lg flex items-center gap-1.5 transition-colors font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Us Directly on WhatsApp</span>
            </a>
          </div>

          <p className="text-[11px] text-red-300/70 italic mt-1">
            Note: All your answers and selected package are safely preserved. You will not lose any data.
          </p>
        </div>
      </div>
    </div>
  );
};
