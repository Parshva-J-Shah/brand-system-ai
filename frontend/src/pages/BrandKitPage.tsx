import React, { useState } from 'react';
import { ProjectData } from '../types/project';

interface BrandKitPageProps {
  project: ProjectData;
  onNavigate: (screen: number) => void;
  onExport: () => void;
}

export const BrandKitPage: React.FC<BrandKitPageProps> = ({
  project,
  onNavigate,
  onExport,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const delivery = project.delivery || {
    brand_summary:
      'CampusCrew is the complete brand system and strategic positioning for a high-trust collegiate teammate matching platform that turns isolated student ideas into launch-ready crews.',
    one_line_pitch:
      'The verified teammate matching platform for ambitious student creators and project builders.',
    selected_naming_direction: project.name || 'CampusCrew',
    tagline: 'Build better together.',
    personality: ['Confident', 'Energetic', 'Practical', 'Open'],
    voice_guide:
      'Direct, energetic, collegiate, and honest. We speak peer-to-peer with student builders, championing tangible execution over pedigree.',
    visual_brief:
      'Obsidian Night (#131317) surface architecture with Electric Indigo (#8083ff) and Verified Mint (#4edea3) accents, structured by Plus Jakarta Sans and Space Grotesk typography.',
    landing_page_headline: 'Turn your idea into a team that actually ships.',
    launch_message:
      'Stop building in isolation or gambling on uncommitted group chat partners. CampusCrew matches you with reliable teammates by work style, schedule, and verified skills.',
    social_post:
      'Tired of group projects where you do 90% of the work? We built CampusCrew so college builders can match with teammates who actually care as much as you do. Live on campus today: link in bio.',
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    const fullMarkdown = `# ${delivery.selected_naming_direction} - Complete Brand System

## One-Line Pitch
${delivery.one_line_pitch}

## Tagline
"${delivery.tagline}"

## Brand Summary
${delivery.brand_summary}

## Personality Traits
${delivery.personality.join(', ')}

## Voice & Demeanor
${delivery.voice_guide}

## Visual Identity Brief
${delivery.visual_brief}

## Launch Messaging Pack
- **Landing Headline**: ${delivery.landing_page_headline}
- **Launch Announcement**: ${delivery.launch_message}
- **Social Media Post**: ${delivery.social_post}
`;
    copyToClipboard(fullMarkdown, 'all');
  };

  return (
    <main className="flex-1 pt-16 w-full px-4 sm:px-8 bg-background">
      <div className="flex flex-col w-full pb-16">
        {/* Flagship Hero Card */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-lowest p-6 sm:p-10 shadow-xl mb-8 border border-white/5">
          <div className="absolute -top-32 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Banner Header & Actions */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-container text-tertiary shadow-sm border border-white/5">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </span>
              <div className="flex flex-col">
                <span className="font-label text-xs text-outline tracking-wider uppercase">
                  Stage 07 / Final Delivery
                </span>
                <span className="font-label text-xs sm:text-sm text-tertiary font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  System Verified & Production-Locked
                </span>
              </div>
            </div>

            {/* Action Suite */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={onExport}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-headline text-xs sm:text-sm font-semibold transition-all hover:opacity-95 hover:shadow-lg shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-y-0.5 transition-transform">
                  download
                </span>
                <span>Export Brand Kit</span>
              </button>

              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label text-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-outline">
                  {copiedKey === 'all' ? 'check' : 'content_copy'}
                </span>
                <span>{copiedKey === 'all' ? 'Copied!' : 'Copy All Assets'}</span>
              </button>

              <button
                onClick={() => {
                  copyToClipboard(window.location.href, 'share');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label text-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-outline">
                  {copiedKey === 'share' ? 'check' : 'share'}
                </span>
                <span>{copiedKey === 'share' ? 'Link Copied!' : 'Share Link'}</span>
              </button>

              <button
                onClick={() => onNavigate(2)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-surface-container-low text-outline hover:text-on-surface hover:bg-surface-container transition-colors font-label text-xs border border-white/5"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Start New Brand</span>
              </button>
            </div>
          </div>

          {/* Master Title Display */}
          <div className="relative z-10 space-y-3">
            <span className="font-label text-xs text-outline uppercase tracking-wider">
              Identity Specimen 01 / v1.0.4 Release
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
              <h1 className="font-headline text-4xl sm:text-6xl font-bold text-on-surface tracking-tight">
                {delivery.selected_naming_direction}
              </h1>
              <p className="font-headline text-xl sm:text-2xl text-primary font-semibold">
                "{delivery.tagline}"
              </p>
            </div>
            <p className="font-body text-base text-on-surface-variant max-w-3xl leading-relaxed pt-2">
              {delivery.brand_summary}
            </p>
          </div>
        </div>

        {/* Master Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Core Identity Components */}
          <div className="lg:col-span-8 space-y-6">
            {/* 01. One-Line Pitch */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                  01 / Core Elevator Pitch
                </span>
                <button
                  onClick={() => copyToClipboard(delivery.one_line_pitch, 'pitch')}
                  className="text-xs text-primary hover:underline font-label flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedKey === 'pitch' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-headline text-lg sm:text-xl text-on-surface font-semibold leading-relaxed">
                "{delivery.one_line_pitch}"
              </p>
            </div>

            {/* 02. Voice Guide & Personality */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4 shadow-md">
              <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                02 / Personality & Voice Guide
              </span>
              <div className="flex flex-wrap gap-2">
                {delivery.personality.map((trait, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-surface-container-high text-xs font-label text-primary font-semibold border border-white/5"
                  >
                    {trait}
                  </span>
                ))}
              </div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-lg border border-white/5">
                {delivery.voice_guide}
              </p>
            </div>

            {/* 03. Launch Marketing Pack */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-6 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                  03 / Launch Messaging Pack
                </span>
                <span className="font-label text-xs text-tertiary font-semibold">
                  Channel Ready
                </span>
              </div>

              {/* Landing Page Headline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-outline font-label">
                  <span>Landing Page Headline</span>
                  <button
                    onClick={() => copyToClipboard(delivery.landing_page_headline, 'headline')}
                    className="hover:text-primary flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">content_copy</span>
                    <span>{copiedKey === 'headline' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-low text-on-surface font-headline font-semibold text-base border border-white/5">
                  {delivery.landing_page_headline}
                </div>
              </div>

              {/* Launch Announcement */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-outline font-label">
                  <span>Launch Announcement</span>
                  <button
                    onClick={() => copyToClipboard(delivery.launch_message, 'launch')}
                    className="hover:text-primary flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">content_copy</span>
                    <span>{copiedKey === 'launch' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-low text-on-surface-variant font-body text-sm leading-relaxed border border-white/5">
                  {delivery.launch_message}
                </div>
              </div>

              {/* Social Media Post */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-outline font-label">
                  <span>Social Media Post (X / LinkedIn)</span>
                  <button
                    onClick={() => copyToClipboard(delivery.social_post, 'social')}
                    className="hover:text-primary flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">content_copy</span>
                    <span>{copiedKey === 'social' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-low text-on-surface-variant font-body text-sm leading-relaxed border border-white/5">
                  {delivery.social_post}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Design Brief & Export Specimen */}
          <div className="lg:col-span-4 space-y-6">
            {/* Visual Brief Card */}
            <div className="p-6 rounded-xl bg-surface-container border border-white/5 space-y-4 shadow-md">
              <span className="font-label text-xs uppercase tracking-wider text-outline font-semibold">
                Visual Brief
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-3.5 rounded-lg border border-white/5">
                {delivery.visual_brief}
              </p>

              <div className="space-y-2 pt-2">
                <span className="font-label text-xs text-outline uppercase">
                  Design Palette Tokens
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-surface-container-high text-center">
                    <div className="w-full h-8 rounded bg-[#8083ff] mb-1"></div>
                    <span className="text-[10px] font-mono text-outline">#8083ff</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-high text-center">
                    <div className="w-full h-8 rounded bg-[#0566d9] mb-1"></div>
                    <span className="text-[10px] font-mono text-outline">#0566d9</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-high text-center">
                    <div className="w-full h-8 rounded bg-[#4edea3] mb-1"></div>
                    <span className="text-[10px] font-mono text-outline">#4edea3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Previous Stages */}
            <div className="p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-3">
              <span className="font-label text-xs text-outline uppercase font-semibold">
                Inspect Source Stages
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate(4)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span>Stage 03 / Strategy Foundation</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => onNavigate(5)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span>Stage 04 / Identity Shape</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => onNavigate(6)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span>Stage 05 / Visual Direction</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => onNavigate(7)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span>Stage 06 / Critic Findings</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
