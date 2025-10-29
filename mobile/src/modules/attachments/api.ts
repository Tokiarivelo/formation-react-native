import { axiosInstance } from '../../services/axiosInstance';

export interface Attachment {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  projectId?: string;
  taskId?: string;
  url?: string;
  createdAt: string;
}

export const attachmentsApi = {
  async listByProject(projectId: string): Promise<Attachment[]> {
    const { data } = await axiosInstance.get('/attachments', { params: { projectId } });
    return data;
  },

  async uploadForProject(projectId: string, file: { uri: string; name: string; type: string }): Promise<Attachment> {
    const form = new FormData();
    // @ts-ignore React Native FormData typing
    form.append('file', { uri: file.uri, name: file.name, type: file.type });
    form.append('projectId', projectId);
    const { data } = await axiosInstance.post('/attachments/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async download(attachmentId: string): Promise<string> {
    const baseURL = axiosInstance.getInstance().defaults.baseURL || '';
    return `${baseURL}/attachments/${attachmentId}/download`;
  },
};


