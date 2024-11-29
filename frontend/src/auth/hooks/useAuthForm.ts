import React, {useState, useEffect} from "react";
import {useBaseAuthContext} from "./useBaseAuthContext";
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
    const {clearError, error: contextError, loading} = useBaseAuthContext();
    const [formData, setFormData] = useState<T>(initialData);
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        return () => {
            clearError();
        }
    }, [clearError]);

    useEffect(() => {
        if (contextError) {
            setError(contextError.key || 'generic');
        }
    }, [contextError]);

    const validateFrom = (): Record<string, string> => {
        const errors: Record<string, string> = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (value === '' || value === undefined || value === null) {
                errors[key] = `${key}Required`;
            }
        });
        return errors;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        clearError();

        const validationErrors = validateFrom();
        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors(validationErrors);
        }

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