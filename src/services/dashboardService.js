import api from './apiService';

export const fetchProfile = async () => {
  const response = await api.get('/dashboard/profile');
  return response.data;
};

export const fetchActivities = async () => {
  const response = await api.get('/dashboard/activities');
  return response.data;
};

export const fetchSavedTerms = async () => {
  const response = await api.get('/dashboard/terms');
  return response.data;
};
