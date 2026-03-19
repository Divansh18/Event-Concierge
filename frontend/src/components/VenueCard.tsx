'use client';

import { useState } from 'react';
import { MapPin, DollarSign, Sparkles, CheckCircle2, ChevronDown, Trash2, Clock } from 'lucide-react';
import { EventSearch } from '@/types';
import { format } from 'date-fns';

interface VenueCardProps {
  search: EventSearch;
  isLatest?: boolean;
  onDelete?: (id: number) => void;
}

export default function VenueCard({ search, isLatest = false, onDelete }: VenueCardProps) {
  const [expanded, setExpanded] = useState(isLatest);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    onDelete(search.id);
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
        isLatest
          ? 'ring-1 ring-gold/40 shadow-[0_0_60px_rgba(201,168,76,0.08)]'
          : 'ring-1 ring-white/6 hover:ring-white/12'
      } ${deleting ? 'opacity-40 scale-98 pointer-events-none' : ''}`}
      style={{ background: isLatest ? 'rgba(22,20,14,0.95)' : 'rgba(18,18,26,0.9)' }}
    >
      {/* Gold accent bar for latest */}
      {isLatest && (
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
        />
      )}

      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Latest badge */}
            {isLatest && (
              <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full text-[10px] font-body font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <Sparkles size={9} />
                Latest Proposal
              </div>
            )}

            {/* Venue name */}
            <h3 className="font-display text-xl font-semibold leading-tight"
              style={{ color: isLatest ? '#e8c96a' : '#faf7f2' }}
            >
              {search.venueName}
            </h3>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-xs font-body text-mist/60">
                <MapPin size={11} className="text-gold/50 flex-shrink-0" />
                {search.location}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-body font-semibold"
                style={{ color: '#c9a84c' }}
              >
                <DollarSign size={11} />
                {search.estimatedCost}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-body text-mist/40">
                <Clock size={10} />
                {format(new Date(search.createdAt), 'MMM d, h:mm a')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 text-mist/40 hover:text-red-400"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5 text-mist/50 hover:text-cream/70"
            >
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* User query */}
        <div className="mt-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs font-body text-mist/50 leading-relaxed line-clamp-2">
            <span className="text-mist/30 mr-1.5">Query:</span>
            {search.userQuery}
          </p>
        </div>
      </div>

      {/* Expandable body */}
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: expanded ? '600px' : '0' }}
      >
        <div className="px-6 pb-6 space-y-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '20px' }}
        >
          {/* Why it fits */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-3 rounded-full" style={{ background: '#c9a84c' }} />
              <span className="text-xs font-body font-semibold tracking-wider uppercase text-mist/50">
                Why It Fits
              </span>
            </div>
            <p className="font-body text-sm text-cream/75 leading-relaxed pl-3">
              {search.whyItFits}
            </p>
          </div>

          {/* Amenities */}
          {search.amenities && search.amenities.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3 rounded-full" style={{ background: '#c9a84c' }} />
                <span className="text-xs font-body font-semibold tracking-wider uppercase text-mist/50">
                  Key Amenities
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3">
                {search.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}
                  >
                    <CheckCircle2 size={12} className="flex-shrink-0" style={{ color: '#c9a84c' }} />
                    <span className="text-xs font-body text-cream/65">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
