import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilmGrain } from '../components/FilmGrain';
import {
  MapPin,
  Instagram,
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { submitContactEnquiry } from '../services/contactService';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSiteSettings();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // anti-spam bot trap

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Contact & Concierge — ${settings.brandName} | ${settings.cityState}`;
  }, [settings.brandName, settings.cityState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Spam bot honeypot detection
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!subject.trim()) {
      setError('Please select or specify a subject for your enquiry.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setError('Please provide a message with at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      await submitContactEnquiry({
        full_name: fullName,
        email,
        subject,
        message,
      });

      setSubmitted(true);
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const sanitizeTelHref = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9+]/g, '');
  };

  return (
    <div className="relative min-h-screen bg-[#050706] text-[#F9FAFB] selection:bg-[#00F0A0]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between">
      <FilmGrain />

      {/* Volumetric Emerald Ambient Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1000px] h-[500px] bg-gradient-radial from-[#05D38A]/10 via-[#064E3B]/05 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#00F0A0]/06 rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 bg-architectural-grid opacity-50 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 pt-32 sm:pt-36 pb-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Header Banner */}
          <div className="text-center space-y-3 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101713] border border-[#1E3327] text-xs font-display uppercase tracking-[0.25em] text-[#00F0A0]">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0A0]" />
              <span className="font-semibold">Direct Concierge &amp; Inquiries</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight uppercase leading-[1.08]">
              CONNECT WITH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0A0] via-[#05D38A] to-[#10B981]">
                {settings.brandName}
              </span>
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
              For table bookings, artist submissions, private celebration buyouts, or press enquiries in Chandigarh, connect with our curation stewards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Contact Info & Admission Policy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-7 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-6 shadow-2xl backdrop-blur-xl">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#00F0A0] block mb-1">
                    Direct Contact Hub
                  </span>
                  <h3 className="font-display text-2xl text-white font-bold uppercase">
                    {settings.cityState}
                  </h3>
                </div>

                <div className="space-y-4 text-xs font-sans text-[#9CA3AF]">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center shrink-0 text-[#00F0A0]">
                      <MapPin className="w-4 h-4 text-[#00F0A0]" />
                    </div>
                    <div>
                      <strong className="text-white block font-display uppercase tracking-wider text-[11px]">
                        Locations &amp; Venues
                      </strong>
                      <span className="leading-relaxed">{settings.operatingRegion}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center shrink-0 text-[#00F0A0]">
                      <Mail className="w-4 h-4 text-[#00F0A0]" />
                    </div>
                    <div>
                      <strong className="text-white block font-display uppercase tracking-wider text-[11px]">
                        Email Concierge
                      </strong>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="text-[#00F0A0] hover:underline font-medium transition-colors"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center shrink-0 text-[#00F0A0]">
                      <Phone className="w-4 h-4 text-[#00F0A0]" />
                    </div>
                    <div>
                      <strong className="text-white block font-display uppercase tracking-wider text-[11px]">
                        Telephone &amp; WhatsApp
                      </strong>
                      <a
                        href={`tel:${sanitizeTelHref(settings.contactPhone)}`}
                        className="text-[#00F0A0] hover:underline font-medium transition-colors"
                      >
                        {settings.contactPhone}
                      </a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center shrink-0 text-[#00F0A0]">
                      <Instagram className="w-4 h-4 text-[#00F0A0]" />
                    </div>
                    <div>
                      <strong className="text-white block font-display uppercase tracking-wider text-[11px]">
                        Official Instagram
                      </strong>
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9CA3AF] hover:text-white underline transition-colors"
                      >
                        {settings.instagramHandle}
                      </a>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center shrink-0 text-[#00F0A0]">
                      <Clock className="w-4 h-4 text-[#00F0A0]" />
                    </div>
                    <div>
                      <strong className="text-white block font-display uppercase tracking-wider text-[11px]">
                        Concierge Operating Hours
                      </strong>
                      <span>{settings.operatingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admission Notice Badge */}
              <div className="p-6 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] text-xs font-sans text-[#9CA3AF] space-y-2.5 backdrop-blur-xl">
                <p className="text-white font-display font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00F0A0]" />
                  <span>Admission Notice &amp; Code of Conduct</span>
                </p>
                <p className="text-[11px] leading-relaxed font-light text-[#9CA3AF]">
                  {settings.admissionPolicy}
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-7 sm:p-10 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] shadow-2xl relative backdrop-blur-xl">
                
                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-[#101713] border border-[#00F0A0]/40 flex items-center justify-center text-[#00F0A0] mx-auto shadow-[0_0_30px_rgba(0,240,160,0.2)]">
                      <CheckCircle2 className="w-8 h-8 text-[#00F0A0]" />
                    </div>
                    <h3 className="font-display text-3xl text-white uppercase font-bold">
                      Message Transmitted
                    </h3>
                    <p className="font-sans text-xs text-[#9CA3AF] max-w-sm mx-auto leading-relaxed font-light">
                      Thank you for reaching out. Our Chandigarh hospitality stewards have received your inquiry and will respond within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-7 py-3 rounded-full border border-[#1E3327] hover:border-[#00F0A0] bg-[#101713] text-[#F9FAFB] text-xs font-display uppercase tracking-wider transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                    <div className="pb-3 border-b border-[#18241E] mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#00F0A0] block">
                        Direct Steward Dispatch
                      </span>
                      <h3 className="font-display text-2xl text-white font-bold uppercase mt-0.5">
                        Send An Enquiry
                      </h3>
                    </div>

                    {error && (
                      <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Hidden Honeypot for spam bots */}
                    <div className="hidden">
                      <input
                        type="text"
                        tabIndex={-1}
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block uppercase tracking-[0.2em] text-[#9CA3AF] font-display text-[10px] mb-1.5 font-semibold">
                        Your Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={loading}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Kabir Singh"
                        className="w-full px-4 py-3 rounded-xl bg-[#080D0A] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs placeholder-[#9CA3AF]/40 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block uppercase tracking-[0.2em] text-[#9CA3AF] font-display text-[10px] mb-1.5 font-semibold">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        disabled={loading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#080D0A] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs placeholder-[#9CA3AF]/40 transition-all"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block uppercase tracking-[0.2em] text-[#9CA3AF] font-display text-[10px] mb-1.5 font-semibold">
                        Enquiry Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        required
                        disabled={loading}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#080D0A] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                      >
                        <option value="">Select an enquiry type...</option>
                        <option value="VIP Table & Bottle Service">VIP Table &amp; Bottle Service</option>
                        <option value="Upcoming Showcase Questions">Upcoming Showcase Questions</option>
                        <option value="Artist / DJ Booking Submission">Artist / DJ Booking Submission</option>
                        <option value="Private Celebration / Buyout">Private Celebration / Buyout</option>
                        <option value="Press & Media Enquiry">Press &amp; Media Enquiry</option>
                        <option value="Other">Other Concierge Request</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block uppercase tracking-[0.2em] text-[#9CA3AF] font-display text-[10px] mb-1.5 font-semibold">
                        Message Details <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        disabled={loading}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please detail your desired date, group size, or special requirements..."
                        className="w-full px-4 py-3 rounded-xl bg-[#080D0A] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs placeholder-[#9CA3AF]/40 resize-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-3 py-4 rounded-xl btn-emerald-primary font-display text-xs uppercase tracking-[0.22em] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#04140B]" />
                          <span>Delivering Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#04140B]" />
                          <span>Transmit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
