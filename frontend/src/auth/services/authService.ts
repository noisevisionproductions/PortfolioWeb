import axios from 'axios';
import {handleApiError} from "./errorHandler";
import {RegisterRequest, AuthResponse, LoginRequest} from "../types/auth";
import {ValidationError, AuthError} from "../types/errors";

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: `${API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData && typeof responseData === 'object') {
            if ('password' in responseData || 'email' in responseData) {
                throw new ValidationError(responseData);
            }

            if ('type' in responseData) {
                throw new AuthError(responseData.type, responseData.key);
            }
        }
    }
    throw new AuthError('error', 'generic');
};

export const authService = {
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const {data} = await axiosInstance.post<AuthResponse>('/register', userData);
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async login(userData: LoginRequest): Promise<AuthResponse> {
        try {
            const {data} = await axiosInstance.post<AuthResponse>('/login', userData);
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw handleAuthError(error)
        }
    },

    logout() {
        localStorage.removeItem('token');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    async fetchUserData(): Promise<any> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new AuthError('error', 'noToken');
        }
        try {
            const {data} = await axiosInstance.get('/me');
            return data;
        } catch (error) {
            throw handleAuthError(error);
        }
    }
};