import React from 'react';
import { ProjectData } from '../../types/project';

interface HeaderProps {
  project: ProjectData;
  currentScreen: number;
  onNavigate: (screen: number) => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  currentScreen,
  onNavigate,
  onExport,
}) => {
  // Calculate completed stages
  const stageCount = project.completed_stages?.length || 4;
  const projectName = project.name || 'CampusCrew';

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl z-40 px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.25)] border-b border-white/5">
      {/* Left: Breadcrumbs & Progress */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label text-xs sm:text-sm">
          <button
            onClick={() => onNavigate(1)}
            className="text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            Ventures
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline">
            chevron_right
          </span>
          <span className="text-on-surface font-semibold truncate max-w-[120px] sm:max-w-[200px]">
            {projectName}
          </span>
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-outline-variant/40"></div>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-tertiary font-label text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          <span>
            {currentScreen === 9
              ? '7 of 7 Stages Complete'
              : `${Math.min(stageCount, 7)} of 7 Stages Complete`}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => onNavigate(3)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label text-xs"
          type="button"
          title="View Generation Workflow"
        >
          <span className="material-symbols-outlined text-[16px] text-outline">
            history
          </span>
          Audit Trail
        </button>

        <button
          onClick={() => onNavigate(7)}
          className="flex items-center justify-center p-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative"
          type="button"
          title="Critic Alerts"
        >
          <span className="material-symbols-outlined text-[18px]">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"></span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all font-label text-xs sm:text-sm font-semibold shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            download
          </span>
          <span>Export</span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center pl-1">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest ring-1 ring-white/10 flex items-center justify-center text-primary font-bold text-xs">
            CC
          </div>
        </div>
      </div>
    </header>
  );
};
