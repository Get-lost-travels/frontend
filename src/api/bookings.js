import { ApiService } from '../services/api.service';

export const getMyBookings = async () => {
    const response = await ApiService.api.get('/bookings/my');
    return response.data;
};

export const getAllBookings = async () => {
    const response = await ApiService.api.get('/bookings/all');
    return response.data;
};

export const getBookingById = async (id) => {
    const response = await ApiService.api.get(`/bookings/${id}`);
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await ApiService.api.post('/bookings', bookingData);
    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await ApiService.api.post(`/bookings/${id}/cancel`);
    return response.data;
};

export const confirmBooking = async (id) => {
    const response = await ApiService.api.post(`/bookings/${id}/confirm`);
    return response.data;
};

export const completeBooking = async (id) => {
    const response = await ApiService.api.post(`/bookings/${id}/complete`);
    return response.data;
};

export const getBookingETicket = async (id) => {
    const response = await ApiService.api.get(`/bookings/${id}/eticket`);
    return response.data;
};

export const refundBooking = async (id) => {
    const response = await ApiService.api.post(`/bookings/${id}/refund`);
    return response.data;
};

export const respondToRefundDispute = async (disputeId, data) => {
    const response = await ApiService.api.post(`/bookings/refunds/${disputeId}/respond`, data);
    return response.data;
};

export const verdictRefundDispute = async (disputeId, data) => {
    const response = await ApiService.api.post(`/bookings/refunds/${disputeId}/verdict`, data);
    return response.data;
};

export const downloadETicket = async (id) => {
    const response = await ApiService.api.get(`/bookings/${id}/eticket/download`, { responseType: 'blob' });
    return response.data;
};

export const downloadInvoice = async (id) => {
    const response = await ApiService.api.get(`/bookings/${id}/invoice/download`, { responseType: 'blob' });
    return response.data;
};

export const getAgencyBookings = async () => {
    const response = await ApiService.api.get('/bookings/agency');
    return response.data;
}; 