import React, { useState } from 'react';
import { ProjectData } from '../types/project';
import { api } from '../services/api';

interface BrandIdentityPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
  onProjectUpdated: (updatedProject: ProjectData) => void;
}

export const BrandIdentityPage: React.FC<BrandIdentityPageProps> = ({
  project,
  onNavigate,
  onProjectUpdated,
}) => {
  const shape = project.shape || {
    personality: [
      { trait: 'Confident', reason: 'Bold stance on student execution over credentials.' },
      { trait: 'Energetic', reason: 'Action-oriented and optimistic about campus ventures.' },
      { trait: 'Practical', reason: 'Zero fluff, focused on commit history and real deliverables.' },
      { trait: 'Open', reason: 'Welcoming to first-time builders and diverse skill sets.' },
    ],
    traits_to_avoid: [
      'Corporate HR bureaucracy & stiff resume speak',
      'Overhyped vanity marketing & empty buzzwords',
      'Paternalistic academic lecturing',
    ],
    naming_directions: [
      {
        name: 'CampusCrew',
        concept: 'Community & Trust',
        rationale: 'Collegiate yet professional, emphasizes tight-knit teamwork.',
        available: true,
      },
      {
        name: 'SyncCampus',
        concept: 'Operational Alignment',
        rationale: 'Highlights schedule compatibility and simultaneous velocity.',
        available: true,
      },
      {
        name: 'BuilderGuild',
        concept: 'Craft & Excellence',
        rationale: 'Positions the platform as a selective maker guild.',
        available: false,
      },
    ],
    tagline: 'Build better together.',
    one_line_pitch: 'The verified teammate matching platform for ambitious student creators and project builders.',
    brand_voice: {
      tone: 'Direct, energetic, collegiate, no-nonsense',
      style: 'Crisp sentences, action verbs, zero academic fluff',
      principles: [
        'Speak like a builder, not a bureaucrat',
        'Celebrate small ships and steady progress',
        'Prioritize reliability over hype',
      ],
    },
    message_hierarchy: [
      {
        level: 'Primary Hero',
        message: 'Turn your idea into a team that actually ships.',
        intent: 'Inspire immediate action and solve teammate anxiety.',
      },
      {
        level: 'Supporting Value',
        message: 'Match with campus teammates by work style, schedule, and verified commitment.',
        intent: 'Address core anxiety around teammate reliability and ghosting.',
      },
    ],
  };

  const [selectedName, setSelectedName] = useState(
    project.delivery?.selected_naming_direction || project.name || 'CampusCrew'
  );
  const [tagline, setTagline] = useState(shape.tagline || 'Build better together.');
  const [activeTraits, setActiveTraits] = useState(
    shape.personality.map((p) => (typeof p === 'string' ? p : p.trait))
  );

  const [saving, setSaving] = useState(false);

  const toggleTrait = (traitName: string) => {
    if (activeTraits.includes(traitName)) {
      if (activeTraits.length > 2) {
        setActiveTraits(activeTraits.filter((t) => t !== traitName));
      }
    } else {
      setActiveTraits([...activeTraits, traitName]);
    }
  };

  const handleSelectName = async (name: string) => {
    setSelectedName(name);
    try {
      const updated = await api.updateDecision(
        project.project_id,
        'selected_naming_direction',
        name
      );
      onProjectUpdated(updated);
    } catch {
      // ignore
    }
  };

  const handleSaveAndContinue = async () => {
    setSaving(true);
    try {
      await api.updateDecision(project.project_id, 'personality', activeTraits);
      const updated = await api.updateDecision(project.project_id, 'tagline', tagline);
      onProjectUpdated(updated);
      onNavigate(6);
    } catch {
      onNavigate(6);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full pb-16">
        {/* Ambient Canvas Glows */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 right-12 w-96 h-96 bg-primary-container/10 rounded-full blur-[128px] pointer-events-none"></div>
          <div className="absolute top-48 left-1/3 w-80 h-80 bg-tertiary-container/10 rounded-full blur-[140px] pointer-events-none"></div>

          {/* Header & Stage Indicator */}
          <div className="pt-8 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-label text-xs uppercase tracking-widest text-primary px-2.5 py-0.5 rounded-full bg-surface-container-high border border-white/5 font-semibold">
                  Stage 05 / 07
                </span>
                <span className="font-label text-xs uppercase tracking-wider text-outline">
                  Brand Architecture
                </span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl text-on-surface tracking-tight font-bold">
                Shape your brand
              </h1>
              <p className="font-body text-base text-on-surface-variant max-w-2xl">
                Turn your strategy into a personality people can recognize. Calibrate verbal
                resonance, team alignment, and naming coordinates.
              </p>
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <button
                onClick={() => handleSaveAndContinue()}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-headline text-sm font-semibold shadow-md transition-all disabled:opacity-50"
                type="button"
              >
                <span>{saving ? 'Saving...' : 'Save & View Visuals'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: PERSONALITY PILL MATRIX */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-label text-xs uppercase tracking-wider text-on-surface font-semibold">
                  01. Personality Vectors
                </span>
                <span className="font-label text-xs text-outline">
                  {activeTraits.length} Active Core Attributes
                </span>
              </div>
              <span className="font-label text-xs text-tertiary flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                Synchronized with Audience Fit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="personality-container">
              {shape.personality.map((p, idx) => {
                const traitName = typeof p === 'string' ? p : p.trait;
                const reason = typeof p === 'string' ? 'Derived from strategy' : p.reason;
                const isSelected = activeTraits.includes(traitName);

                const iconMap: Record<string, string> = {
                  Confident: 'bolt',
                  Energetic: 'local_fire_department',
                  Practical: 'construction',
                  Open: 'diversity_3',
                };

                return (
                  <div
                    key={idx}
                    onClick={() => toggleTrait(traitName)}
                    className={`group relative p-5 rounded-xl transition-all duration-300 shadow-md cursor-pointer flex flex-col justify-between min-h-[160px] border ${
                      isSelected
                        ? 'bg-surface-container border-primary/40 ring-1 ring-primary/20'
                        : 'bg-surface-container-low border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-label text-[11px] text-outline uppercase tracking-wider">
                          0{idx + 1} / Archetype
                        </span>
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isSelected ? 'text-primary' : 'text-outline'
                          }`}
                        >
                          {iconMap[traitName] || 'sparkles'}
                        </span>
                      </div>
                      <h3 className="font-headline text-lg text-on-surface font-semibold">
                        {traitName}
                      </h3>
                      <p className="mt-1 font-body text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                        {reason}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 font-label text-[11px]">
                      <span className={isSelected ? 'text-primary font-semibold' : 'text-outline'}>
                        {isSelected ? 'Active Trait' : 'Click to activate'}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        {isSelected ? 'check_circle' : 'add_circle'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: ANTI-ATTRIBUTES (TRAITS TO AVOID) */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                02. Anti-Attributes (What we deliberately avoid)
              </span>
              <span className="font-label text-xs text-error font-semibold">
                Negative Bounds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shape.traits_to_avoid.map((trait, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-surface-container-low border border-error/20 flex items-start gap-3"
                >
                  <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">
                    block
                  </span>
                  <div>
                    <span className="font-label text-xs text-error font-semibold uppercase tracking-wider">
                      Avoid Cliché
                    </span>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">
                      {trait}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: NAMING CANDIDATES */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs uppercase tracking-wider text-on-surface font-semibold">
                03. Naming Direction Coordinates
              </span>
              <span className="font-label text-xs text-outline">
                Click to set primary brand name
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shape.naming_directions.map((nd, i) => {
                const isCurrent = selectedName === nd.name;
                return (
                  <div
                    key={i}
                    onClick={() => handleSelectName(nd.name)}
                    className={`p-5 rounded-xl transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-surface-container border-tertiary/50 ring-1 ring-tertiary/30'
                        : 'bg-surface-container-low border-white/5 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label text-xs uppercase text-outline">
                        {nd.concept}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label text-[10px] font-bold">
                          Selected
                        </span>
                      )}
                    </div>
                    <h4 className="font-headline text-2xl font-bold text-on-surface mb-1">
                      {nd.name}
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                      {nd.rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: VERBAL MATRIX (TAGLINE & PITCH) */}
          <section className="p-6 sm:p-8 rounded-xl bg-surface-container border border-white/5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                04. Verbal Resonance & Tagline
              </span>
              <span className="font-label text-xs text-primary font-semibold">
                Launch Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label text-xs uppercase text-outline block mb-1.5">
                  Core Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-headline text-lg sm:text-xl font-bold rounded-lg p-3 outline-none border border-white/10 focus:border-primary/40"
                />
              </div>

              <div>
                <label className="font-label text-xs uppercase text-outline block mb-1.5">
                  One-Line Pitch
                </label>
                <p className="font-body text-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-white/5">
                  {shape.one_line_pitch}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
