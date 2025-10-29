import { axiosInstance } from '../../services/axiosInstance';

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';

export interface ProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
}

export interface ProjectResponse {
  id: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  async list(params?: { status?: ProjectStatus; userId?: string }): Promise<ProjectResponse[]> {
    const { data } = await axiosInstance.get<ProjectResponse[]>('/projects', {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<ProjectResponse> {
    const { data } = await axiosInstance.get<ProjectResponse>(`/projects/${id}`);
    return data;
  },

  async create(body: ProjectRequest): Promise<ProjectResponse> {
    const { data } = await axiosInstance.post<ProjectResponse>('/projects', body);
    return data;
  },

  async update(id: string, body: Partial<ProjectRequest>): Promise<ProjectResponse> {
    const { data } = await axiosInstance.put<ProjectResponse>(`/projects/${id}`, body);
    return data;
  },

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/projects/${id}`);
  },
};


