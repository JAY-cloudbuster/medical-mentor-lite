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

export const fetchRecentSearches = async () => {
  const response = await api.get('/dashboard/recent-searches');
  return response.data;
};

export const saveTerm = async (term, definition, pathophysiology, clinicalRelevance) => {
  const response = await api.post('/dashboard/terms', {
    term,
    definition,
    pathophysiology,
    clinicalRelevance
  });

  return response.data;
};
export const deleteSavedTerm = async (id) => {
  const response = await api.delete(`/dashboard/terms/${id}`);
  return response.data;
};
