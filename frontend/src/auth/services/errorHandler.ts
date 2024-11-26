import axios from 'axios';
import {redirectTo} from "./navigation";
import {ApiError, ValidationError, AuthError} from "../types/errors";

export const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const responseData = error.response?.data;

        console.log('Debug Error:', {
            status: status,
            type: typeof status,
            responseData,
            headers: error.response?.headers
        });

        switch (status) {
            case 400:
                if (responseData?.type === 'error' && responseData?.key === 'generic') {
                    redirectTo('/unauthorized');
                    throw new ApiError(403, 'Brak uprawnień do wykonania tej akcji', 'FORBIDDEN');
                }

                if (responseData?.errors) {
                    throw new ValidationError(responseData.errors);
                }
                break;

            case 401:
                redirectTo('/login');
                throw new AuthError('unauthorized', 'session_expired');

            case 403:
                redirectTo('/unauthorized');
                throw new ApiError(403, 'Brak uprawnień do wykonania tej akcji', 'FORBIDDEN');

            default:
                console.log('Falling through to default error case');
                let message = responseData?.message || 'Wystąpił nieoczekiwany błąd';
                throw new ApiError(status, message, responseData?.code);
        }
    }

    throw new ApiError(500, 'Wystąpił nieoczekiwany błąd', 'UNKNOWN_ERROR');
};