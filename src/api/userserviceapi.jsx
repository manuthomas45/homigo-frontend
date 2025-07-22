import api from '../api';

export const fetchCategoriesWithTypes = async () => {
  try {
    const response = await api.get('/users/categories-with-types/');
    console.log('API Response:', response.data); // Add this to debug
    return response.data;
  } catch (error) {
    console.error('Error fetching categories with types:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};