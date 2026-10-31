import React, { useState } from 'react';
import {
  ArrowUpRight,
  Disc3,
  MapPin,
  ShieldCheck,
  Compass,
  Crown,
  Sparkles,
  Layers,
  Activity,
  Sliders,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

interface HeroCinematicProps {
  onDiscoverClick: () => void;
  onExploreClick: () => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({
  onDiscoverClick,
  onExploreClick,
}) => {
  const { settings } = useSiteSettings();
  const [expandedNode, setExpandedNode] = useState<number | null>(0);

  // 6 Curated Category Highlights (Matching bottom bar of reference image)
  const categoryHighlights = [
    {
      title: 'Melodic Techno',
      subtitle: 'Acoustic Fidelity',
      icon: Disc3,
      tag: 'SOUND',
    },
    {
      title: 'Sector 26 Hub',
      subtitle: 'Premier Club District',
      icon: MapPin,
      tag: 'DISTRICT',
    },
    {
      title: 'Curated Lounges',
      subtitle: 'Atmospheric Cocktails',
      icon: Layers,
      tag: 'SPACES',
    },
    {
      title: 'Madhya Marg',
      subtitle: 'Subterranean Stages',
      icon: Compass,
      tag: 'CORRIDOR',
    },
    {
      title: 'VIP Hospitality',
      subtitle: 'Dedicated Concierge',
      icon: Crown,
      tag: 'SERVICE',
    },
    {
      title: 'Strict 21+ Code',
      subtitle: 'Zero-Tolerance Policy',
      icon: ShieldCheck,
      tag: 'SAFETY',
    },
  ];

  // 4 Schematic Architecture Nodes (Interactive brand principles)
  const schematicNodes = [
    {
      id: 0,
      title: 'Sonic Engineering',
      desc: 'Melodic techno, progressive rhythms & tuned sound rigs',
      metric: '4-Point Acoustic Tuning',
      category: 'AUDIO SYSTEM',
      principle: 'High-fidelity acoustic engineering designed for deep harmonic resonance and melodic electronic soundscapes.',
      keyPillars: [
        '4-point acoustic array calibration',
        'Curated melodic techno & progressive rhythms',
        'Decibel clarity with zero harsh distortion',
      ],
    },
    {
      id: 1,
      title: 'Curated Spaces',
      desc: 'Architectural venues across Sector 26 & Madhya Marg',
      metric: 'Chandigarh Hubs',
      category: 'VENUE NETWORK',
      principle: 'Atmospheric architectural sanctuaries across Sector 26 and Madhya Marg designed for nocturnal immersion.',
      keyPillars: [
        'Industrial-minimalist dark aesthetics',
        'Intimate alcoves & subterranean dance floors',
        'Custom emerald volumetric illumination',
      ],
    },
    {
      id: 2,
      title: 'Strict 21+ Protocol',
      desc: 'Government photo verification & zero-tolerance conduct',
      metric: 'Verified Crowd',
      category: 'ATMOSPHERE CODE',
      principle: 'An unbending commitment to safety, discretion, and mature guest energy across all partner venues.',
      keyPillars: [
        'Mandatory 100% government ID verification',
        'Zero-tolerance guest code of conduct',
        'Discreet professional security stewards',
      ],
    },
    {
      id: 3,
      title: 'Bespoke Hospitality',
      desc: 'Direct concierge table booking & celebration buyouts',
      metric: 'Table Concierge',
      category: 'RESERVATIONS',
      principle: 'Dedicated direct concierge service ensuring frictionless reservations and elevated personal guest care.',
      keyPillars: [
        'Direct table concierge booking routing',
        'Seamless arrival escort & VIP table protocol',
        'Private celebration buyout coordination',
      ],
    },
  ];

  const handleToggleNode = (nodeId: number) => {
    setExpandedNode((prev) => (prev === nodeId ? null : nodeId));
  };

  return (
    <section className="relative w-full pt-28 sm:pt-32 pb-16 sm:pb-24 px-3 sm:px-6 lg:px-8 overflow-hidden bg-[#050706]">
      {/* Ambient Emerald Aurora Background Lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[550px] bg-gradient-radial from-[#05D38A]/12 via-[#064E3B]/05 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#00F0A0]/08 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/6 w-[400px] h-[400px] bg-[#064E3B]/15 rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle Full-Width Architectural Grid Line */}
      <div className="absolute inset-0 bg-architectural-grid opacity-70 pointer-events-none" />

      {/* ======================================================== */}
      {/* LARGE ROUNDED DARK HERO PANEL (Matching Reference Image) */}
      {/* ======================================================== */}
      <div className="relative max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] bg-[#0A0E0C]/90 border border-[#18241E] hero-panel-frame overflow-hidden p-6 sm:p-10 lg:p-12 z-10 backdrop-blur-2xl">
        
        {/* Subtle Panel Background Grid & Glow */}
        <div className="absolute inset-0 bg-architectural-grid-fine opacity-50 pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-[500px] h-[300px] bg-gradient-to-b from-[#00F0A0]/10 via-[#05D38A]/05 to-transparent blur-[120px] pointer-events-none" />

        {/* Panel Top Eyebrow Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-8 sm:pb-12 border-b border-[#18241E]/80">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#101713] border border-[#1E3327] text-xs font-display">
            <span className="w-2 h-2 rounded-full bg-[#00F0A0] shadow-[0_0_8px_#00F0A0] animate-pulse" />
            <span className="text-[#9CA3AF] uppercase tracking-[0.22em] text-[10px] font-semibold">
              {settings.cityState.toUpperCase()}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[11px] font-display uppercase tracking-[0.24em] text-[#9CA3AF]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#00F0A0]">●</span> 21+ VERIFIED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#05D38A]">●</span> SECTOR 26 &amp; MADHYA MARG
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN HERO CONTENT SPLIT GRID (Typography vs Schematic)   */}
        {/* ======================================================== */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-8 sm:py-12">
          
          {/* Left Column: Bold Headline, Subtitle, and Two Primary CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-[0.28em] text-[#00F0A0] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#00F0A0]" />
                <span>The Art of Nightlife</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.04]">
                CHANDIGARH, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0A0] via-[#05D38A] to-[#10B981]">
                  AFTER DARK.
                </span>
              </h1>

              <p className="font-sans text-base sm:text-xl text-[#9CA3AF] font-light max-w-xl leading-relaxed">
                Discover the culture, energy and experiences that define Chandigarh nightlife.
              </p>
            </div>

            {/* Clear Calls to Action (Matching Reference Layout) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onDiscoverClick}
                className="interactive-hover-lift btn-emerald-primary px-7 sm:px-9 py-4 rounded-full font-display text-xs sm:text-sm font-bold uppercase tracking-[0.22em] flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>DISCOVER NOIR</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="interactive-hover-lift px-7 sm:px-8 py-4 rounded-full bg-[#101713]/90 hover:bg-[#15221B] border border-[#1E3327] hover:border-[#05D38A]/50 text-[#F9FAFB] font-display text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-[0.98]"
              >
                EXPLORE
              </button>
            </div>
          </div>

          {/* Right Column: Abstract Schematic Architecture (Restrained SaaS Graphic) */}
          <div className="lg:col-span-6 xl:col-span-5 relative">
            <div className="relative rounded-2xl bg-[#080D0A]/90 border border-[#1B2E24] p-5 sm:p-7 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              
              {/* Header Label inside Diagram */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#18241E] text-xs font-display">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#00F0A0] font-semibold flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#00F0A0]" />
                  Curated Architecture
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-mono">
                  Framework v2.4
                </span>
              </div>

              {/* Schematic Node Stack with Interactive Accessible Expansion */}
              <div className="space-y-3" role="region" aria-label="Curated Architecture Principles">
                {schematicNodes.map((node) => {
                  const isExpanded = expandedNode === node.id;
                  return (
                    <div
                      key={node.id}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-controls={`arch-node-${node.id}`}
                      onClick={() => handleToggleNode(node.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleToggleNode(node.id);
                        } else if (e.key === 'Escape' && isExpanded) {
                          e.preventDefault();
                          setExpandedNode(null);
                        }
                      }}
                      className={`relative rounded-xl p-3.5 sm:p-4 border transition-all duration-300 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0A0] ${
                        isExpanded
                          ? 'bg-[#101914] border-[#00F0A0] shadow-[0_0_24px_rgba(0,240,160,0.18)]'
                          : 'bg-[#0B110E] border-[#18241E] hover:border-[#05D38A]/50 hover:bg-[#0D1510]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#00F0A0] font-semibold">
                          {node.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#050706] px-2 py-0.5 rounded border border-[#18241E]">
                            {node.metric}
                          </span>
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[#00F0A0] transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 bg-[#00F0A0]/20' : 'bg-[#18241E]/80 text-[#9CA3AF]'
                            }`}
                            aria-hidden="true"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <h4 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                        {node.title}
                      </h4>
                      <p className="text-xs text-[#9CA3AF] font-light mt-1">
                        {node.desc}
                      </p>

                      {/* Expandable Architectural Details */}
                      {isExpanded && (
                        <div
                          id={`arch-node-${node.id}`}
                          className="mt-3.5 pt-3 border-t border-[#1E3327] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                          <p className="text-xs text-[#D1D5DB] leading-relaxed font-sans">
                            {node.principle}
                          </p>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[9px] uppercase tracking-[0.22em] text-[#00F0A0] font-mono block">
                              Core Standards:
                            </span>
                            {node.keyPillars.map((pillar, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2 text-[11px] text-[#9CA3AF]">
                                <Check className="w-3.5 h-3.5 text-[#00F0A0] shrink-0 mt-0.5" />
                                <span>{pillar}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedNode(null);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <X className="w-3 h-3 text-[#00F0A0]" />
                              <span>Collapse Principle</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Diagram Footer Status */}
              <div className="pt-4 mt-4 border-t border-[#18241E] flex items-center justify-between text-[11px] text-[#9CA3AF]">
                <span className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-wider">
                  <Sliders className="w-3 h-3 text-[#05D38A]" />
                  Acoustic Standards Active
                </span>
                <span className="text-[10px] font-mono text-[#00F0A0]">
                  100% Curated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM ROW: 6 CATEGORY CARDS (Matching Reference Layout) */}
        {/* ======================================================== */}
        <div className="relative z-10 pt-8 sm:pt-10 border-t border-[#18241E]/80">
          <div className="reveal-stagger-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categoryHighlights.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="reveal-stagger-item interactive-hover-lift group relative rounded-xl p-3.5 sm:p-4 bg-[#080D0A] border border-[#18241E] hover:border-[#05D38A]/50 hover:bg-[#0D1510] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#9CA3AF] group-hover:text-[#00F0A0] transition-colors">
                      {item.tag}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-[#101713] border border-[#18241E] flex items-center justify-center text-[#05D38A] group-hover:scale-110 group-hover:border-[#00F0A0]/40 transition-all">
                      <IconComp className="w-3.5 h-3.5 text-[#00F0A0]" />
                    </div>
                  </div>

                  <div>
                    <h5 className="font-display text-xs sm:text-sm font-bold text-white group-hover:text-[#00F0A0] transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-[#9CA3AF] font-light mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
