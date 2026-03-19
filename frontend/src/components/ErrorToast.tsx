'use client';

import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl max-w-sm animate-fade-up"
      style={{
        background: 'rgba(18,12,12,0.95)',
        border: '1px solid rgba(239,68,68,0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-body text-red-200/80 flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-400/50 hover:text-red-400 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
