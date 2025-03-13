// src/api/uploadService.js
import api from './api';
import { API_CONFIG } from '../config';

export const UpdateService = {
  startSession: async (params) => {
    return await api.post(API_CONFIG.ENDPOINTS.START, params);
  },

  getInfo: async () => {
    return await api.get(API_CONFIG.ENDPOINTS.INFO);
  },

  getPreview: async (id) => {
    return await api.get(`${API_CONFIG.ENDPOINTS.PREVIEW}/${id}`);
  },

  uploadText: async (text) => {
    console.log(API_CONFIG.ENDPOINTS.UPLOAD)
    return await api.post(API_CONFIG.ENDPOINTS.UPLOAD, {
      text: text // 요청 본문 구조 백엔드와 일치하게
    });
  }
};