import React, {useState, useEffect} from "react";
import {useAuthContext} from "./useAuthContext";
import {ValidationError, AuthError} from "../types/errors";

interface UseAuthFormProps<T> {
    onSubmit: (data: T) => Promise<void>;
    initialData: T;
    onSuccess: () => void;
}

export const useAuthForm = <T extends Record<string, any>>({
                                                               onSubmit,
                                                               initialData,
                                                               onSuccess
                                                           }: UseAuthFormProps<T>) => {
    const {clearError, error: contextError, loading} = useAuthContext();
    const [formData, setFormData] = useState<T>(initialData);
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    useEffect(() => {
        if (contextError && !validationErrors.password && !validationErrors.email) {
            setError(contextError.key || 'generic');
        }
    }, [contextError, validationErrors.email, validationErrors.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        clearError();

        try {
            await onSubmit(formData);
            setShowSuccessAlert(true);
        } catch (err) {
            if (err instanceof ValidationError) {
                setValidationErrors(err.errors);
            } else if (err instanceof AuthError) {
                setError(err.key);
            } else {
                setError('generic');
            }
        }
    };

    const handleInputChange = (field: keyof T) => (value: T[keyof T]) => {
        setFormData(prev => ({...prev, [field]: value}));
        if (validationErrors[field as string]) {
            setValidationErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[field as string];
                return newErrors;
            });
        }
        if (error) {
            setError('');
            clearError();
        }
    };

    const handleSuccessAlertClose = () => {
        setShowSuccessAlert(false);
        onSuccess();
    };

    return {
        formData,
        error,
        validationErrors,
        loading,
        showSuccessAlert,
        handleSubmit,
        handleInputChange,
        handleSuccessAlertClose
    };
};