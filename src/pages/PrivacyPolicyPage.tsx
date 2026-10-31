import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilmGrain } from '../components/FilmGrain';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy — OBSIDIAN';
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#F2F0EB] selection:bg-[#C6CDD5]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between">
      <FilmGrain />
      <Navbar />

      {/* Volumetric ambient lights */}
      <div className="pointer-events-none fixed top-1/4 right-0 w-[500px] h-[500px] bg-[#7B8999]/10 blur-[150px] rounded-full -z-10" />
      <div className="pointer-events-none fixed bottom-1/4 left-0 w-[500px] h-[500px] bg-[#C6CDD5]/10 blur-[160px] rounded-full -z-10" />

      <main className="relative z-10 flex-1 pt-32 pb-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-3 pb-8 border-b border-[#343A43]">
            <span className="text-xs font-display uppercase tracking-[0.25em] text-[#C6CDD5] font-semibold">
              Transparency &amp; Governance
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F2F0EB] tracking-tight uppercase">
              PRIVACY POLICY
            </h1>
            <p className="font-sans text-xs text-[#7B8999]">
              Effective Date: October 2026 • OBSIDIAN, Chandigarh, India
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-10 font-sans text-xs sm:text-sm text-[#7B8999] leading-relaxed">
            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                1. Overview &amp; Commitment
              </h2>
              <p>
                OBSIDIAN operates as a curated nightlife, showcase, and electronic music discovery platform serving Chandigarh, India. We respect your personal privacy and treat your account details with high technical and operational discretion.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                2. Information We Collect
              </h2>
              <p>When you register for an account, we collect only the necessary credentials required to identify and verify your profile:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#F2F0EB]">
                <li><strong className="text-[#C6CDD5]">Full Legal or Preferred Name:</strong> To address you and verify guest admission against official identification.</li>
                <li><strong className="text-[#C6CDD5]">Email Address:</strong> Used for secure sign-in, password recovery, and essential service alerts.</li>
                <li><strong className="text-[#C6CDD5]">Contact Telephone (Optional):</strong> For reservation coordination and VIP arrival assistance.</li>
                <li><strong className="text-[#C6CDD5]">Instagram Handle (Optional):</strong> To facilitate community networking and host verification.</li>
                <li><strong className="text-[#F2F0EB]">Gender Identity (Optional):</strong> Used solely for hospitality and seating preferences.</li>
              </ul>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                3. Technical Storage &amp; Encryption
              </h2>
              <p>
                All account records are stored utilizing encrypted Supabase PostgreSQL infrastructure with TLS 1.3 in transit and AES-256 at rest. Access control is enforced at the database layer via PostgreSQL Row Level Security (RLS) policies, preventing unauthorized cross-user data exposure.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                4. Account Management &amp; Data Deletion
              </h2>
              <p>
                You retain complete autonomy over your personal information. You may update your profile details at any time through the <Link to="/account" className="text-[#C6CDD5] hover:text-[#FFFFFF] transition-colors underline font-medium">Account Page</Link>.
              </p>
              <p>
                If you wish to permanently delete your account, you can submit a request through our <Link to="/contact" className="text-[#C6CDD5] hover:text-[#FFFFFF] transition-colors underline font-medium">Contact Page</Link> or utilize the administrative account removal workflow. Upon deletion, your authentication record is permanently purged via the Supabase Auth Admin API.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                5. Third-Party Venues
              </h2>
              <p>
                OBSIDIAN showcases take place at independent licensed venues in Chandigarh (e.g. Sector 26 and Madhya Marg). While we facilitate discovery and table enquiries, physical entry remains subject to each host venue's door security and identification policies.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-[#17191E] border border-[#343A43]">
              <h2 className="font-display text-xl text-[#F2F0EB] font-bold uppercase tracking-wider">
                6. Contact the Data Controller
              </h2>
              <p>
                For privacy inquiries or compliance requests, reach our team directly at <Link to="/contact" className="text-[#C6CDD5] hover:text-[#FFFFFF] transition-colors underline font-medium">our contact portal</Link> or via Instagram <a href="https://www.instagram.com/noir.chd/" target="_blank" rel="noopener noreferrer" className="text-[#C6CDD5] hover:underline font-medium">@noir.chd</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
