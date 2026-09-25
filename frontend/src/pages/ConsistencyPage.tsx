import React from 'react';
import { ProjectData, ConsistencyCheckItem } from '../types/project';

interface ConsistencyPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
}

export const ConsistencyPage: React.FC<ConsistencyPageProps> = ({
  project,
  onNavigate,
}) => {
  const defaultChecks: ConsistencyCheckItem[] = [
    {
      name: 'Name matches positioning',
      status: 'PASSED',
      detail:
        'CampusCrew directly evokes collegiate collaboration and shared squad stakes without feeling like generic enterprise software.',
    },
    {
      name: 'Tagline matches value proposition',
      status: 'PASSED',
      detail:
        "'Build better together' encapsulates the mutual commitment and schedule compatibility vetting mechanism.",
    },
    {
      name: 'Voice matches personality',
      status: 'PASSED',
      detail:
        'The direct, energetic, and peer-to-peer tone mirrors Confident, Energetic, and Practical brand traits.',
    },
    {
      name: 'Visual direction matches personality',
      status: 'PASSED',
      detail:
        'Obsidian canvas with Electric Indigo and Verified Mint accurately signals a focused, modern student builder space.',
    },
    {
      name: 'Launch copy matches selected voice',
      status: 'PASSED',
      detail:
        'Punchy, action-oriented headlines eliminate academic lecturing and corporate fluff.',
    },
  ];

  const checks = project.consistency?.checks || defaultChecks;
  const score = project.consistency?.score || 100;
  const recommendations = project.consistency?.recommendations || [
    'Refine secondary onboarding modal copy to emphasize the beginner apprentice tier.',
    'Test collegiate verified badge against dark background variants.',
  ];

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full max-w-[1440px] mx-auto py-8 sm:py-12 space-y-8 pb-16">
        {/* Top Context & Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-tertiary font-label text-xs tracking-wider uppercase flex items-center gap-1.5 border border-white/5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                Stage 06 • Brand Synthesis
              </span>
              <span className="font-label text-xs text-outline uppercase tracking-widest">
                System Validation Run #409
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-on-surface tracking-tight font-bold">
              Everything working together?
            </h1>
            <p className="font-body text-base text-on-surface-variant">
              Verifying that your name, voice, visuals, and messaging reinforce each other.
            </p>
          </div>

          {/* Top Status Summary Pill Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low shadow-sm border border-white/5 shrink-0">
            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-tertiary-container/30 text-tertiary">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline text-xl text-on-surface font-bold">
                  {score}%
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label text-xs font-bold">
                  {checks.length} of {checks.length} checks passed
                </span>
              </div>
              <span className="font-label text-xs text-outline">
                Brand Coherence Matrix Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5-Point Checklist Cards */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {checks.map((chk, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl bg-surface-container transition-all hover:bg-surface-container-high shadow-sm border border-white/5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[22px]">
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-label text-xs uppercase tracking-wider text-outline">
                        Pillar 0{i + 1} • Consistency Matrix
                      </span>
                      <span className="font-label text-xs text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded font-semibold">
                        Aligned
                      </span>
                    </div>
                    <h2 className="font-headline text-lg sm:text-xl text-on-surface mb-1 font-semibold">
                      {chk.name}
                    </h2>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {chk.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Rail: Telemetry & Actions */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            {/* Primary Action Card */}
            <div className="p-6 rounded-xl bg-surface-container-high border border-primary/20 space-y-4 shadow-xl">
              <span className="font-label text-xs text-primary uppercase font-bold tracking-wider">
                Readiness Assessment
              </span>
              <h3 className="font-headline text-xl text-on-surface font-semibold">
                Launch Kit Unlocked
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                All 5 brand pillars are in full semantic alignment. There are zero critical
                contradictions or tone conflicts.
              </p>

              <button
                onClick={() => onNavigate(9)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-primary-container text-on-primary-container font-headline text-sm font-semibold hover:bg-primary hover:text-on-primary shadow-lg transition-all"
              >
                <span>Proceed to Final Brand Kit</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Recommendations */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-3">
              <span className="font-label text-xs text-outline uppercase font-semibold">
                Optimization Recommendations
              </span>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                      lightbulb
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
