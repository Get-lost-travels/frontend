import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

export const register = async (username, email, password) => {
    try {
        const response = await AuthService.register(username, email, password);
        return response;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await AuthService.login(email, password);

        if (response.user) {
            StorageService.setUser(response.user);
        }

        StorageService.setToken(response.token);
        
        return response;
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

