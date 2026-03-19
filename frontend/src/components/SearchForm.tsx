'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic } from 'lucide-react';

interface SearchFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const PLACEHOLDER_PROMPTS = [
  'A 10-person leadership retreat in the mountains for 3 days with a $4k budget…',
  'A 50-person sales kickoff in Miami for 2 days, budget $25,000…',
  'Intimate 8-person board strategy session in Napa Valley for 1 day…',
  'Team-building offsite for 30 engineers, prefer a lakeside setting, 4 days…',
];

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter effect for placeholder cycling
  useEffect(() => {
    const target = PLACEHOLDER_PROMPTS[placeholderIdx];
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      setDisplayedPlaceholder(target.slice(0, i));
      if (i < target.length) {
        i++;
        timeout = setTimeout(type, 28);
      } else {
        // Pause then switch
        timeout = setTimeout(() => {
          setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
        }, 3500);
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, [placeholderIdx]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const charCount = query.length;
  const charLimit = 1000;
  const isOverLimit = charCount > charLimit;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative rounded-2xl transition-all duration-300 ${
          isLoading
            ? 'ring-1 ring-gold/40 shadow-[0_0_40px_rgba(201,168,76,0.12)]'
            : 'ring-1 ring-white/8 hover:ring-gold/30 focus-within:ring-gold/40 focus-within:shadow-[0_0_40px_rgba(201,168,76,0.1)]'
        }`}
        style={{ background: 'rgba(20,20,28,0.9)', backdropFilter: 'blur(20px)' }}
      >
        {/* Top label */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-2 border-b border-white/5">
          <Sparkles size={13} className="text-gold/70" />
          <span className="text-xs font-body font-medium tracking-widest uppercase text-mist/60">
            Describe your event
          </span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={displayedPlaceholder}
          disabled={isLoading}
          rows={3}
          maxLength={charLimit}
          className="w-full bg-transparent text-cream/90 placeholder:text-mist/30 font-body text-[15px] leading-relaxed px-5 py-4 focus:outline-none disabled:opacity-50 min-h-[100px] max-h-[260px]"
          style={{ resize: 'none' }}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-5 pb-4 pt-1">
          <span
            className={`font-mono text-xs transition-colors ${
              isOverLimit ? 'text-red-400' : charCount > charLimit * 0.8 ? 'text-gold/60' : 'text-mist/30'
            }`}
          >
            {charCount}/{charLimit}
          </span>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-[11px] text-mist/25 font-body">
              ⌘↵ to send
            </span>
            <button
              type="submit"
              disabled={!query.trim() || isLoading || isOverLimit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: query.trim() && !isLoading && !isOverLimit
                  ? 'linear-gradient(135deg, #c9a84c, #a07830)'
                  : 'rgba(201,168,76,0.1)',
                color: query.trim() && !isLoading ? '#0a0a0f' : '#8a8a9a',
              }}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-ink/40 border-t-ink animate-spin" />
                  Planning…
                </>
              ) : (
                <>
                  <Send size={13} />
                  Find Venue
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tip */}
      <p className="mt-3 text-center text-xs text-mist/35 font-body">
        Include headcount, duration, location preference, and budget for the best results
      </p>
    </form>
  );
}
