import axios from 'axios';
import { StorageService } from './storage.service.js';

/*
 * Middleware for api service 
 * 
 * This class is used to create a singleton instance of the api service.
 * It is configured to send Bearer tokens in Authorization header.
 */
class ApiService_ {
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
                console.log('🔍 DEBUG: All cookies:', document.cookie);
                
                const cookieString = document.cookie;
                const tokenCookie = cookieString
                    .split('; ')
                    .find(row => row.startsWith('auth_token='));
                    
                let token = null;
                if (tokenCookie) {
                    token = tokenCookie.substring('auth_token='.length);
                }
                    
                if (token) {
                    const authHeader = `Bearer ${token}`;
                    config.headers['Authorization'] = authHeader;
                    
                    console.log('🚀 Setting Authorization header:', authHeader.substring(0, 30) + '...');
                    console.log('🔍 DEBUG: Complete Authorization header:', authHeader);
                    console.log('🔍 DEBUG: Auth header length:', authHeader.length);
                } else {
                    console.log('❌ No auth token found in cookies');
                }
                
                console.log('🔍 DEBUG: Request URL:', config.url);
                console.log('🔍 DEBUG: Request method:', config.method?.toUpperCase());
                console.log('🔍 DEBUG: All request headers:');
                Object.entries(config.headers).forEach(([key, value]) => {
                    if (key.toLowerCase() === 'authorization') {
                        console.log(`  ${key}: ${value.substring(0, 30)}...`);
                    } else {
                        console.log(`  ${key}: ${value}`);
                    }
                });
                
                return config;
            },
            (error) => {
                console.log('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                console.log('✅ API Response:', response.status, response.config.url);
                console.log('🔍 DEBUG: Response data:', response.data);
                return response;
            },
            (error) => {
                console.log('❌ API Error:', error.response?.status, error.config?.url);
                console.log('🔍 DEBUG: Error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    url: error.config?.url,
                    method: error.config?.method
                });
                
                if (error.response?.status >= 300 && error.response?.status < 400) {
                    console.log('🔄 Redirect detected to:', error.response?.headers?.location);
                }
                
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log('🚫 Authentication error - clearing session');
                    StorageService.clearSession();
                    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
}

export const ApiService = new ApiService_(); 