import React, {createContext, useState, useCallback, useEffect, useRef} from "react";
import {RegisterRequest, User} from '../types/auth'
import {authService} from "../services/authService";
import {AuthError} from "../types/errors";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: AuthError | null;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (registerData: RegisterRequest) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    hasAuthority: (authority: string) => boolean;
    clearError: () => void;
}

export const BaseAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null
    });

    const fetchingUser = useRef(false);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const updateState = useCallback((updates: Partial<AuthState>) => {
        if (isMounted.current) {
            setState(prev => ({...prev, ...updates}));
        }
    }, []);

    const handleError = useCallback((error: unknown) => {
        console.error('Auth error:', error);
        if (error instanceof AuthError) {
            updateState({error});
        } else {
            updateState({error: new AuthError('error', 'generic')});
        }
        throw error;
    }, [updateState]);

    const fetchUser = useCallback(async () => {
        if (fetchingUser.current || !authService.isAuthenticated()) {
            updateState({user: null, loading: false});
            return;
        }

        try {
            fetchingUser.current = true;
            updateState({loading: true});
            const userData = await authService.fetchUserData();
            updateState({user: userData, error: null, loading: false});
        } catch (error) {
            updateState({user: null, loading: false});
            if (error instanceof AuthError) {
                updateState({error});
            }
        } finally {
            fetchingUser.current = false;
        }
    }, [updateState]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            updateState({loading: true, error: null});
            await authService.login({email, password});
            await fetchUser();
        } catch (error) {
            handleError(error);
        } finally {
            updateState({loading: false});
        }
    }, [fetchUser, updateState, handleError]);

    const register = useCallback(async (registerData: RegisterRequest) => {
        try {
            updateState({loading: true, error: null});
            await authService.register(registerData);
            await fetchUser();
        } catch (error) {
            handleError(error);
        } finally {
            updateState({loading: false});
        }
    }, [fetchUser, updateState, handleError]);

    const logout = useCallback(() => {
        authService.logout();
        updateState({
            user: null,
            error: null
        });
    }, [updateState]);

    const hasAuthority = useCallback((authority: string): boolean => {
        return state.user?.authorities?.includes(authority) ?? false;
    }, [state.user?.authorities]);

    const clearError = useCallback(() => {
        updateState({error: null});
    }, [updateState]);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            fetchUser().catch(error => {
                console.error('Error fetching user:', error);
            });
        } else {
            updateState({loading: false});
        }
    }, [fetchUser, updateState]);

    return (
        <BaseAuthContext.Provider value={{
            ...state,
            login,
            register,
            logout,
            fetchUser,
            hasAuthority,
            clearError
        }}>
            {children}
        </BaseAuthContext.Provider>
    );
};