'use client';

import { History, Trash2 } from 'lucide-react';
import { EventSearch } from '@/types';
import VenueCard from './VenueCard';

interface HistoryPanelProps {
  searches: EventSearch[];
  onDelete: (id: number) => void;
}

export default function HistoryPanel({ searches, onDelete }: HistoryPanelProps) {
  if (searches.length === 0) return null;

  // Separate latest from history
  const [latest, ...rest] = searches;

  return (
    <div className="w-full space-y-8">
      {/* Latest Proposal */}
      <section>
        <VenueCard search={latest} isLatest onDelete={onDelete} />
      </section>

      {/* History */}
      {rest.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <History size={14} className="text-mist/40" />
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-mist/40">
              Previous Searches
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-xs font-mono text-mist/25">{rest.length}</span>
          </div>

          <div className="space-y-3">
            {rest.map((search) => (
              <VenueCard key={search.id} search={search} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
