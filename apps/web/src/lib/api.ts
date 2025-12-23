import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string; companyName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Interviews API
export const interviewsApi = {
  list: () => api.get('/interviews'),
  get: (id: string) => api.get(`/interviews/${id}`),
  create: (data: any) => api.post('/interviews', data),
  update: (id: string, data: any) => api.put(`/interviews/${id}`, data),
  delete: (id: string) => api.delete(`/interviews/${id}`),
  statistics: () => api.get('/interviews/statistics'),
};

// Candidates API
export const candidatesApi = {
  invite: (interviewId: string, data: { email: string; name: string; phone?: string }) =>
    api.post(`/candidates/invite/${interviewId}`, data),
  bulkInvite: (interviewId: string, candidates: any[]) =>
    api.post(`/candidates/bulk-invite/${interviewId}`, { candidates }),
  list: (interviewId: string) => api.get(`/candidates/interview/${interviewId}`),
  get: (id: string) => api.get(`/candidates/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/candidates/${id}/status`, { status }),
  updateEvaluation: (id: string, data: any) =>
    api.put(`/candidates/${id}/evaluation`, data),
};

// Public API (for candidates taking interviews)
export const publicApi = {
  getInterview: (token: string) => api.get(`/public/interview/${token}`),
  startInterview: (token: string, deviceInfo?: any) =>
    api.post(`/public/interview/${token}/start`, { deviceInfo }),
  completeInterview: (token: string) =>
    api.post(`/public/interview/${token}/complete`),
  submitResponse: (token: string, questionId: string, data: any) =>
    api.post(`/public/responses/${token}/${questionId}`, data),
  reportBehavior: (token: string, data: any) =>
    api.post(`/public/interview/${token}/suspicious-behavior`, data),
};

// Upload API
export const uploadApi = {
  getPresignedUrl: (data: {
    candidateId: string;
    questionId: string;
    fileType: 'video' | 'audio';
    contentType: string;
  }) => api.post('/upload/presigned-url', data),
};

