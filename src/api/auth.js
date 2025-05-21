import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

export const register = async (username, email, password) => {
    try {
        const response = await ApiService.api.post('/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await ApiService.api.post('/auth/login', {
            email,
            password
        });

        if (response.data.user) {
            StorageService.setUser(response.data.user);
        }

        StorageService.setToken(response.data.token);
        
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = async () => {
    StorageService.clearSession();
};

export const isAuthenticated = () => {
    return StorageService.isAuthenticated();
};

export const getCurrentUser = () => {
    return StorageService.getUser();
};

