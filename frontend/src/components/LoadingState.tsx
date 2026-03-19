'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'Analysing your event requirements…',
  'Searching curated venue database…',
  'Matching budget and location preferences…',
  'Crafting your personalised proposal…',
];

export default function LoadingState() {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1800);

    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);

    return () => {
      clearInterval(stepTimer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <div className="w-full rounded-2xl p-8 flex flex-col items-center gap-6 text-center"
      style={{ background: 'rgba(20,20,28,0.85)', border: '1px solid rgba(201,168,76,0.15)' }}
    >
      {/* Animated rings */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-gold/10 animate-ping" style={{ animationDuration: '2.5s' }} />
        <div className="absolute inset-1 rounded-full border border-gold/15 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="absolute inset-2 rounded-full border border-gold/20 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />

        {/* Core dot */}
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}
        >
          <span className="text-ink text-xs">✦</span>
        </div>
      </div>

      {/* Status text */}
      <div className="space-y-2">
        <p className="font-display text-xl text-gold-light" style={{ color: '#e8c96a' }}>
          AI is planning your event{dots}
        </p>
        <p className="font-body text-sm text-mist/60 transition-all duration-500">
          {STEPS[step]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(201,168,76,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-[1800ms] ease-out"
          style={{
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg, #c9a84c, #e8c96a)',
          }}
        />
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="transition-all duration-500 rounded-full"
            style={{
              width: i === step ? '20px' : '6px',
              height: '6px',
              background: i <= step ? '#c9a84c' : 'rgba(201,168,76,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
