import { axiosInstance } from '../../services/axiosInstance';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; // ISO
  projectId: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const tasksApi = {
  async list(params?: { projectId?: string; status?: TaskStatus; priority?: TaskPriority; userId?: string }): Promise<TaskResponse[]> {
    const { data } = await axiosInstance.get<TaskResponse[]>('/tasks', { params });
    return data;
  },
  async getById(id: string): Promise<TaskResponse> {
    const { data } = await axiosInstance.get<TaskResponse>(`/tasks/${id}`);
    return data;
  },
  async create(body: TaskRequest): Promise<TaskResponse> {
    const { data } = await axiosInstance.post<TaskResponse>('/tasks', body);
    return data;
  },
  async update(id: string, body: Partial<TaskRequest>): Promise<TaskResponse> {
    const { data } = await axiosInstance.put<TaskResponse>(`/tasks/${id}`, body);
    return data;
  },
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`);
  },
};



