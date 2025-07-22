
import api from '../api';

export const fetchServices = async () => {
  try {
    const response = await api.get('/adminpanel/service-categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error.response?.status, error.response?.data || error.message);
    throw error; // Re-throw to handle in the caller
  }
};

export const createServiceCategory = async (formData) => {
  try {
    const response = await api.post('/adminpanel/service-categories/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service category:', error.response?.data || error.message);
    throw error;
  }
};

export const updateServiceCategory = async (id, formData) => {
  try {
    const response = await api.put(`/adminpanel/service-categories/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service category:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteServiceCategory = async (id) => {
  try {
    await api.delete(`/adminpanel/service-categories/${id}/`);
  } catch (error) {
    console.error('Error deleting service category:', error.response?.data || error.message);
    throw error;
  }
};