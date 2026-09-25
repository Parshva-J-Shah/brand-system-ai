import React, { useState } from 'react';
import { ProjectData } from '../types/project';
import { api } from '../services/api';

interface StrategyPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
  onProjectUpdated: (updatedProject: ProjectData) => void;
}

export const StrategyPage: React.FC<StrategyPageProps> = ({
  project,
  onNavigate,
  onProjectUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [problem, setProblem] = useState(
    project.discovery?.problem ||
      'Small startup founders struggle to turn rough product ideas into clear, differentiated brands quickly and affordably.'
  );
  const [valueProp, setValueProp] = useState(
    project.positioning?.value_proposition ||
      'Form verified, high-trust project crews in minutes, not weeks.'
  );
  const [differentiator, setDifferentiator] = useState(
    project.positioning?.differentiator ||
      'Work-style and schedule verification matching over resume padding'
  );

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateDecision(
        project.project_id,
        'positioning',
        {
          ...project.positioning,
          value_proposition: valueProp,
          differentiator: differentiator,
        }
      );
      onProjectUpdated(updated);
      setIsEditing(false);
    } catch {
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full pb-16">
        {/* Ambient Glows */}
        <div className="relative py-8 sm:py-12 overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-tertiary-container/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="font-label text-xs uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-surface-container-high border border-white/5 font-semibold">
                  Stage 03 / Strategy Core
                </span>
                <span className="text-outline text-xs">•</span>
                <span className="text-tertiary font-label text-xs flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  Synthesized from discovery
                </span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl text-on-surface tracking-tight font-bold">
                Your brand strategy
              </h1>
              <p className="font-body text-base text-on-surface-variant">
                Here's what we discovered about your idea.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-body text-sm shadow-sm border border-white/5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-on-surface transition-colors">
                  edit
                </span>
                <span>{isEditing ? 'Cancel Edit' : 'Edit strategy'}</span>
              </button>

              <button
                onClick={() => onNavigate(5)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary transition-all font-headline text-sm font-semibold shadow-md hover:shadow-xl hover:shadow-primary-container/20"
                type="button"
              >
                <span>Continue to Identity</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* CORE PROBLEM P0 CARD */}
          <div className="relative bg-surface-container-high rounded-xl p-6 sm:p-8 overflow-hidden shadow-xl mb-8 border border-white/5">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-primary-container"></div>
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[240px] text-on-surface">
                psychology
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="font-label text-xs uppercase tracking-widest text-primary font-bold px-2 py-0.5 rounded bg-surface-container-highest">
                    Core Problem
                  </span>
                  <span className="font-label text-xs text-outline">
                    P0 Validation Factor
                  </span>
                </div>

                {isEditing ? (
                  <textarea
                    rows={2}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-headline text-lg sm:text-xl rounded-lg p-3 outline-none border border-primary/40"
                  />
                ) : (
                  <p className="font-headline text-xl sm:text-2xl text-on-surface leading-snug font-semibold">
                    {problem}
                  </p>
                )}

                <div className="p-3.5 rounded-lg bg-surface-container-lowest/80 border border-white/5 flex items-start gap-2.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                    crisis_alert
                  </span>
                  <span>
                    <strong>Friction insight:</strong> Fear of uncommitted partners leads to abandoned
                    hackathons, delayed portfolios, and lower grades.
                  </span>
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end justify-between p-4 rounded-xl bg-surface-container-low border border-white/5 shrink-0">
                <span className="font-label text-xs uppercase text-outline">
                  Consensus Score
                </span>
                <span className="font-headline text-3xl font-bold text-tertiary">
                  94% Fit
                </span>
                <span className="text-[11px] text-on-surface-variant font-label">
                  Derived from 42 survey signals
                </span>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN BENTO: Target User vs Positioning Vectors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Target User & Problem Landscape */}
            <div className="bg-surface-container rounded-xl p-6 sm:p-8 shadow-md border border-white/5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                  01 / Target Audience Ecosystem
                </span>
                <span className="font-label text-xs text-secondary font-semibold">
                  High Intent
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="font-headline text-xl text-on-surface font-semibold">
                  {project.discovery?.target_user || 'Early-stage startup founders and small teams'}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {project.discovery?.context || 'Founders often have a strong product idea but lack dedicated brand strategy resources and need to move from concept to launch quickly.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Startup Founders',
                    'Solo Creators',
                    'Pre-seed Teams',
                    'Indie Hackers',
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label text-xs border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-container-low border border-white/5 space-y-2">
                <span className="font-label text-xs text-outline uppercase tracking-wider font-semibold">
                  Key Context & Friction
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {project.discovery?.context || 'Founders often have a strong product idea but lack dedicated brand strategy resources and need to move from concept to launch quickly.'}
                </p>
              </div>
            </div>

            {/* Right: Positioning & Differentiators */}
            <div className="bg-surface-container rounded-xl p-6 sm:p-8 shadow-md border border-white/5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                  02 / Positioning & Defensibility
                </span>
                <span className="font-label text-xs text-tertiary font-semibold">
                  Unfair Advantage
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="font-label text-xs uppercase text-outline">
                    Product Category
                  </span>
                  <p className="font-headline text-lg text-on-surface font-semibold mt-1">
                    Student Collaboration & Crew Formation Platform
                  </p>
                </div>

                <div>
                  <span className="font-label text-xs uppercase text-outline">
                    Core Differentiator
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={differentiator}
                      onChange={(e) => setDifferentiator(e.target.value)}
                      className="w-full mt-1 bg-surface-container-low text-on-surface font-body text-sm rounded-lg p-2.5 outline-none border border-primary/40"
                    />
                  ) : (
                    <p className="font-body text-sm text-on-surface-variant mt-1">
                      {differentiator}
                    </p>
                  )}
                </div>

                <div>
                  <span className="font-label text-xs uppercase text-outline">
                    Value Proposition
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={valueProp}
                      onChange={(e) => setValueProp(e.target.value)}
                      className="w-full mt-1 bg-surface-container-low text-on-surface font-body text-sm rounded-lg p-2.5 outline-none border border-primary/40"
                    />
                  ) : (
                    <p className="font-body text-sm text-on-surface font-semibold mt-1 text-primary">
                      "{valueProp}"
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline text-sm font-semibold hover:bg-primary transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving Decisions...' : 'Save Strategy Edits'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
