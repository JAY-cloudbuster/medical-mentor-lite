import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const defineTerm = async (term) => {
  const response = await axios.post(`${API_URL}/define`, { term });
  return response.data;
};

export const getRelatedTerms = async (term) => {
  const response = await axios.post(`${API_URL}/related`, { term });
  return response.data;
};

export const getQuiz = async (topic) => {
  const response = await axios.post(`${API_URL}/quiz`, { topic });
  return response.data;
};

export const getYoutubeVideos = async (term) => {
  const response = await axios.get(`${API_URL}/youtube?term=${encodeURIComponent(term)}`);
  return response.data;
};
