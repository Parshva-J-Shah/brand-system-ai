import {
  ProjectData,
  ProjectInput,
  ApiStatusResponse,
  WorkflowStatus,
  StageKey,
} from '../types/project';
import { mockProject } from '../data/mockData';

const BASE_URL = '/api';

class ApiService {
  private isBackendAvailable: boolean | null = null;
  private localProjects: Map<string, ProjectData> = new Map();

  constructor() {
    // Initialize local storage project if exists
    try {
      const saved = localStorage.getItem('brand_system_active_project');
      if (saved) {
        const parsed = JSON.parse(saved) as ProjectData;
        this.localProjects.set(parsed.project_id, parsed);
      } else {
        this.localProjects.set(mockProject.project_id, { ...mockProject });
      }
    } catch {
      this.localProjects.set(mockProject.project_id, { ...mockProject });
    }
  }

  /**
   * Health check to detect backend availability
   */
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BASE_URL}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch {
      this.isBackendAvailable = false;
      return false;
    }
  }

  /**
   * 1. Create a new project
   * POST /api/projects
   */
  async createProject(
    input: ProjectInput
  ): Promise<{ project_id: string; status: WorkflowStatus }> {
    if (this.isBackendAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (res.ok) {
          const data = await res.json();
          this.isBackendAvailable = true;
          return data;
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }

    // Mock fallback
    const projectId = 'proj_' + Math.random().toString(36).substring(2, 9);
    const newProject: ProjectData = {
      ...mockProject,
      project_id: projectId,
      name: input.idea.slice(0, 20) || 'New Brand Project',
      status: 'DRAFT',
      completed_stages: [],
      input,
    };

    this.localProjects.set(projectId, newProject);
    this.saveActiveProjectLocally(newProject);

    return {
      project_id: projectId,
      status: 'DRAFT',
    };
  }

  /**
   * 2. Start workflow generation
   * POST /api/projects/{project_id}/generate
   */
  async startWorkflow(
    projectId: string
  ): Promise<{ project_id: string; status: WorkflowStatus }> {
    if (this.isBackendAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/generate`, {
          method: 'POST',
        });

        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }

    // Mock fallback: set status to DISCOVERING
    const proj = this.localProjects.get(projectId) || {
      ...mockProject,
      project_id: projectId,
    };
    proj.status = 'DISCOVERING';
    this.localProjects.set(projectId, proj);
    this.saveActiveProjectLocally(proj);

    return {
      project_id: projectId,
      status: 'DISCOVERING',
    };
  }

  /**
   * 3. Get workflow status
   * GET /api/projects/{project_id}/status
   */
  async getWorkflowStatus(projectId: string): Promise<ApiStatusResponse> {
    if (this.isBackendAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/status`);
        if (res.ok) {
          return await res.json();
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }

    // Mock fallback
    const proj = this.localProjects.get(projectId) || mockProject;
    return {
      status: proj.status,
      completed_stages: proj.completed_stages || [
        'discovery',
        'positioning',
        'shape',
        'visual',
      ],
    };
  }

  /**
   * 4. Get full project result
   * GET /api/projects/{project_id}
   */
  async getProject(projectId: string): Promise<ProjectData> {
    if (this.isBackendAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          this.localProjects.set(projectId, data);
          this.saveActiveProjectLocally(data);
          return data;
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }

    // Mock fallback
    const proj = this.localProjects.get(projectId);
    if (proj) {
      return proj;
    }

    // Default to mockProject with requested ID
    const fallback: ProjectData = {
      ...mockProject,
      project_id: projectId,
    };
    this.localProjects.set(projectId, fallback);
    return fallback;
  }

  /**
   * 5. Update a decision
   * PATCH /api/projects/{project_id}/decisions
   */
  async updateDecision(
    projectId: string,
    field: string,
    value: unknown
  ): Promise<ProjectData> {
    if (this.isBackendAvailable !== false) {
      try {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/decisions`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field, value }),
        });
        if (res.ok) {
          const updated = await res.json();
          this.saveActiveProjectLocally(updated);
          return updated;
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }

    // Mock fallback update
    const proj = await this.getProject(projectId);
    const updated = { ...proj };

    if (field === 'personality' && updated.shape) {
      updated.shape = {
        ...updated.shape,
        personality: Array.isArray(value)
          ? value.map((v) =>
              typeof v === 'string'
                ? { trait: v, reason: 'Customized by user' }
                : v
            )
          : updated.shape.personality,
      };
    } else if (field === 'tagline' && updated.shape) {
      updated.shape.tagline = String(value);
      if (updated.delivery) updated.delivery.tagline = String(value);
    } else if (field === 'selected_naming_direction' && updated.delivery) {
      updated.delivery.selected_naming_direction = String(value);
      updated.name = String(value);
    }

    this.localProjects.set(projectId, updated);
    this.saveActiveProjectLocally(updated);
    return updated;
  }

  saveActiveProjectLocally(project: ProjectData): void {
    try {
      localStorage.setItem(
        'brand_system_active_project',
        JSON.stringify(project)
      );
      localStorage.setItem('brand_system_active_id', project.project_id);
    } catch {
      // storage unavailable
    }
  }

  getActiveProjectId(): string {
    try {
      return (
        localStorage.getItem('brand_system_active_id') || mockProject.project_id
      );
    } catch {
      return mockProject.project_id;
    }
  }
}

export const api = new ApiService();
