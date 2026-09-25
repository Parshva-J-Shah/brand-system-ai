import { useState, useEffect } from 'react';
import { ProjectData } from './types/project';
import { api } from './services/api';
import { mockProject } from './data/mockData';
import { Layout } from './components/layout/Layout';

// 9 Screens
import { LandingPage } from './pages/LandingPage';
import { IdeaInputPage } from './pages/IdeaInputPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { StrategyPage } from './pages/StrategyPage';
import { BrandIdentityPage } from './pages/BrandIdentityPage';
import { VisualDirectionPage } from './pages/VisualDirectionPage';
import { CritiquePage } from './pages/CritiquePage';
import { ConsistencyPage } from './pages/ConsistencyPage';
import { BrandKitPage } from './pages/BrandKitPage';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [project, setProject] = useState<ProjectData>(mockProject);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load project on mount
  useEffect(() => {
    async function init() {
      try {
        const activeId = api.getActiveProjectId();
        const data = await api.getProject(activeId);
        setProject(data);
      } catch {
        setProject(mockProject);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    const exportData = {
      project_id: project.project_id,
      name: project.name || 'CampusCrew',
      exported_at: new Date().toISOString(),
      brand_summary: project.delivery?.brand_summary,
      one_line_pitch: project.delivery?.one_line_pitch,
      tagline: project.shape?.tagline,
      personality: project.shape?.personality,
      voice_guide: project.delivery?.voice_guide,
      visual_brief: project.delivery?.visual_brief,
      marketing: {
        headline: project.delivery?.landing_page_headline,
        launch_message: project.delivery?.launch_message,
        social_post: project.delivery?.social_post,
      },
      strategy: {
        discovery: project.discovery,
        positioning: project.positioning,
      },
      consistency_score: project.consistency?.score || 100,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'Brand'}_Kit_v1.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Brand Kit exported successfully!');
  };

  const handleNavigate = (screenNumber: number) => {
    if (screenNumber >= 1 && screenNumber <= 9) {
      setCurrentScreen(screenNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProjectCreated = (newProject: ProjectData) => {
    setProject(newProject);
    showToast(`Project created: ${newProject.name || 'New Brand'}`);
  };

  const handleProjectUpdated = (updatedProject: ProjectData) => {
    setProject(updatedProject);
    showToast('Brand decisions saved');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-primary-container border-t-primary rounded-full animate-spin"></div>
        <p className="font-label text-sm text-outline tracking-wider uppercase">
          Initializing Brand Intelligence Agent...
        </p>
      </div>
    );
  }

  return (
    <Layout
      project={project}
      currentScreen={currentScreen}
      onNavigate={handleNavigate}
      onExport={handleExport}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-surface-container-highest border border-primary/40 text-on-surface text-xs font-label shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-tertiary text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Routing */}
      {currentScreen === 1 && (
        <LandingPage project={project} onNavigate={handleNavigate} />
      )}

      {currentScreen === 2 && (
        <IdeaInputPage
          project={project}
          onNavigate={handleNavigate}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {currentScreen === 3 && (
        <WorkflowPage
          project={project}
          onNavigate={handleNavigate}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {currentScreen === 4 && (
        <StrategyPage
          project={project}
          onNavigate={handleNavigate}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {currentScreen === 5 && (
        <BrandIdentityPage
          project={project}
          onNavigate={handleNavigate}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {currentScreen === 6 && (
        <VisualDirectionPage project={project} onNavigate={handleNavigate} />
      )}

      {currentScreen === 7 && (
        <CritiquePage project={project} onNavigate={handleNavigate} />
      )}

      {currentScreen === 8 && (
        <ConsistencyPage project={project} onNavigate={handleNavigate} />
      )}

      {currentScreen === 9 && (
        <BrandKitPage
          project={project}
          onNavigate={handleNavigate}
          onExport={handleExport}
        />
      )}
    </Layout>
  );
}

export default App;
