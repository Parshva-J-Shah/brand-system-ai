import React, { useState } from 'react';
import { ProjectData, CritiqueItem } from '../types/project';

interface CritiquePageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
}

export const CritiquePage: React.FC<CritiquePageProps> = ({
  project,
  onNavigate,
}) => {
  const defaultCritique: CritiqueItem[] = [
    {
      issue: 'Your positioning sounds similar to existing collaboration products.',
      why_it_is_a_problem:
        'Audience testing flagged high fatigue with vague productivity promises. Founders in the hackathon circuit need concrete utility rather than generic buzzwords.',
      suggested_change:
        "Anchor directly to execution stakes: 'Find the team that actually ships.' or 'Zero ghosting. Verified campus crews.'",
      severity: 'HIGH',
      category: 'Generic Language',
    },
    {
      issue: 'Overemphasis on skill testing risks intimidating first-time builders.',
      why_it_is_a_problem:
        'Newer students or first-year enthusiasts might bounce if the interface feels like an elitist vetting exam.',
      suggested_change:
        "Introduce an 'Apprentice / Explorer' badge tier to celebrate curiosity alongside experienced coders.",
      severity: 'MEDIUM',
      category: 'Audience Accessibility',
    },
    {
      issue: 'Voice guidelines occasionally lean too close to tech-bro urgency.',
      why_it_is_a_problem:
        'This could discourage designers, writers, and humanities majors from joining interdisciplinary project teams.',
      suggested_change:
        'Ensure sample projects prominently feature design, UX, and social impact categories.',
      severity: 'LOW',
      category: 'Inclusivity & Tone',
    },
  ];

  const critiqueItems = project.critique && project.critique.length > 0 ? project.critique : defaultCritique;
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);

  const handleToggleAccept = (idx: number) => {
    if (acceptedIds.includes(idx)) {
      setAcceptedIds(acceptedIds.filter((id) => id !== idx));
    } else {
      setAcceptedIds([...acceptedIds, idx]);
    }
  };

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full max-w-5xl mx-auto py-8 sm:py-12 pb-16">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-6 sm:p-8 mb-8 shadow-xl border border-white/5">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/4 -bottom-24 w-60 h-60 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface shadow-sm border border-white/5">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                <span className="font-label text-xs tracking-wider uppercase text-secondary font-semibold">
                  Editorial Stress-Test
                </span>
                <span className="text-outline-variant text-xs">•</span>
                <span className="font-label text-xs text-on-surface-variant font-semibold">
                  Stage 05 / 07
                </span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl text-on-surface tracking-tight font-bold">
                Challenge the brand
              </h1>
              <p className="font-body text-base text-on-surface-variant leading-relaxed">
                Your AI critic checked the strategy for weak or generic decisions.
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-highest shadow-sm border border-white/5">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  warning
                </span>
                <span className="font-label text-sm text-on-surface font-semibold tracking-wide">
                  {critiqueItems.length} things worth reconsidering
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Critique Cards List */}
        <div className="space-y-4 mb-8">
          {critiqueItems.map((item, idx) => {
            const isAccepted = acceptedIds.includes(idx);
            return (
              <div
                key={idx}
                className={`relative rounded-xl p-6 transition-all duration-300 shadow-md border ${
                  isAccepted
                    ? 'bg-surface-container-high border-tertiary/40'
                    : 'bg-surface-container border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Header badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-surface-container-highest text-on-surface font-label text-xs uppercase tracking-wider font-semibold">
                        {item.category || 'Strategy Vector'}
                      </span>
                      <span className="text-outline-variant text-xs">•</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-label uppercase tracking-wider font-bold ${
                          item.severity === 'HIGH'
                            ? 'bg-error/20 text-error'
                            : item.severity === 'MEDIUM'
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-tertiary/20 text-tertiary'
                        }`}
                      >
                        {item.severity || 'Medium'} Priority
                      </span>
                    </div>

                    {/* Issue */}
                    <div>
                      <h3 className="font-headline text-lg sm:text-xl text-on-surface font-semibold mb-1">
                        {item.issue}
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                        {item.why_it_is_a_problem}
                      </p>
                    </div>

                    {/* Suggested Change */}
                    <div className="p-4 rounded-lg bg-surface-container-low border-l-2 border-tertiary space-y-1">
                      <span className="font-label text-xs uppercase tracking-wider text-tertiary font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                        Suggested AI Revision
                      </span>
                      <p className="font-body text-sm text-on-surface font-medium leading-relaxed">
                        "{item.suggested_change}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleAccept(idx)}
                      className={`px-4 py-2 rounded-lg font-label text-xs font-semibold transition-all ${
                        isAccepted
                          ? 'bg-tertiary text-on-tertiary shadow-sm'
                          : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      {isAccepted ? '✓ Implemented' : 'Accept Suggestion'}
                    </button>

                    <button
                      onClick={() => {}}
                      className="px-3 py-2 rounded-lg font-label text-xs text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      Keep Original
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to next stage */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            onClick={() => onNavigate(6)}
            className="flex items-center gap-1.5 font-label text-xs text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Visual Direction
          </button>

          <button
            onClick={() => onNavigate(8)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-headline text-sm font-semibold hover:bg-primary hover:text-on-primary shadow-lg transition-all"
          >
            <span>Continue to Consistency Check</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
};
