import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const fetchItems = async (parentId: number | null) => {
  const response = await axios.get(`${API_URL}/folder/`, { params: { parentId } });
  return response.data;
};

export const createFolder = async (itemData: any) => {
  const response = await axios.post(`${API_URL}/folder`, itemData);
  return response.data;
};

export const createNote = async (itemData: any) => {
  const response = await axios.post(`${API_URL}/notes`, itemData);
  return response.data;
};

export const updateNote = async (itemId: number, itemData: any) => {
  const response = await axios.put(`${API_URL}/notes/${itemId}`, itemData);
  return response.data;
};

export const deleteNote = async (itemId: number) => {
  await axios.delete(`${API_URL}/items/${itemId}`);
};