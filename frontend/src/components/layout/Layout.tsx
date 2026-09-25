import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProjectData } from '../../types/project';

interface LayoutProps {
  project: ProjectData;
  currentScreen: number;
  onNavigate: (screen: number) => void;
  onExport: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  project,
  currentScreen,
  onNavigate,
  onExport,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-white">
      {/* Mobile top bar toggle button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed bottom-4 right-4 z-50 lg:hidden p-3 rounded-full bg-primary-container text-on-primary-container shadow-2xl shadow-primary-container/40 flex items-center justify-center focus:outline-none"
        aria-label="Open Navigation Menu"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>

      {/* Sidebar */}
      <Sidebar
        project={project}
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Header */}
      <Header
        project={project}
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        onExport={onExport}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
