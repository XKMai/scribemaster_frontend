import api from '../lib/axiosConfig';

export type NoteData = {
  id: number;
  title: string;
  content: string;
  createdBy: number;
};

export type FolderData = {
  id: number;
  name: string;
  isCampaign: boolean;
  settings: object;
  createdBy: number;
  items?: Item[];
};

export type Item = {
  id: number;
  type: "note" | "folder";
  refId: number;
  position: number;
  data: any;
};

export type CreateNoteRequest = {
  title: string;
  content: string;
  createdBy: number;
  folderId: number;
};

export type CreateFolderRequest = {
  name: string;
  createdBy: number;
  settings?: object;
  folderId?: number;
};

export type UpdateNoteRequest = {
  title?: string;
  content?: string;
};

export const apiService = {

  // cookie call
  getCookie: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  // campaign calls
  getCampaignList: async (userId: number) => {
    const response = await api.get(`/campaign/${userId}`);
    return response.data;
  },

  // folder calls
  getFolder: async (folderId: number) => {
    const response = await api.get(`/folder/${folderId}`);
    return response.data;
  },

  createFolder: async (data: CreateFolderRequest) => {
    const response = await api.post(`/folder`, data);
    return response.data;
  },

  updateFolder: async (folderId: number, data: { name: string }) => {
    const response = await api.patch(`/folder/${folderId}`, data);
    return response.data;
  },

  deleteFolder: async (folderId: number): Promise<void> => {
    await api.delete(`/folder/${folderId}`);
  },

  // note calls
  createNote: async (data: CreateNoteRequest) => {
    const response = await api.post(`/notes`, data);
    return response.data;
  },

  updateNote: async (noteId: number, data: UpdateNoteRequest) => {
    const response = await api.patch(`/notes/${noteId}`, data);
    return response.data;
  },

  deleteNote: async (noteId: number): Promise<void> => {
    await api.delete(`/notes/${noteId}`);
  },
};