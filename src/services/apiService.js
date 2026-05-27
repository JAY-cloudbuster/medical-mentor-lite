import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const defineTerm = async (term) => {
  const response = await api.post('/define', { term });
  return response.data;
};

export const getRelatedTerms = async (term) => {
  const response = await api.post('/related', { term });
  return response.data;
};

export const getGraphData = async (term) => {
  const response = await api.post('/graph', { term });
  return response.data;
};

export const getExplanation = async (term) => {
  const response = await api.post('/explain', { term });
  return response.data;
};

export const getYoutubeVideos = async (term) => {
  const response = await api.get(`/youtube?term=${encodeURIComponent(term)}`);
  return response.data;
};

export const getQuiz = async (topic, difficulty, numQuestions) => {
  const response = await api.post('/quiz', { topic, difficulty, numQuestions });
  return response.data;
};

export default api;