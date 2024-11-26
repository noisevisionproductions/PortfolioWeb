import axios from 'axios';
import api from "../../utils/axios";
import {RegisterRequest, AuthResponse, LoginRequest} from "../types/auth";
import {ValidationError, AuthError} from "../types/errors";

const API_URL = '/api/auth';

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

export const baseAuthService = {
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const {data} = await api.post<AuthResponse>(`${API_URL}/register`, userData);
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async login(userData: LoginRequest): Promise<AuthResponse> {
        try {
            const {data} = await api.post<AuthResponse>(`${API_URL}/login`, userData);
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
            const {data} = await api.get(`${API_URL}/me`);
            return data;
        } catch (error) {
            throw handleAuthError(error);
        }
    }
};