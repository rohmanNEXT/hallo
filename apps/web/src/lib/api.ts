import axios from 'axios';

// Konfigurasi default axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatSettingsApi = {
  getSettings: async () => {
    try {
      const { data } = await api.get('/chat-settings');
      return data;
    } catch (error) {
      console.error('Error fetching chat settings:', error);
      throw error;
    }
  },
  
  updateSettings: async (payload: any) => {
    try {
      const { data } = await api.post('/chat-settings', payload);
      return data.data;
    } catch (error) {
      console.error('Error updating chat settings:', error);
      throw error;
    }
  }
};

export default api;
