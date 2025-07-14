import type { EntityFormData } from '@/types/characterSchema';
import api from '../lib/axiosConfig';
import type { PlayerCharacterFormData } from '@/types/playerCharacterSchema';

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
  folderId: number;
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
  folderId: number;
};

export type UpdateNoteRequest = {
  title?: string;
  content?: string;
};

export type MoveItemRequest = {
  itemId: number;
  toFolderId: number;
  newPosition: number;
}

export type GetItemRequest = {
    itemId: number;
}

export type AddEntityToFolderRequest = {
    entityId: number;
    folderId: number;
    position?: number;
}



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


  // folder item calls
  moveItem: async (data: MoveItemRequest) => {
    await api.patch('/folder/move', data);
  },

  getItem: async (data: GetItemRequest) => {
    const response = await api.get(`/folder/item/${data.itemId}`);
    return response.data;
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

  getNote: async (noteId: number) => {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
  },

  // character creation/insertion calls
  // entity calls
  createEntity: async (data: EntityFormData) => {
    await api.post(`/entity`, data)
  },

  getEntity: async (entityId: number) => {
    const response = await api.get(`/entity/${entityId}`);
    return response.data;
  },

  getEntitySummary: async (entityId: number) => {
    const response = await api.get(`/entity/${entityId}/summary`);
    return response.data; // get partial data object of entity
  },

  deleteEntity: async (entityId: number) => {
    await api.delete(`/entity/${entityId}`);
  },

  updateEntity: async (entityId: number, data: PlayerCharacterFormData | EntityFormData) => {
    await api.patch(`/entity/${entityId}`, data);
  },

  addEntityToFolder: async (data: AddEntityToFolderRequest) => {
    await api.post(`/entity/folder`, data);
  },

  getEntityIds: async (userId: number) => {
    const response = await api.get(`/entity/user/${userId}`);
    return response.data; // returns array of entity ids linked to user 
  }
  
};