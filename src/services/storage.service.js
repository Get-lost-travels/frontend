export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data'
};

export class StorageService {
    static setToken(token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    static getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    static setUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    static getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        try {
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static getUserEmail() {
        const user = this.getUser();
        return user?.email;
    }

    static getUsername() {
        const user = this.getUser();
        return user?.username;
    }

    static getUserId() {
        const user = this.getUser();
        return user?.id;
    }

    static clearSession() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    }

    static updateUserData(updates) {
        const currentUser = this.getUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            this.setUser(updatedUser);
            return updatedUser;
        }
        return null;
    }
} 