import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const fetchGraph = async (term) => {
  const response = await axios.post(`${API_URL}/graph`, { term });
  return response.data;
};

export const fetchNodeInfo = async (term) => {
  const response = await axios.post(`${API_URL}/explain`, { term });
  return response.data;
};
