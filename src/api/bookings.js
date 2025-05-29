import { ApiService } from '../services/api.service';

// Debug function to verify token handling
export const debugTokenInfo = () => {
    console.log('🔬 TOKEN DEBUGGING:');
    console.log('📋 All cookies:', document.cookie);
    
    const cookieString = document.cookie;
    const tokenCookie = cookieString
        .split('; ')
        .find(row => row.startsWith('auth_token='));
        
    if (tokenCookie) {
        const token = tokenCookie.substring('auth_token='.length);
        console.log('🎫 Raw token from cookie:', token);
        console.log('📏 Token length:', token.length);
        console.log('🔍 Token parts:', token.split('=='));
        console.log('🎯 Expected format: base64==base64==');
        
        // Check if token looks like expected format
        const parts = token.split('==');
        if (parts.length >= 2) {
            console.log('✅ Token appears to have correct format');
        } else {
            console.log('❌ Token may be truncated or malformed');
        }
        
        // Also check stored user data
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            console.log('👤 Stored user data:', user);
            console.log('🎭 User role:', user.role);
            console.log('🆔 User ID:', user.id);
        } else {
            console.log('❌ No user data in localStorage');
        }
        
        return token;
    } else {
        console.log('❌ No auth_token cookie found');
        return null;
    }
};

export const testAuthWithSimpleEndpoint = async () => {
    try {
        console.log('🧪 Testing authentication with a simple request...');
        const token = debugTokenInfo();
        
        // Try a simple GET to see what happens
        const response = await ApiService.api.get('/bookings/my');
        console.log('✅ AUTH TEST PASSED - Got response:', response.data);
        return response.data;
    } catch (error) {
        console.log('🔍 AUTH TEST FAILED - Error details:');
        console.log('Status:', error.response?.status);
        console.log('Response data:', error.response?.data);
        console.log('Full error:', error);
        
        // If it's a 403, the backend middleware found no user
        if (error.response?.status === 403) {
            console.log('🚨 BACKEND SAYS: No user found for this token!');
            console.log('🔍 This means either:');
            console.log('   1. Token not in UserSessions table');
            console.log('   2. User role is not "customer"');
            console.log('   3. AuthMiddleware not running');
        }
        
        throw error;
    }
};

export const getMyBookings = async () => {
    try {
        // Debug token before making request
        console.log('🚀 About to fetch my bookings...');
        const token = debugTokenInfo();
        
        console.log('🔍 Making request to /bookings/my with token:', token?.substring(0, 20) + '...');
        const response = await ApiService.api.get('/bookings/my');
        console.log('✅ SUCCESS! Got bookings:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to get bookings:', error);
        
        // Add specific debugging for this error
        if (error.response?.status === 403) {
            console.log('🚨 403 FORBIDDEN - Backend found no authenticated user');
            console.log('🔍 Your token was sent but AuthMiddleware didn\'t find a matching UserSession');
        } else if (error.response?.status === 500) {
            console.log('🚨 500 ERROR - Backend crashed trying to handle Results.Forbid()');
            console.log('🔍 This confirms AuthMiddleware found no user (user == null)');
        }
        
        throw error;
    }
};

export const getAllBookings = async () => {
    try {
        const response = await ApiService.api.get('/bookings/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        throw error;
    }
};

export const getBookingById = async (id) => {
    try {
        const response = await ApiService.api.get(`/bookings/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching booking ${id}:`, error);
        throw error;
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await ApiService.api.post('/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const cancelBooking = async (id) => {
    try {
        const response = await ApiService.api.post(`/bookings/${id}/cancel`);
        return response.data;
    } catch (error) {
        console.error(`Error cancelling booking ${id}:`, error);
        throw error;
    }
};

export const confirmBooking = async (id) => {
    try {
        const response = await ApiService.api.post(`/bookings/${id}/confirm`);
        return response.data;
    } catch (error) {
        console.error(`Error confirming booking ${id}:`, error);
        throw error;
    }
};

export const completeBooking = async (id) => {
    try {
        const response = await ApiService.api.post(`/bookings/${id}/complete`);
        return response.data;
    } catch (error) {
        console.error(`Error completing booking ${id}:`, error);
        throw error;
    }
};

export const getBookingETicket = async (id) => {
    try {
        const response = await ApiService.api.get(`/bookings/${id}/eticket`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching e-ticket for booking ${id}:`, error);
        throw error;
    }
};

export const refundBooking = async (id) => {
    try {
        const response = await ApiService.api.post(`/bookings/${id}/refund`);
        return response.data;
    } catch (error) {
        console.error(`Error refunding booking ${id}:`, error);
        throw error;
    }
};

export const respondToRefundDispute = async (disputeId, data) => {
    try {
        const response = await ApiService.api.post(`/bookings/refunds/${disputeId}/respond`, data);
        return response.data;
    } catch (error) {
        console.error(`Error responding to refund dispute ${disputeId}:`, error);
        throw error;
    }
};

export const verdictRefundDispute = async (disputeId, data) => {
    try {
        const response = await ApiService.api.post(`/bookings/refunds/${disputeId}/verdict`, data);
        return response.data;
    } catch (error) {
        console.error(`Error submitting verdict for refund dispute ${disputeId}:`, error);
        throw error;
    }
};

export const downloadETicket = async (id) => {
    try {
        const response = await ApiService.api.get(`/bookings/${id}/eticket/download`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error(`Error downloading e-ticket for booking ${id}:`, error);
        throw error;
    }
};

export const downloadInvoice = async (id) => {
    try {
        const response = await ApiService.api.get(`/bookings/${id}/invoice/download`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error(`Error downloading invoice for booking ${id}:`, error);
        throw error;
    }
};

export const getAgencyBookings = async () => {
    try {
        const response = await ApiService.api.get('/bookings/agency');
        return response.data;
    } catch (error) {
        console.error('Error fetching agency bookings:', error);
        throw error;
    }
};

// Test function to verify proxy routing
export const testBookingsEndpoint = async () => {
    try {
        // Try a simple request without auth to test the proxy
        console.log('🧪 Testing bookings endpoint routing...');
        const response = await ApiService.api.get('/bookings');
        console.log('✅ Bookings proxy working!', response.data);
        return response.data;
    } catch (error) {
        console.log('🔍 Bookings test error:', error.response?.status, error.response?.data);
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.log('✅ Proxy working, got auth error as expected');
            return { test: 'proxy_working' };
        }
        throw error;
    }
}; 