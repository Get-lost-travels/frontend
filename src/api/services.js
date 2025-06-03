import { ApiService } from '../services/api.service';

export const getAllServices = async () => {
    const response = await ApiService.api.get('/services');
    return response.data;
};

export const getServiceById = async (id) => {
    const response = await ApiService.api.get(`/services/${id}`);
    return response.data;
};

export const createService = async (serviceData) => {
    const response = await ApiService.api.post('/services', serviceData);
    return response.data;
};

export const updateService = async (id, serviceData) => {
    const response = await ApiService.api.put(`/services/${id}`, serviceData);
    return response.data;
};

export const deleteService = async (id) => {
    const response = await ApiService.api.delete(`/services/${id}`);
    return response.data;
};

export const getServiceCategories = async () => {
    const response = await ApiService.api.get('/services/categories');
    return response.data;
};

export const createServiceCategory = async (categoryData) => {
    const response = await ApiService.api.post('/services/categories', categoryData);
    return response.data;
};

export const updateServiceCategory = async (categoryId, categoryData) => {
    const response = await ApiService.api.put(`/services/categories/${categoryId}`, categoryData);
    return response.data;
};

export const deleteServiceCategory = async (categoryId) => {
    const response = await ApiService.api.delete(`/services/categories/${categoryId}`);
    return response.data;
};

export const getMyServices = async () => {
    const response = await ApiService.api.get('/services/my');
    return response.data;
};

export const addServiceMedia = async (id, mediaData) => {
    // If mediaData is FormData, explicitly set Content-Type to undefined
    const config = mediaData instanceof window.FormData ? { headers: { 'Content-Type': undefined } } : undefined;
    const response = await ApiService.api.post(`/services/${id}/media`, mediaData, config);
    return response.data;
};

export const deleteServiceMedia = async (id, mediaId) => {
    const response = await ApiService.api.delete(`/services/${id}/media/${mediaId}`);
    return response.data;
};

export const updateServiceMedia = async (id, mediaId, mediaData) => {
    const response = await ApiService.api.put(`/services/${id}/media/${mediaId}`, mediaData);
    return response.data;
};

export const featureServiceMedia = async (id, mediaId) => {
    const response = await ApiService.api.post(`/services/${id}/media/${mediaId}/feature`);
    return response.data;
};

export const getServiceAvailability = async (id) => {
    const response = await ApiService.api.get(`/services/${id}/availability`);
    return response.data;
};

export const createServiceAvailability = async (id, availabilityData) => {
    const response = await ApiService.api.post(`/services/${id}/availability`, availabilityData);
    return response.data;
};

export const updateServiceAvailability = async (id, availabilityId, availabilityData) => {
    const response = await ApiService.api.put(`/services/${id}/availability/${availabilityId}`, availabilityData);
    return response.data;
};

export const deleteServiceAvailability = async (id, availabilityId) => {
    const response = await ApiService.api.delete(`/services/${id}/availability/${availabilityId}`);
    return response.data;
};

export const saveSearch = async (searchData) => {
    const response = await ApiService.api.post('/services/saved-searches', searchData);
    return response.data;
};

export const getSavedSearches = async () => {
    const response = await ApiService.api.get('/services/saved-searches');
    return response.data;
};

export const deleteSavedSearch = async (searchId) => {
    const response = await ApiService.api.delete(`/services/saved-searches/${searchId}`);
    return response.data;
};

export const addServiceReview = async (id, reviewData) => {
    const response = await ApiService.api.post(`/services/${id}/reviews`, reviewData);
    return response.data;
};

export const getServiceReviews = async (id) => {
    const response = await ApiService.api.get(`/services/${id}/reviews`);
    return response.data;
};

export const updateServiceReview = async (id, reviewId, reviewData) => {
    const response = await ApiService.api.put(`/services/${id}/reviews/${reviewId}`, reviewData);
    return response.data;
};

export const deleteServiceReview = async (id, reviewId) => {
    const response = await ApiService.api.delete(`/services/${id}/reviews/${reviewId}`);
    return response.data;
};

export const switchRole = async () => {
    const response = await ApiService.api.post('/services/switch-role');
    return response.data;
};

export const createAgency = async (agencyData) => {
    const response = await ApiService.api.post('/services/agencies', agencyData);
    return response.data;
};

export const deleteAgency = async (agencyId) => {
    const response = await ApiService.api.delete(`/services/agencies/${agencyId}`);
    return response.data;
};

export const fetchServices = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.location) query.append('location', params.location);
    if (params.duration) query.append('duration', params.duration);
    if (params.agencyId) query.append('agencyId', params.agencyId);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.minRating) query.append('minRating', params.minRating);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDir) query.append('sortDir', params.sortDir);
    if (params.page) query.append('page', params.page);
    if (params.pageSize) query.append('pageSize', params.pageSize);
    const response = await ApiService.api.get(`/services?${query.toString()}`);
    return response.data;
}; 