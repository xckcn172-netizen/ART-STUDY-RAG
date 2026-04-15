import axios from 'axios';

// 动态获取API地址，支持Vercel部署
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : `${window.location.origin}/api`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 卡片相关API
export const cardApi = {
  getCards: (params?: { difficulty?: string; tag?: string; limit?: number }) =>
    api.get('/api/cards', { params }),

  getCard: (id: string) => api.get(`/api/cards/${id}`),

  createCard: (data: {
    topic: string;
    question?: string;
    answer?: string;
    difficulty?: string;
    tags?: string[];
  }) => api.post('/api/cards', data),

  generateCards: (data: {
    topic: string;
    difficulty?: string;
    num_questions?: number;
  }) => api.post('/api/cards/generate', data),

  updateCard: (id: string, data: any) => api.put(`/api/cards/${id}`, data),

  deleteCard: (id: string) => api.delete(`/api/cards/${id}`),
};

// 测验相关API
export const quizApi = {
  createQuiz: (data: { card_ids?: string[]; num_cards?: number }) =>
    api.post('/api/quiz', data),

  getQuiz: (id: string) => api.get(`/api/quiz/${id}`),

  submitQuiz: (data: { session_id: string; answers: any[] }) =>
    api.post('/api/quiz/submit', data),

  getStats: () => api.get('/api/quiz/stats/overview'),

  deleteQuiz: (id: string) => api.delete(`/api/quiz/${id}`),
};

export default api;
