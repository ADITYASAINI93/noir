import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Music,
  Ticket,
  ArrowUpRight,
  Sparkles,
  Info,
  X,
  ShieldAlert,
} from 'lucide-react';
import { NoirEvent } from '../../types/event';
import { fetchPublishedEvents } from '../../services/eventService';

export const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<NoirEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEventModal, setSelectedEventModal] = useState<NoirEvent | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      const data = await fetchPublishedEvents();
      setEvents(data);
    } catch (err) {
      console.error('[UpcomingEvents] Failed to load published events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();

    // Listen for live updates when an admin publishes or edits an event
    const handleEventsUpdated = () => {
      loadEvents();
    };

    window.addEventListener('noir_events_updated', handleEventsUpdated);
    window.addEventListener('storage', handleEventsUpdated);

    // Refresh when tab regains focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadEvents();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('noir_events_updated', handleEventsUpdated);
      window.removeEventListener('storage', handleEventsUpdated);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadEvents]);

  // Date formatting helpers
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { month: 'TBA', day: '--', time: '', weekday: '' };

      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = d.toLocaleDateString('en-US', { day: '2-digit' });
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const time = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return { month, day, time, weekday };
    } catch {
      return { month: 'TBA', day: '--', time: '', weekday: '' };
    }
  };

  const formatEndTime = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return null;
    }
  };

  return (
    <section
      id="events"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 bg-[#050706] border-t border-[#18241E] overflow-hidden selection:bg-[#00F0A0]/30 z-10"
    >
      {/* Background Volumetric Emerald & Teal Nebulas */}
      <div className="parallax-bg absolute top-1/3 -left-32 w-[650px] h-[400px] bg-[#05D38A]/08 rounded-full blur-[180px] pointer-events-none" />
      <div className="parallax-bg absolute bottom-10 right-0 w-[550px] h-[350px] bg-[#00F0A0]/06 rounded-full blur-[170px] pointer-events-none" />

      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 bg-architectural-grid opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-20 gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Editorial Eyebrow with Pulsing Live Indicator */}
            <div className="reveal-on-scroll inline-flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0A0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0A0]" />
              </span>
              <span className="font-display text-[11px] uppercase tracking-[0.35em] text-[#00F0A0] font-semibold">
                Nocturnal Schedule
              </span>
              <span className="w-8 h-[2px] bg-[#05D38A]" />
            </div>

            <h2 className="reveal-on-scroll font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.06em] text-white uppercase leading-[1.08]">
              UPCOMING{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0A0] via-[#05D38A] to-[#10B981]">
                EXPERIENCES.
              </span>
            </h2>

            <p className="reveal-on-scroll font-sans text-sm sm:text-base text-[#9CA3AF] font-light leading-relaxed max-w-2xl">
              Curated electronic showcases, progressive selectors, and acoustic takeovers across Sector 26 and Madhya Marg.
            </p>
          </div>

          {/* Quick Counter & Action */}
          <div className="reveal-on-scroll flex items-center gap-3 self-start md:self-end">
            <span className="px-3.5 py-1.5 rounded-full bg-[#0A0E0C] border border-[#18241E] text-xs font-mono text-[#00F0A0]">
              {events.length} {events.length === 1 ? 'SHOWCASE LIVE' : 'SHOWCASES LIVE'}
            </span>
            <Link
              to="/contact"
              className="interactive-hover-lift px-5 py-2 rounded-full bg-[#101713] hover:bg-[#15221B] border border-[#1E3327] hover:border-[#05D38A]/50 text-white font-display text-xs font-semibold tracking-wider uppercase transition-all"
            >
              VIP Concierge
            </Link>
          </div>
        </div>

        {/* State: Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-[#0A0E0C] border border-[#18241E] p-6 h-[480px] animate-pulse flex flex-col justify-between"
              >
                <div className="h-56 bg-[#121B16] rounded-2xl" />
                <div className="space-y-3 pt-6">
                  <div className="h-4 bg-[#121B16] rounded w-24" />
                  <div className="h-7 bg-[#121B16] rounded w-3/4" />
                  <div className="h-4 bg-[#121B16] rounded w-1/2" />
                </div>
                <div className="h-10 bg-[#121B16] rounded-full mt-4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          /* State: No Published Events Yet (Sleek Luxury Notice) */
          <div className="reveal-on-scroll relative rounded-3xl p-8 sm:p-14 bg-[#0A0E0C]/90 border border-[#18241E] text-center max-w-3xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#101713] border border-[#18241E] mx-auto flex items-center justify-center text-[#00F0A0] mb-6 shadow-[0_0_25px_rgba(0,240,160,0.15)]">
              <Sparkles className="w-6 h-6 text-[#00F0A0]" />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-3">
              NEXT CURATION IN PROGRESS
            </h3>

            <p className="font-sans text-sm sm:text-base text-[#9CA3AF] font-light leading-relaxed max-w-xl mx-auto mb-8">
              Our upcoming calendar of electronic performances and private venue takeovers in Chandigarh is currently being scheduled. Register for guestlist priority or connect with our concierge team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="interactive-hover-lift btn-emerald-primary px-8 py-3.5 rounded-full font-display text-xs font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2"
              >
                <span>JOIN MEMBERSHIP</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="interactive-hover-lift px-8 py-3.5 rounded-full bg-[#101713] border border-[#18241E] hover:border-[#05D38A]/50 text-white font-display text-xs font-semibold uppercase tracking-[0.2em] transition-all"
              >
                CONCIERGE ENQUIRY
              </Link>
            </div>
          </div>
        ) : (
          /* State: Published Events Grid */
          <div className="reveal-stagger-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {events.map((evt) => {
              const dateInfo = formatEventDate(evt.event_date);
              const endTimeStr = formatEndTime(evt.end_time);

              return (
                <article
                  key={evt.id}
                  className="reveal-stagger-item interactive-hover-card group relative rounded-3xl overflow-hidden bg-[#0A0E0C] border border-[#18241E] hover:border-[#00F0A0]/50 transition-all duration-500 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_50px_rgba(0,240,160,0.15)]"
                >
                  {/* Event Poster / Visual */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#050706]">
                    <img
                      src={
                        evt.poster_url?.trim() ||
                        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={evt.title}
                      className="w-full h-full object-cover filter contrast-110 brightness-90 group-hover:scale-106 transition-transform duration-1000 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-[#0A0E0C]/35 to-transparent" />

                    {/* Floating Date Badge (Top-Left) */}
                    <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-[#050706]/90 backdrop-blur-md border border-[#18241E] text-center min-w-[56px] shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
                      <span className="block font-display text-[10px] tracking-widest text-[#00F0A0] font-bold">
                        {dateInfo.month}
                      </span>
                      <span className="block font-display text-xl sm:text-2xl font-black text-white leading-tight">
                        {dateInfo.day}
                      </span>
                      <span className="block font-mono text-[9px] text-[#9CA3AF]">
                        {dateInfo.weekday}
                      </span>
                    </div>

                    {/* Floating Status & Genre (Top-Right) */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050706]/90 border border-[#00F0A0]/40 text-[#00F0A0] text-[10px] font-display font-semibold tracking-wider uppercase backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] animate-pulse" />
                        PUBLISHED
                      </span>
                      {evt.genre && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0A0E0C]/85 border border-[#18241E] text-[#9CA3AF] text-[9px] font-mono uppercase tracking-wider backdrop-blur-md">
                          {evt.genre}
                        </span>
                      )}
                    </div>

                    {/* Cover Charge Ribbon (Bottom-Right over Image) */}
                    {evt.cover_charge && (
                      <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-[#0A0E0C]/90 border border-[#18241E] text-[11px] font-display font-semibold text-white tracking-wide flex items-center gap-1.5 backdrop-blur-md">
                        <Ticket className="w-3.5 h-3.5 text-[#00F0A0]" />
                        <span>{evt.cover_charge}</span>
                      </div>
                    )}
                  </div>

                  {/* Event Details Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      {/* Artist / Curation Eyebrow */}
                      {evt.artist && (
                        <div className="flex items-center gap-2 text-xs font-display tracking-wider text-[#00F0A0] uppercase font-semibold">
                          <Music className="w-3.5 h-3.5" />
                          <span>{evt.artist}</span>
                        </div>
                      )}

                      {/* Event Title */}
                      <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.04em] text-white uppercase group-hover:text-[#00F0A0] transition-colors leading-tight line-clamp-2">
                        {evt.title}
                      </h3>

                      {/* Time & Venue Metadata */}
                      <div className="space-y-1.5 text-xs text-[#9CA3AF] font-sans pt-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#05D38A]" />
                          <span>
                            {dateInfo.time || 'Evening'}
                            {endTimeStr ? ` — ${endTimeStr}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#05D38A]" />
                          <span className="truncate">
                            {evt.venue} • {evt.location || 'Chandigarh'}
                          </span>
                        </div>
                      </div>

                      {/* Event Description (Truncated) */}
                      {evt.description && (
                        <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] font-light leading-relaxed line-clamp-3 pt-1">
                          {evt.description}
                        </p>
                      )}
                    </div>

                    {/* Card Action Buttons */}
                    <div className="pt-4 border-t border-[#18241E] flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedEventModal(evt)}
                        className="text-xs font-display tracking-wider text-[#9CA3AF] hover:text-white uppercase flex items-center gap-1.5 transition-colors focus:outline-none"
                      >
                        <Info className="w-3.5 h-3.5 text-[#00F0A0]" />
                        <span>Show Details</span>
                      </button>

                      <Link
                        to={`/contact?subject=${encodeURIComponent(`Guestlist Enquiry: ${evt.title}`)}`}
                        className="interactive-hover-lift inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#101713] hover:bg-[#00F0A0] border border-[#1E3327] hover:border-[#00F0A0] text-[#00F0A0] hover:text-[#04140B] font-display text-xs font-bold uppercase tracking-wider transition-all duration-300"
                      >
                        <span>Reserve</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* EVENT DETAILS MODAL (High-Fidelity Cinematic Pop-up) */}
      {/* ======================================================== */}
      {selectedEventModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedEventModal(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-[#0A0E0C] border border-[#18241E] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#050706]">
              <img
                src={
                  selectedEventModal.poster_url?.trim() ||
                  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80'
                }
                alt={selectedEventModal.title}
                className="w-full h-full object-cover filter contrast-110 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-black/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#050706]/85 border border-[#18241E] hover:border-[#00F0A0] text-[#9CA3AF] hover:text-white flex items-center justify-center transition-all focus:outline-none"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Badge over banner */}
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-[#050706]/90 border border-[#00F0A0]/40 text-[#00F0A0] text-[10px] font-display font-semibold tracking-wider uppercase mb-2 inline-block">
                  {selectedEventModal.genre || 'Electronic Showcase'}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                  {selectedEventModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#080D0A] border border-[#18241E]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#101713] border border-[#18241E] flex items-center justify-center text-[#00F0A0]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#9CA3AF]">Date & Time</span>
                    <span className="text-white font-display text-xs font-semibold">
                      {formatEventDate(selectedEventModal.event_date).weekday},{' '}
                      {formatEventDate(selectedEventModal.event_date).month}{' '}
                      {formatEventDate(selectedEventModal.event_date).day} @{' '}
                      {formatEventDate(selectedEventModal.event_date).time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#101713] border border-[#18241E] flex items-center justify-center text-[#00F0A0]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#9CA3AF]">Location</span>
                    <span className="text-white font-display text-xs font-semibold truncate block">
                      {selectedEventModal.venue}, {selectedEventModal.location || 'Chandigarh'}
                    </span>
                  </div>
                </div>

                {selectedEventModal.artist && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#101713] border border-[#18241E] flex items-center justify-center text-[#00F0A0]">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-[#9CA3AF]">Headliner / Selector</span>
                      <span className="text-white font-display text-xs font-semibold">
                        {selectedEventModal.artist}
                      </span>
                    </div>
                  </div>
                )}

                {selectedEventModal.cover_charge && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#101713] border border-[#18241E] flex items-center justify-center text-[#00F0A0]">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-[#9CA3AF]">Admission</span>
                      <span className="text-white font-display text-xs font-semibold">
                        {selectedEventModal.cover_charge}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="font-display text-xs uppercase tracking-[0.2em] text-[#00F0A0] font-semibold">
                  About This Showcase
                </h4>
                <p className="text-[#D1D5DB] font-light leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {selectedEventModal.description ||
                    'Join NOIR EVENTS for an extraordinary evening of cutting-edge electronic soundscapes, tuned acoustics, and bespoke luxury hospitality.'}
                </p>
              </div>

              {/* Code of Conduct Policy Warning */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#101713] border border-[#18241E] text-xs text-[#9CA3AF]">
                <ShieldAlert className="w-4 h-4 text-[#00F0A0] flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Strict 21+ Policy:</strong> Government photo ID required at the door. Zero-tolerance policy on unruly behavior. Management reserves right of admission.
                </p>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-5 sm:p-6 bg-[#080D0A] border-t border-[#18241E] flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-6 py-3 rounded-full text-xs font-display uppercase tracking-wider text-[#9CA3AF] hover:text-white transition-colors"
              >
                Close
              </button>

              <Link
                to={`/contact?subject=${encodeURIComponent(`Guestlist RSVP: ${selectedEventModal.title}`)}`}
                onClick={() => setSelectedEventModal(null)}
                className="btn-emerald-primary px-8 py-3 rounded-full font-display text-xs font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2"
              >
                <span>REQUEST GUESTLIST ACCESS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
