import axios from 'axios';
import {redirectTo} from "./navigationService";
import {ApiError, ValidationError, AuthError} from "../types/errors";
import i18nextTranslation from '../../utils/translations/i18nTranslation'

export const createErrorHandler = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const responseData = error.response?.data;

        switch (status) {
            case 400:
                if (responseData?.type === 'error' && responseData?.key === 'generic') {
                    redirectTo('/unauthorized');
                    throw new ApiError(403, i18nextTranslation.t('errors.noPermissions'), 'FORBIDDEN');
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
                throw new ApiError(403, i18nextTranslation.t('errors.noPermissions'), 'FORBIDDEN');

            default:
                console.log('Falling through to default error case');
                let message = responseData?.message || i18nextTranslation.t('errors.unexpected');
                throw new ApiError(status, message, responseData?.code);
        }
    }

    throw new ApiError(500, i18nextTranslation.t('errors.unexpected'), 'UNKNOWN_ERROR');
};