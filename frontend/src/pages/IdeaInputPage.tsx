import React, { useState } from 'react';
import { ProjectData, ProjectInput, DiscoveryData } from '../types/project';
import { api } from '../services/api';

interface IdeaInputPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
  onProjectCreated: (newProject: ProjectData) => void;
}

const DEMO_DISCOVERY: DiscoveryData = {
  problem:
    'Small startup founders struggle to turn rough product ideas into clear, differentiated brands quickly and affordably.',
  target_user:
    'Early-stage startup founders and small teams preparing to launch a new product.',
  context:
    'Founders often have a strong product idea but lack dedicated brand strategy resources and need to move from concept to launch quickly.',
  constraints: [
    'Small budget.',
    'Need to launch quickly.',
    'Limited branding expertise.',
  ],
  known_value:
    'An AI-guided system can transform an unstructured startup idea into structured brand intelligence and launch-ready direction.',
  open_questions: [
    'What exact category should the product own?',
    'Which customer segment has the strongest immediate need?',
    'What alternatives are founders currently using?',
    'What proof points can establish trust?',
  ],
};

export const IdeaInputPage: React.FC<IdeaInputPageProps> = ({
  project,
  onNavigate,
  onProjectCreated,
}) => {
  const [idea, setIdea] = useState(
    project.input.idea ||
      'An AI platform that helps small startups turn rough ideas into clear, launch-ready brands.'
  );
  const [audience, setAudience] = useState(
    project.input.audience || 'Early-stage startup founders'
  );
  const [category, setCategory] = useState('Brand intelligence platform');
  const [tone, setTone] = useState(
    project.input.tone || 'Modern, energetic, practical and friendly'
  );
  const [constraints, setConstraints] = useState<string[]>(
    project.input.constraints && project.input.constraints.length > 0
      ? project.input.constraints
      : ['Small budget', 'Need to launch quickly', 'Limited branding expertise']
  );
  const [newConstraint, setNewConstraint] = useState('');

  // Accordion toggle states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    audience: false,
    category: false,
    tone: false,
    constraints: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryData | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddConstraint = (e: React.FormEvent) => {
    e.preventDefault();
    if (newConstraint.trim()) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint('');
    }
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError('Please provide an idea to proceed.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate AI Discovery Agent analysis with visible loading feedback
    setTimeout(() => {
      setDiscoveryResult(DEMO_DISCOVERY);
      setLoading(false);

      const inputData: ProjectInput = {
        idea: idea.trim(),
        audience: audience.trim(),
        tone: tone.trim(),
        constraints: constraints,
      };

      const updatedProject: ProjectData = {
        ...project,
        name: 'BrandPrism AI',
        input: inputData,
        discovery: DEMO_DISCOVERY,
        status: 'DISCOVERING',
        completed_stages: ['discovery'],
      };

      onProjectCreated(updatedProject);

      // Smooth scroll to the result section
      setTimeout(() => {
        const el = document.getElementById('discovery-result-card');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 1200);
  };

  // Quick preset pills
  const samplePrompts = [
    'Teammate matching for campus builders',
    'AI accounting co-pilot for freelance creatives',
    'Hyper-local specialty coffee subscription',
    'Open-source developer dev-tools telemetry',
  ];

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full">
        <div className="relative w-full py-10 sm:py-16 flex flex-col items-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-b from-primary-container/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

          <div className="w-full max-w-4xl flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-secondary font-label text-xs uppercase tracking-wider mb-1 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Step 01 • Strategic Vision
              </div>
              <h1 className="font-headline text-3xl sm:text-5xl text-on-surface tracking-tight font-bold">
                Tell us about your idea.
              </h1>
              <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-xl">
                Start with what you know. We’ll help with the rest.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-error-container/30 border border-error/40 text-error flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-xs uppercase font-label hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Form & Main Card */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Core Idea & Clarifiers */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Main Textarea Container */}
                <div className="bg-surface-container rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/5 focus-within:border-primary/40 focus-within:shadow-[0_0_32px_-6px_rgba(128,131,255,0.2)] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <label
                      className="font-label text-xs uppercase tracking-wider text-outline flex items-center gap-2"
                      htmlFor="idea-prompt"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        auto_awesome
                      </span>
                      What are you building?
                    </label>
                    <span className="font-label text-[10px] text-outline px-2 py-0.5 rounded bg-surface-container-high">
                      Draft Auto-Saved
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      id="idea-prompt"
                      rows={5}
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="An app that helps college students find teammates for projects, matching by work style and schedule instead of just friendship."
                      className="w-full bg-surface-container-low text-on-surface font-body text-base rounded-lg p-4 sm:p-6 outline-none placeholder:text-outline-variant resize-none leading-relaxed transition-all focus:bg-surface-container-lowest border border-white/5 focus:border-primary/30"
                    />

                    <div className="flex items-center justify-between mt-3 text-outline font-label text-xs">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-tertiary">
                          <span className="material-symbols-outlined text-[14px]">
                            check_circle
                          </span>
                          Context clarity 94%
                        </span>
                      </div>
                      <span>{idea.length} characters</span>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-outline font-label">Try an example:</span>
                    {samplePrompts.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIdea(p)}
                        className="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors font-body"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progressive Clarifiers Accordion */}
                <div className="bg-surface-container rounded-xl p-6 shadow-md flex flex-col gap-4 border border-white/5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                      Progressive Clarifiers (Optional)
                    </span>
                    <span className="font-label text-xs text-on-surface-variant">
                      4 vectors available
                    </span>
                  </div>

                  {/* Clarifier 1: Target Audience */}
                  <div className="bg-surface-container-low rounded-lg p-4 border border-white/5">
                    <button
                      type="button"
                      onClick={() => toggleSection('audience')}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-label text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                          <span className="text-primary font-bold">+</span> Target Audience
                        </span>
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label text-xs truncate">
                          {audience}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-transform duration-200 ${
                          openSections.audience ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {openSections.audience && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                        <input
                          type="text"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                          placeholder="e.g. College students, solo founders, early adopters"
                          className="w-full bg-surface-container text-on-surface font-body text-sm rounded-lg px-3.5 py-2 outline-none border border-white/5 focus:border-primary/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Clarifier 2: Product Category */}
                  <div className="bg-surface-container-low rounded-lg p-4 border border-white/5">
                    <button
                      type="button"
                      onClick={() => toggleSection('category')}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-label text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                          <span className="text-primary font-bold">+</span> Category & Niche
                        </span>
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label text-xs truncate">
                          {category}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-transform duration-200 ${
                          openSections.category ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {openSections.category && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g. Student collaboration platform, developer tool"
                          className="w-full bg-surface-container text-on-surface font-body text-sm rounded-lg px-3.5 py-2 outline-none border border-white/5 focus:border-primary/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Clarifier 3: Tone & Voice */}
                  <div className="bg-surface-container-low rounded-lg p-4 border border-white/5">
                    <button
                      type="button"
                      onClick={() => toggleSection('tone')}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-label text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                          <span className="text-primary font-bold">+</span> Tone & Demeanor
                        </span>
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label text-xs truncate">
                          {tone}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-transform duration-200 ${
                          openSections.tone ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {openSections.tone && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <input
                          type="text"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          placeholder="e.g. Modern, energetic, practical and friendly"
                          className="w-full bg-surface-container text-on-surface font-body text-sm rounded-lg px-3.5 py-2 outline-none border border-white/5 focus:border-primary/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Clarifier 4: Constraints */}
                  <div className="bg-surface-container-low rounded-lg p-4 border border-white/5">
                    <button
                      type="button"
                      onClick={() => toggleSection('constraints')}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-label text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                          <span className="text-primary font-bold">+</span> Key Constraints
                        </span>
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label text-xs truncate">
                          {constraints.length} added
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-transform duration-200 ${
                          openSections.constraints ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {openSections.constraints && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {constraints.map((c, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-body"
                            >
                              <span>{c}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveConstraint(i)}
                                className="text-outline hover:text-error transition-colors"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newConstraint}
                            onChange={(e) => setNewConstraint(e.target.value)}
                            placeholder="Add constraint (e.g. Free student tier)"
                            className="flex-1 bg-surface-container text-on-surface font-body text-xs rounded-lg px-3 py-1.5 outline-none border border-white/5 focus:border-primary/40"
                          />
                          <button
                            type="button"
                            onClick={handleAddConstraint}
                            className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-primary font-label text-xs hover:bg-primary-container hover:text-white transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary-container text-on-primary-container font-headline text-base font-semibold shadow-xl shadow-primary-container/20 hover:bg-primary hover:text-on-primary transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Discovery Agent analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Brand Architecture</span>
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center font-label text-xs text-outline">
                    Connected to FastAPI Intelligence Pipeline • Discovery Agent Ready
                  </p>
                </div>
              </div>

              {/* Right Column: Intelligence Specs & Info */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-primary font-label text-xs uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    What happens next
                  </div>
                  <ul className="space-y-3 font-body text-xs text-on-surface-variant leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0"></span>
                      <span>
                        <strong>Discovery Agent:</strong> Maps out your core problem, user segments, and hidden friction.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                      <span>
                        <strong>Positioning Agent:</strong> Formulates your unfair competitive advantage.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0"></span>
                      <span>
                        <strong>Shape & Identity:</strong> Generates personality traits, naming directions, and voice guide.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline mt-1.5 shrink-0"></span>
                      <span>
                        <strong>AI Critic & Verification:</strong> Flags cliché language before finalizing your launch kit.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-3">
                  <span className="font-label text-xs text-outline uppercase tracking-wider">
                    Recent Verified Brands
                  </span>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between text-xs">
                      <span className="font-semibold text-on-surface">CampusCrew</span>
                      <span className="text-tertiary font-label">100% Coherent</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between text-xs">
                      <span className="font-semibold text-on-surface">TravelPilot</span>
                      <span className="text-secondary font-label">Production</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Polished AI Discovery Result Section */}
            {discoveryResult && (
              <div
                id="discovery-result-card"
                className="w-full mt-4 bg-surface-container rounded-2xl p-6 sm:p-8 shadow-2xl border border-primary/40 relative overflow-hidden animate-fade-in"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-tertiary to-secondary"></div>

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/30 shadow-sm">
                      <span className="material-symbols-outlined text-[28px]">psychology</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
                          AI Discovery Agent
                        </h2>
                        <span className="text-tertiary font-bold text-2xl">✓</span>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-on-surface-variant">
                        Structured brand intelligence synthesized from raw founder inputs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary font-label text-xs font-semibold self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    Discovery stage completed
                  </div>
                </div>

                {/* Grid of Discovery Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  {/* Problem - High Impact Full Width */}
                  <div className="lg:col-span-12 p-6 rounded-xl bg-surface-container-high border border-white/5 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-primary-container"></div>
                    <div className="flex items-center gap-2 text-primary font-label text-xs uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
                      Problem
                    </div>
                    <p className="font-headline text-lg sm:text-xl text-on-surface font-semibold leading-relaxed">
                      {discoveryResult.problem}
                    </p>
                  </div>

                  {/* Target User */}
                  <div className="lg:col-span-6 p-5 sm:p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-secondary font-label text-xs uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      Target User
                    </div>
                    <p className="font-body text-sm sm:text-base text-on-surface leading-relaxed font-medium">
                      {discoveryResult.target_user}
                    </p>
                  </div>

                  {/* Context */}
                  <div className="lg:col-span-6 p-5 sm:p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-outline font-label text-xs uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                      Context
                    </div>
                    <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
                      {discoveryResult.context}
                    </p>
                  </div>

                  {/* Constraints */}
                  <div className="lg:col-span-6 p-5 sm:p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-outline font-label text-xs uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">rule</span>
                      Constraints
                    </div>
                    <ul className="space-y-2">
                      {discoveryResult.constraints.map((c, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-sm text-on-surface">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Known Value */}
                  <div className="lg:col-span-6 p-5 sm:p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-tertiary font-label text-xs uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Known Value
                    </div>
                    <p className="font-body text-sm sm:text-base text-on-surface leading-relaxed">
                      {discoveryResult.known_value}
                    </p>
                  </div>

                  {/* Open Questions */}
                  <div className="lg:col-span-12 p-5 sm:p-6 rounded-xl bg-surface-container-lowest border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-label text-xs uppercase tracking-wider font-semibold">
                      <span className="material-symbols-outlined text-[16px]">help_outline</span>
                      Open Questions
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {discoveryResult.open_questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-surface-container border border-white/5 flex items-start gap-2.5 text-xs sm:text-sm text-on-surface"
                        >
                          <span className="font-label text-xs text-primary font-bold">
                            {idx + 1}.
                          </span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Continue Action */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <span className="font-label text-xs text-outline">
                    Discovery Stage Verified • Ready for Positioning & Strategic Vectors
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-headline text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-md"
                  >
                    <span>Continue to Brand Strategy</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
