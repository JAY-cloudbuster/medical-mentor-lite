import api from './apiService';

export const fetchGraph = async (term) => {
  const response = await api.post('/graph', { term });
  return response.data;
};

export const fetchNodeInfo = async (term) => {
  const response = await api.post('/explain', { term });
  return response.data;
};
