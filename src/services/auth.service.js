import axios from 'axios';

/*
 * Auth service for authentication endpoints
 * 
 * This service handles auth routes that are at /auth/* (not /api/auth/*)
 */
class AuthService_ {
    constructor() {
        this.api = axios.create({
            baseURL: '/', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.api.interceptors.request.use(
            (config) => {
                console.log('🔐 AUTH REQUEST:', config.method?.toUpperCase(), config.url);
                console.log('🔍 AUTH DEBUG: Request headers:', config.headers);
                return config;
            },
            (error) => {
                console.log('❌ Auth request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                console.log('✅ AUTH RESPONSE:', response.status, response.config.url);
                console.log('🔍 AUTH DEBUG: Response data:', response.data);
                return response;
            },
            (error) => {
                console.log('❌ AUTH ERROR:', error.response?.status, error.config?.url);
                console.log('🔍 AUTH DEBUG: Error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    url: error.config?.url,
                    method: error.config?.method
                });
                
                return Promise.reject(error);
            }
        );
    }

    async login(email, password) {
        const response = await this.api.post('/auth/login', {
            email,
            password
        });
        return response.data;
    }

    async register(username, email, password) {
        const response = await this.api.post('/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    }
}

export const AuthService = new AuthService_(); 