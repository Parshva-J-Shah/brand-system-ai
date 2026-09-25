import React from 'react';
import { ProjectData } from '../../types/project';

interface SidebarProps {
  project: ProjectData;
  currentScreen: number;
  onNavigate: (screen: number) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  screen: number;
  title: string;
  icon: string;
  stageBadge?: string;
}

const navItems: NavItem[] = [
  { screen: 1, title: 'Overview', icon: 'space_dashboard' },
  { screen: 2, title: 'Idea Input', icon: 'tune', stageBadge: '01' },
  { screen: 3, title: 'Workflow', icon: 'account_tree', stageBadge: '02' },
  { screen: 4, title: 'Strategy', icon: 'lightbulb', stageBadge: '03' },
  { screen: 5, title: 'Identity', icon: 'fingerprint', stageBadge: '04' },
  { screen: 6, title: 'Visual Direction', icon: 'palette', stageBadge: '05' },
  { screen: 7, title: 'Critique', icon: 'rate_review', stageBadge: '06' },
  { screen: 8, title: 'Consistency', icon: 'verified', stageBadge: '07' },
  { screen: 9, title: 'Brand Kit', icon: 'folder_special', stageBadge: 'FINAL' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  project,
  currentScreen,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const projectName = project.name || 'CampusCrew';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest flex flex-col z-50 shadow-[0_1px_8px_rgba(0,0,0,0.3)] border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-bold shadow-md shadow-primary-container/20">
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-base text-on-surface tracking-tight leading-tight">
              Founder-to-Launch
            </span>
            <span className="font-label text-[10px] uppercase tracking-wider text-outline">
              Brand Intelligence Agent
            </span>
          </div>
        </div>

        {/* Project Card Pill */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container rounded-lg border border-white/5 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-tertiary flex-shrink-0 animate-pulse"></span>
              <span className="font-label text-sm text-on-surface font-semibold truncate">
                {projectName}
              </span>
            </div>
            <span className="font-label text-[10px] uppercase text-outline px-1.5 py-0.5 rounded bg-surface-container-highest">
              {project.status === 'COMPLETED' ? 'Ready' : 'Active'}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => {
                  onNavigate(item.screen);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all text-left text-sm ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-on-primary-container' : 'text-outline'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.title}</span>
                </div>
                {item.stageBadge && (
                  <span
                    className={`font-label text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    {item.stageBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info: Connected Engine status */}
        <div className="p-4 border-t border-white/5 bg-surface-container-low/50">
          <div className="flex items-center justify-between text-xs text-outline font-label">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span>FastAPI Backend</span>
            </div>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
              v1.0.4
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
