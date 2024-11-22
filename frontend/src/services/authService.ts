import axios from 'axios';
import {RegisterRequest, AuthResponse} from "../types/auth";

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await axios.post<AuthResponse>(
                `${API_URL}/register`,
                userData
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;

                if (responseData && typeof responseData === 'object' && 'password' in responseData) {
                    // eslint-disable-next-line no-throw-literal
                    throw {errors: responseData};
                }

                // Dla błędów runtime (typ ErrorResponse)
                if (responseData && typeof responseData === 'object' && 'type' in responseData) {
                    throw responseData;
                }
            }

            // eslint-disable-next-line no-throw-literal
            throw {type: 'error', key: 'generic'};
        }
    }
};