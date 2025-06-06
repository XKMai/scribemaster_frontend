import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

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

  getFolder: async (folderId: number) => {
    const response = await axios.get(`${BASE_URL}/folder/${folderId}`);
    return response.data;
  },

  createFolder: async (data: CreateFolderRequest) => {
    const response = await axios.post(`${BASE_URL}/folder`, data);
    return response.data;
  },

  deleteFolder: async (folderId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/folder/${folderId}`);
  },

  createNote: async (data: CreateNoteRequest) => {
    const response = await axios.post(`${BASE_URL}/notes`, data);
    return response.data;
  },

  updateNote: async (noteId: number, data: UpdateNoteRequest) => {
    const response = await axios.patch(`${BASE_URL}/notes/${noteId}`, data);
    return response.data;
  },

  deleteNote: async (noteId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/notes/${noteId}`);
  },
};