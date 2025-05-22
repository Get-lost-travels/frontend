import axios from 'axios';
import { StorageService } from './storage.service.js';

/*
 * Middleware for api service 
 * 
 * This class is used to create a singleton instance of the api service.
 * It is used to add a request interceptor to add a token to the request.
 * It is also used to add a response interceptor to handle 401 errors.
 */
class ApiService_ {
    constructor() {
        this.api = axios.create({
            baseURL: '/api',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.api.interceptors.request.use(
            (config) => {
                const token = StorageService.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    StorageService.clearSession();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
}

export const ApiService = new ApiService_(); 