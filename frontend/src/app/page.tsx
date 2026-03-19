'use client';

import { useState, useEffect, useCallback } from 'react';
import { createEventSearch, fetchAllSearches, deleteSearch } from '@/lib/api';
import { EventSearch } from '@/types';
import SearchForm from '@/components/SearchForm';
import LoadingState from '@/components/LoadingState';
import HistoryPanel from '@/components/HistoryPanel';
import ErrorToast from '@/components/ErrorToast';

export default function HomePage() {
  const [searches, setSearches] = useState<EventSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllSearches();
        setSearches(data);
      } catch {
        // Silently fail — history is non-critical
      } finally {
        setIsFetching(false);
      }
    })();
  }, []);

  const handleSubmit = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createEventSearch(query);
      setSearches((prev) => [result, ...prev]);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteSearch(id);
      setSearches((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError('Could not delete this record. Please try again.');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #c9a84c, transparent 70%)' }}
        />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #c9a84c, transparent 70%)' }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)' }}
          >
            <span className="text-ink text-sm font-bold">✦</span>
          </div>
          <div>
            <span className="font-display text-lg font-semibold tracking-wide text-cream/90">
              Concierge
            </span>
            <span className="hidden sm:inline font-body text-xs text-mist/40 ml-2">
              AI Corporate Event Planner
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isFetching && searches.length > 0 && (
            <span className="font-mono text-xs text-mist/30 hidden sm:block">
              {searches.length} search{searches.length !== 1 ? 'es' : ''} saved
            </span>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
            <span className="text-[10px] font-body font-medium tracking-widest uppercase" style={{ color: '#c9a84c' }}>
              AI Live
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-2xl mx-auto w-full px-4 md:px-6 py-10 flex flex-col gap-8">

        {/* Hero text */}
        <div className="text-center space-y-3 animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-light leading-tight">
            Plan your perfect{' '}
            <span className="font-semibold italic"
              style={{
                background: 'linear-gradient(135deg, #e8c96a 0%, #c9a84c 50%, #a07830 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              corporate offsite
            </span>
          </h1>
          <p className="font-body text-sm text-mist/50 max-w-sm mx-auto leading-relaxed">
            Describe your event in plain language. Our AI concierge finds the ideal venue and builds a complete proposal — instantly.
          </p>
        </div>

        {/* Search form */}
        <div className="animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <SearchForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Content area */}
        <div className="animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
          {isLoading ? (
            <LoadingState />
          ) : isFetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-5 h-5 rounded-full border-2 border-gold/20 border-t-gold/60 animate-spin" />
            </div>
        ) : searches.length > 0 ? (
          <HistoryPanel searches={searches} onDelete={handleDelete} />
        ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="font-body text-xs text-mist/25">
          Built with NestJS · Next.js · MySQL · OpenAI GPT-4o mini
        </p>
      </footer>

      {/* Error toast */}
      {error && (
        <ErrorToast message={error} onDismiss={() => setError(null)} />
      )}
    </div>
  );
}
