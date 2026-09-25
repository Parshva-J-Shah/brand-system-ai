import React from 'react';
import { ProjectData } from '../types/project';

interface VisualDirectionPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
}

export const VisualDirectionPage: React.FC<VisualDirectionPageProps> = ({
  project,
  onNavigate,
}) => {
  const visual = project.visual || {
    typography: {
      headline: 'Plus Jakarta Sans',
      body: 'Plus Jakarta Sans',
      label: 'Space Grotesk',
      rationale:
        'Geometric clarity with humanist warmth allows technical precision without feeling sterile or academic.',
    },
    color_mood: [
      {
        role: 'Primary Energy',
        name: 'Electric Indigo',
        hex: '#8083ff',
        desc: 'Hero actions, focus indicators, and brand vitality.',
      },
      {
        role: 'Secondary Clarity',
        name: 'Sky Blue',
        hex: '#0566d9',
        desc: 'Interactive links, navigational anchors, and information density.',
      },
      {
        role: 'Tertiary Momentum',
        name: 'Verified Mint',
        hex: '#4edea3',
        desc: 'Success states, verified badges, and positive momentum markers.',
      },
      {
        role: 'Substrate Canvas',
        name: 'Obsidian Night',
        hex: '#131317',
        desc: 'Deep ambient background for immersive focus and reduced eye strain.',
      },
      {
        role: 'Structural Border',
        name: 'Slate Boundary',
        hex: '#2a292e',
        desc: 'Hairline grid demarcation and card container separation.',
      },
    ],
    composition:
      'Clean modular Bento grid with hairline borders (rgba 255,255,255,0.08), high-density metadata chips, and generous typography breathing space.',
    symbols: [
      'Interlocking Crew Nodes (collaboration network)',
      'Verified Spark Pip (authentic compatibility)',
      'Sprint Bracket (focused milestones)',
    ],
    image_style:
      'High-contrast candid photography of student creators in maker spaces, hackathon venues, and late-night campus labs under natural warm lighting.',
    concepts_to_avoid: [
      'Stiff corporate handshakes in glass boardrooms',
      'Cheesy graduation cap stock photos',
      'Neon cyberpunk or cartoonish gamified badges',
    ],
  };

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full pb-16">
        {/* Ambient Glows */}
        <div className="relative py-8 sm:py-12 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-8 right-12 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="font-label text-xs uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-surface-container-high border border-white/5 font-semibold">
                  Creative Direction Studio
                </span>
                <span className="text-outline font-label text-xs">Stage 06 // Sprint Artifact</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl text-on-surface tracking-tight font-bold">
                Visual direction
              </h1>
              <p className="font-body text-base text-on-surface-variant font-light">
                How the brand should look and feel.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-label text-xs text-outline uppercase tracking-wider">
                  Aesthetic Cohesion
                </span>
                <span className="font-headline text-xl text-tertiary font-bold">98.4% Match</span>
              </div>

              <button
                onClick={() => onNavigate(7)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-headline text-sm font-semibold shadow-lg hover:bg-primary hover:text-on-primary transition-all duration-300"
                type="button"
              >
                <span>Challenge Brand in Critic</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* 01 COLOR PALETTE */}
        <section className="mt-6 mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-label text-xs text-outline font-bold">01</span>
              <h2 className="font-headline text-2xl text-on-surface font-semibold">Color Palette</h2>
            </div>
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
              Harmonic Tonal Spectrum
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {visual.color_mood.map((swatch, i) => (
              <div
                key={i}
                className="group relative rounded-xl bg-surface-container p-4 flex flex-col justify-between h-72 shadow-md transition-all duration-300 hover:-translate-y-1 border border-white/5"
              >
                <div
                  className="w-full h-36 rounded-lg shadow-inner relative overflow-hidden flex items-end p-2.5 border border-white/10"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <span className="font-label text-[10px] uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
                    {swatch.role}
                  </span>
                </div>
                <div className="space-y-1 pt-2">
                  <span className="font-label text-[10px] uppercase tracking-wider text-primary">
                    {swatch.role}
                  </span>
                  <h3 className="font-headline text-base text-on-surface font-semibold">
                    {swatch.name}
                  </h3>
                  <div className="flex items-center justify-between text-outline font-label text-xs pt-1">
                    <span>HEX</span>
                    <span className="font-mono text-on-surface font-semibold">{swatch.hex}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1">
                    {swatch.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 02 TYPOGRAPHY SPECIMENS */}
        <section className="mt-6 mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-label text-xs text-outline font-bold">02</span>
              <h2 className="font-headline text-2xl text-on-surface font-semibold">
                Typography Specimens
              </h2>
            </div>
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
              Editorial Precision
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs uppercase text-primary font-semibold">
                  Display & Headlines
                </span>
                <span className="font-mono text-xs text-outline">Plus Jakarta Sans</span>
              </div>
              <p className="font-headline text-3xl font-bold text-on-surface leading-tight">
                Turn ideas into launch crews.
              </p>
              <p className="text-xs text-on-surface-variant">
                Used for display titles, heroic callouts, and commanding section intros.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs uppercase text-secondary font-semibold">
                  Interface & Body Copy
                </span>
                <span className="font-mono text-xs text-outline">Plus Jakarta Sans</span>
              </div>
              <p className="font-body text-base text-on-surface leading-relaxed">
                Clear humanist counters ensure effortless legibility across dense dashboard cards
                and long-form strategy briefs.
              </p>
              <p className="text-xs text-on-surface-variant">
                Body text with calibrated letter-spacing for dark mode reading comfort.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs uppercase text-tertiary font-semibold">
                  Telemetry & Data Labels
                </span>
                <span className="font-mono text-xs text-outline">Space Grotesk</span>
              </div>
              <p className="font-label text-sm uppercase tracking-widest text-on-surface">
                STAGE 06 // 98.4% MATCH // SPEC_V1
              </p>
              <p className="text-xs text-on-surface-variant">
                Powers compact pills, metric indicators, and architectural data coordinates.
              </p>
            </div>
          </div>
        </section>

        {/* 03 IMAGERY & COMPOSITION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-label text-xs text-outline font-bold">03</span>
              <h3 className="font-headline text-xl text-on-surface font-semibold">
                Imagery & Composition
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {visual.image_style}
            </p>
            <div className="p-3.5 rounded-lg bg-surface-container-low border border-white/5 text-xs text-on-surface-variant">
              <strong>Spatial Rhythm:</strong> {visual.composition}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-label text-xs text-outline font-bold">04</span>
              <h3 className="font-headline text-xl text-on-surface font-semibold">
                Symbols & Boundaries
              </h3>
            </div>
            <div className="space-y-2">
              <span className="font-label text-xs text-outline uppercase">
                Core Geometric Symbols
              </span>
              <div className="flex flex-wrap gap-2">
                {visual.symbols.map((sym, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-surface-container-high text-xs text-primary font-label border border-white/5"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-2 border-t border-white/5">
              <span className="font-label text-xs text-error uppercase">
                Visual Tropes to Avoid
              </span>
              <ul className="text-xs text-on-surface-variant space-y-1">
                {visual.concepts_to_avoid.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-[14px]">close</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
