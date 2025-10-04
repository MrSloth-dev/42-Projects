import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session authentication
});

export type Language = {
  name: string;
  display_name: string;
};

export type Specialization = {
  name: string;
  display_name: string;
};

export type Project = {
  id: number;
  project_id: number;
  name: string;
  slug: string;
  description: string;
  parent_name: string | null;
  objectives: string[];
  estimate_time: number | null;
  solo: boolean;
  xp_points: number | null;
  prerequisites: string[];
  subject_download_url: string | null;
  languages: Language[];
  specializations: Specialization[];
  created_at: string;
  updated_at: string;
};

export type ProjectsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
};

export const projectsApi = {
  getProjects: (params?: {
    search?: string;
    solo?: boolean;
    languages?: string;
    specializations?: string;
    ordering?: string;
  }) => api.get<ProjectsResponse>('/projects/', { params }), // Remove /api/ prefix
  getProject: (id: number) => api.get<Project>(`/projects/${id}/`),
};

export const authApi = {
  getAuthUrl: () => api.get(`/auth/login/`),
  getCurrentUser: () => api.get(`/auth/user/`),
  logout: () => api.post(`/auth/logout/`),
};

export default api;
