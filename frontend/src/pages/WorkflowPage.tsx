import React, { useEffect, useState, useRef } from 'react';
import { ProjectData, WorkflowStatus, StageKey } from '../types/project';
import { api } from '../services/api';

interface WorkflowPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
  onProjectUpdated: (updatedProject: ProjectData) => void;
}

interface StageStep {
  key: StageKey;
  number: string;
  name: string;
  label: string;
  screenTarget: number;
}

const stages: StageStep[] = [
  { key: 'discovery', number: '01', name: 'Discover', label: 'Locked', screenTarget: 4 },
  { key: 'positioning', number: '02', name: 'Position', label: 'Aligned', screenTarget: 4 },
  { key: 'shape', number: '03', name: 'Shape', label: 'Framed', screenTarget: 5 },
  { key: 'visual', number: '04', name: 'Visualize', label: 'Active', screenTarget: 6 },
  { key: 'critique', number: '05', name: 'Challenge', label: 'Queued', screenTarget: 7 },
  { key: 'consistency', number: '06', name: 'Consistency', label: 'Queued', screenTarget: 8 },
  { key: 'delivery', number: '07', name: 'Deliver', label: 'Queued', screenTarget: 9 },
];

export const WorkflowPage: React.FC<WorkflowPageProps> = ({
  project,
  onNavigate,
  onProjectUpdated,
}) => {
  const [status, setStatus] = useState<WorkflowStatus>(project.status || 'VISUALIZING');
  const [currentStepIndex, setCurrentStepIndex] = useState(3); // Stage 4 Visualize
  const [progressPercent, setProgressPercent] = useState(57);
  const [logs, setLogs] = useState<string[]>([
    '⚡ Initializing Founder-to-Launch Intelligence Pipeline...',
    '✓ Discovery Agent completed: Core problem isolated.',
    '✓ Positioning Agent completed: Competitive angle validated.',
    '✓ Brand Shape Agent completed: 4 personality pillars structured.',
    '⟳ Visual Direction Agent active: Generating color palette & typography stack...',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Trigger workflow generation if DRAFT or requested
  useEffect(() => {
    if (!hasTriggeredRef.current && (project.status === 'DRAFT' || project.status === 'DISCOVERING')) {
      hasTriggeredRef.current = true;
      runGeneration();
    }
  }, [project.project_id, project.status]);

  const runGeneration = async () => {
    setIsGenerating(true);
    setStatus('DISCOVERING');

    try {
      await api.startWorkflow(project.project_id);

      // Simulation sequence for smooth demo visuals
      const sequence: Array<{ status: WorkflowStatus; idx: number; pct: number; log: string }> = [
        { status: 'DISCOVERING', idx: 0, pct: 14, log: '⟳ Analyzing target user friction and problem vectors...' },
        { status: 'POSITIONING', idx: 1, pct: 28, log: '✓ Discovery locked. Running competitive positioning matrix...' },
        { status: 'SHAPING', idx: 2, pct: 42, log: '✓ Positioning aligned. Formulating personality & voice guide...' },
        { status: 'VISUALIZING', idx: 3, pct: 57, log: '✓ Shape framed. Calibrating design tokens and typography...' },
        { status: 'CHALLENGING', idx: 4, pct: 71, log: '✓ Visual brief locked. Triggering automated anti-generic critic...' },
        { status: 'DELIVERING', idx: 5, pct: 85, log: '✓ Critic validated. Running 5-pillar consistency coherence test...' },
        { status: 'COMPLETED', idx: 6, pct: 100, log: '✓ All stages verified! Final Brand Kit ready for production.' },
      ];

      for (let i = 0; i < sequence.length; i++) {
        const item = sequence[i];
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus(item.status);
        setCurrentStepIndex(item.idx);
        setProgressPercent(item.pct);
        setLogs((prev) => [...prev, item.log]);
      }

      const refreshed = await api.getProject(project.project_id);
      onProjectUpdated({ ...refreshed, status: 'COMPLETED' });
    } catch {
      setStatus('ERROR');
      setLogs((prev) => [...prev, '❌ AI_STAGE_FAILED: Generation interrupted.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualReRun = () => {
    setLogs(['⚡ Restarting full intelligence pipeline...']);
    runGeneration();
  };

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full pb-16">
        {/* Atmospheric Glow */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-b from-primary-container/10 via-primary/5 to-transparent blur-3xl pointer-events-none rounded-full"></div>

          {/* Header & Phase Meta */}
          <div className="relative max-w-5xl mx-auto pt-8 flex flex-col items-center text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface shadow-sm border border-white/5">
              <span className="relative flex h-2 w-2">
                {status !== 'COMPLETED' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    status === 'COMPLETED'
                      ? 'bg-tertiary'
                      : status === 'ERROR'
                      ? 'bg-error'
                      : 'bg-primary'
                  }`}
                ></span>
              </span>
              <span className="font-label text-xs sm:text-sm tracking-wider uppercase text-on-surface-variant font-medium">
                {status === 'COMPLETED'
                  ? 'All 7 Stages Complete'
                  : `Stage ${currentStepIndex + 1} of 7 in Progress`}
              </span>
              <span className="text-outline-variant font-label text-xs">•</span>
              <span className="font-label text-xs sm:text-sm text-primary font-semibold">
                {progressPercent}% Synthesized
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 font-headline text-3xl sm:text-5xl text-on-surface tracking-tight font-bold">
              Building your brand
            </h1>
            <p className="mt-2 font-body text-base sm:text-lg text-on-surface-variant max-w-xl">
              Your idea is moving through seven creative stages.
            </p>

            {/* Smooth Progress Bar */}
            <div className="w-full max-w-md mt-6 bg-surface-container-highest h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="bg-gradient-to-r from-tertiary via-primary-container to-primary h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* 7-Stage Creative Workflow Stepper */}
          <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-4">
            <div className="relative bg-surface-container-low rounded-xl p-4 sm:p-6 shadow-sm border border-white/5">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 relative z-10">
                {stages.map((stg, i) => {
                  const isDone = i < currentStepIndex || status === 'COMPLETED';
                  const isActive = i === currentStepIndex && status !== 'COMPLETED';
                  return (
                    <button
                      key={stg.key}
                      onClick={() => onNavigate(stg.screenTarget)}
                      className="flex flex-col items-center group cursor-pointer text-center"
                    >
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-tertiary-container/30 text-tertiary shadow-sm'
                            : isActive
                            ? 'bg-primary-container text-white shadow-[0_0_16px_rgba(128,131,255,0.4)] scale-105'
                            : 'bg-surface-container-highest text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                          {isDone ? 'check' : isActive ? 'sync' : 'hourglass_empty'}
                        </span>
                      </div>
                      <span
                        className={`mt-2 font-label text-[10px] sm:text-xs tracking-wider font-semibold ${
                          isDone
                            ? 'text-tertiary'
                            : isActive
                            ? 'text-primary'
                            : 'text-outline'
                        }`}
                      >
                        {stg.number}
                      </span>
                      <span className="font-body text-xs sm:text-sm text-on-surface font-medium truncate max-w-full">
                        {stg.name}
                      </span>
                      <span className="font-label text-[10px] text-outline hidden sm:block">
                        {isDone ? 'Locked' : isActive ? 'Active' : 'Queued'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Stage Detail & Terminal Stream */}
          <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Active Stage Card */}
            <div className="lg:col-span-7 bg-surface-container rounded-xl p-6 sm:p-8 shadow-xl border border-white/5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                    Current Execution Module
                  </span>
                </div>
                <span className="font-label text-xs text-primary font-semibold">
                  Stage 0{currentStepIndex + 1} / 07
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-headline text-2xl text-on-surface font-bold">
                  {stages[currentStepIndex]?.name || 'Synthesizing'}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Extracting strategic brand vectors from input prompt. Calibrating user
                  archetypes, market positioning, and anti-generic differentiators.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate(4)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-md"
                >
                  <span>View Generated Strategy</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                <button
                  onClick={handleManualReRun}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-label text-xs border border-white/5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                  <span>{isGenerating ? 'Synthesizing...' : 'Re-Run Pipeline'}</span>
                </button>
              </div>
            </div>

            {/* Live Terminal Stream Card */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-5 shadow-xl border border-white/5 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-outline pb-2 border-b border-white/5">
                <span className="font-label uppercase tracking-widest text-[10px]">
                  Agent Reasoning Telemetry
                </span>
                <span className="text-tertiary flex items-center gap-1 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  STREAMING
                </span>
              </div>

              <div className="h-56 overflow-y-auto space-y-2 text-xs text-on-surface-variant pr-1">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`leading-relaxed ${
                      log.startsWith('✓')
                        ? 'text-tertiary'
                        : log.startsWith('⟳')
                        ? 'text-primary'
                        : log.startsWith('❌')
                        ? 'text-error'
                        : 'text-on-surface'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
