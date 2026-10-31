import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilmGrain } from '../components/FilmGrain';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms & Conditions — OBSIDIAN';
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#F2F0EB] selection:bg-[#C6CDD5]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between">
      <FilmGrain />
      <Navbar />

      {/* Ambient background lights */}
      <div className="pointer-events-none fixed top-1/4 right-0 w-[500px] h-[500px] bg-[#7B8999]/10 blur-[150px] rounded-full -z-10" />
      <div className="pointer-events-none fixed bottom-1/4 left-0 w-[500px] h-[500px] bg-[#C6CDD5]/10 blur-[160px] rounded-full -z-10" />

      <main className="relative z-10 flex-1 pt-32 pb-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-3 pb-8 border-b border-[#343A43]">
            <span className="text-xs font-display uppercase tracking-[0.25em] text-[#C6CDD5] font-semibold">
              Terms of Service
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F2F0EB] tracking-tight uppercase">
              TERMS &amp; CONDITIONS
            </h1>
            <p className="font-sans text-xs text-[#7B8999]">
              Effective Date: October 2026 • OBSIDIAN, Chandigarh, India
            </p>
          </div>

          {/* Core Terms */}
          <div className="space-y-10 font-sans text-xs sm:text-sm text-[#7B8999] leading-relaxed">
            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing OBSIDIAN (the "Platform"), registering an account, or interacting with our event discovery services, you agree to be bound by these Terms and Conditions. If you do not agree with any provision, please discontinue use of the platform.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                2. Age Restriction &amp; Admission Policy (21+)
              </h2>
              <div className="p-4 rounded-xl bg-[#08090B] border border-[#7B8999]/40 text-[#F2F0EB] text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#C6CDD5] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#C6CDD5]">Strict Age Requirement:</strong> All nightlife venues and evening club showcases listed on OBSIDIAN operate strictly on a 21+ admission policy under local Chandigarh hospitality regulations. Physical Government Photo ID (Aadhaar, Passport, Driver's License) is required at venue doors.
                </span>
              </div>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                3. Zero-Tolerance Drug Policy
              </h2>
              <p>
                OBSIDIAN strictly supports a Zero-Tolerance Drug Policy across all partner venues, sound stages, and curated gatherings. Any individual found in possession or under the influence of illicit substances will be immediately denied entry, escorted off premises, and referred to local authorities without refund.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                4. Event Listings &amp; Third-Party Venues
              </h2>
              <p>
                OBSIDIAN publishes accurate schedule details, lineups, and cover charge information based on verified submissions from artists and partner venues. While we maintain rigorous curation standards, physical venue management reserves all standard rights of admission, dress code enforcement, and security screening.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                5. User Accounts &amp; Conduct
              </h2>
              <p>
                Users agree to provide accurate information when registering an account. Misrepresentation, impersonation, or creating accounts for fraudulent inquiries is strictly prohibited. We reserve the right to suspend or remove any account that violates platform guidelines.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                6. Contact &amp; Governance
              </h2>
              <p>
                These terms are governed by the laws of India and the jurisdiction of Chandigarh. For questions or commercial inquiries, contact our management team via the <Link to="/contact" className="text-[#C6CDD5] hover:text-[#FFFFFF] transition-colors underline font-medium">Contact Page</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
