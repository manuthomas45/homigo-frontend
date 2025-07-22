import api from '../api';

export const fetchServiceTypes = async () => {
  try {
    const response = await api.get('/services/service-types/');
    return response.data;
  } catch (error) {
    console.error('Error fetching service types:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

export const createServiceType = async (data) => {
  try {
    const response = await api.post('/services/service-types/', data);
    // Return the full response object, not just response.data
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Create error:', error.response?.data || error.message);
    throw error; // Throw the full error object
  }
};

export const updateServiceType = async (id, formData) => {
  try {
    const response = await api.put(`/services/service-types/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Return the full response object, not just response.data
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating service type:', error.response?.data || error.message);
    throw error; // Throw the full error object
  }
};

export const deleteServiceType = async (id) => {
  try {
    await api.delete(`/services/service-types/${id}/`);
  } catch (error) {
    console.error('Error deleting service type:', error.response?.data || error.message);
    throw error;
  }
};