import React from 'react';
import { ProjectData } from '../types/project';

interface LandingPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
}) => {
  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative pt-10 sm:pt-16 pb-12 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-primary-container/10 rounded-full blur-[130px] pointer-events-none"></div>
          <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label text-xs sm:text-sm mb-6 shadow-sm border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span className="tracking-widest uppercase">Founder Studio OS</span>
              <span className="text-outline">/</span>
              <span className="text-primary font-semibold">Zero to Identity</span>
            </div>

            {/* Headline */}
            <h1 className="font-headline-lg text-4xl sm:text-6xl lg:text-7xl text-on-surface tracking-tight max-w-4xl font-bold leading-tight">
              Turn your idea <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed to-secondary">
                into a brand.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 font-body text-base sm:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              From a rough idea to positioning, identity, voice and launch messaging — guided by AI.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate(2)}
                className="group flex items-center gap-2 px-6 py-3.5 rounded-lg bg-primary-container text-on-primary-container font-headline text-base font-semibold shadow-lg shadow-primary-container/20 hover:bg-primary hover:text-on-primary transition-all duration-200"
                id="start-build-btn"
                type="button"
              >
                <span>Build my brand</span>
                <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => onNavigate(3)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-headline text-base border border-white/5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-outline">
                  play_circle
                </span>
                <span>See how it works</span>
              </button>
            </div>

            {/* Linear Brand Genesis Stepper Preview */}
            <div className="w-full mt-12 pt-6">
              <div className="flex items-center justify-between px-2 mb-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                    tune
                  </span>
                  <span className="font-label text-xs uppercase tracking-wider text-outline">
                    Linear Brand Genesis
                  </span>
                </div>
                <span className="font-label text-xs text-primary font-semibold">
                  7-Stage Creative Intelligence Pipeline
                </span>
              </div>

              <div className="p-4 sm:p-6 bg-surface-container-lowest rounded-xl shadow-xl border border-white/5">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 relative">
                  {[
                    { step: '01', name: 'IDEA', desc: 'Spark core intent', target: 2 },
                    { step: '02', name: 'DISCOVER', desc: 'Market landscape', target: 3 },
                    { step: '03', name: 'POSITION', desc: 'Unfair advantage', target: 4 },
                    { step: '04', name: 'SHAPE', desc: 'Voice & cadence', target: 5 },
                    { step: '05', name: 'VISUALIZE', desc: 'Palette & tokens', target: 6 },
                    { step: '06', name: 'CHALLENGE', desc: 'Editorial critic', target: 7 },
                    { step: '07', name: 'DELIVER', desc: 'Production kit', target: 9 },
                  ].map((node, idx) => (
                    <button
                      key={node.step}
                      onClick={() => onNavigate(node.target)}
                      className={`group relative flex flex-col items-start p-3 sm:p-4 rounded-lg transition-all text-left border ${
                        idx === 2
                          ? 'bg-surface-container-high shadow-md border-primary/30'
                          : 'bg-surface-container hover:bg-surface-container-high border-white/5'
                      }`}
                      type="button"
                    >
                      <span
                        className={`font-label text-xs ${
                          idx === 2
                            ? 'text-primary font-semibold'
                            : 'text-outline group-hover:text-primary'
                        }`}
                      >
                        {idx === 2 ? `${node.step} / ACTIVE` : node.step}
                      </span>
                      <span className="mt-2 font-label text-sm sm:text-base text-on-surface font-semibold">
                        {node.name}
                      </span>
                      <span className="mt-1 font-body text-xs text-on-surface-variant truncate w-full">
                        {node.desc}
                      </span>
                      <div
                        className={`mt-3 w-2 h-2 rounded-full ${
                          idx === 2
                            ? 'bg-primary-container shadow-[0_0_12px_#8083ff]'
                            : idx < 2
                            ? 'bg-tertiary'
                            : 'bg-outline-variant'
                        }`}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Bento */}
        <section className="py-12 border-t border-white/5 max-w-5xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="font-headline text-2xl sm:text-3xl text-on-surface font-bold">
              One idea. One coherent brand.
            </h2>
            <p className="mt-2 text-on-surface-variant text-sm sm:text-base max-w-lg mx-auto">
              Our AI workflow transforms fragments of thoughts into a launch-grade, defensible identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">psychology</span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                  Discovery & Strategy
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Extract core customer pain points, validate market friction, and formulate positioning vectors that won’t get lost in noise.
                </p>
              </div>
              <button
                onClick={() => onNavigate(4)}
                className="mt-6 flex items-center gap-1.5 text-xs font-label text-primary hover:text-primary-container transition-colors"
              >
                <span>Explore Strategy</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">fingerprint</span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                  Personality & Voice
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Establish authentic voice principles, dynamic message hierarchy, and calibrate brand traits to avoid corporate clichés.
                </p>
              </div>
              <button
                onClick={() => onNavigate(5)}
                className="mt-6 flex items-center gap-1.5 text-xs font-label text-tertiary hover:opacity-80 transition-colors"
              >
                <span>Shape Identity</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                  Critic & Consistency
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  An automated AI critic stress-tests your brand for generic startup tropes, while 5-pillar consistency guarantees coherence.
                </p>
              </div>
              <button
                onClick={() => onNavigate(8)}
                className="mt-6 flex items-center gap-1.5 text-xs font-label text-secondary hover:opacity-80 transition-colors"
              >
                <span>View Validation</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-headline text-xl text-on-surface font-bold">
                Ready to define your brand identity?
              </h3>
              <p className="text-on-surface-variant text-sm">
                Transform your raw idea into a launch-ready brand kit in under two minutes.
              </p>
            </div>
            <button
              onClick={() => onNavigate(2)}
              className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-headline text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-md shrink-0"
            >
              Start your brand sprint
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
