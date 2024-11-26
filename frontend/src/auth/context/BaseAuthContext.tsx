import React, {createContext, useState, useCallback, useEffect, useRef} from "react";
import {LoginRequest, RegisterRequest, User} from '../types/auth'
import {baseAuthService} from "../services/baseAuthService";
import {AuthError} from "../types/errors";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: AuthError | null;
}

export interface AuthContextType extends AuthState {
    login: (loginRequest: LoginRequest) => Promise<void>;
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

    const updateState = useCallback((updates: Partial<AuthState>) => {
        if (isMounted.current) {
            setState(prev => ({...prev, ...updates}));
        }
    }, []);

    const fetchUser = useCallback(async () => {
        if (fetchingUser.current) {
            return;
        }

        if (!baseAuthService.isAuthenticated()) {
            updateState({user: null, loading: false});
            return;
        }

        try {
            fetchingUser.current = true;
            const userData = await baseAuthService.fetchUserData();

            if (isMounted.current) {
                updateState({
                    user: userData,
                    error: null,
                    loading: false
                });
            }
        } catch (error) {
            console.error('AuthContext - Error fetching user:', error);
            if (isMounted.current) {
                updateState({
                    user: null,
                    loading: false,
                    error: error instanceof AuthError ? error : new AuthError('error', 'generic')
                });
            }
        } finally {
            fetchingUser.current = false;
        }
    }, [updateState]);

    const handleError = useCallback((error: unknown) => {
        console.error('Auth error:', error);
        if (error instanceof AuthError) {
            updateState({error});
        } else {
            updateState({error: new AuthError('error', 'generic')});
        }
        throw error;
    }, [updateState]);

    const login = useCallback(async (loginData: LoginRequest) => {
        try {
            updateState({loading: true, error: null});
            await baseAuthService.login(loginData);
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
            await baseAuthService.register(registerData);
            await fetchUser();
        } catch (error) {
            handleError(error);
        } finally {
            updateState({loading: false});
        }
    }, [fetchUser, updateState, handleError]);

    const logout = useCallback(() => {
        baseAuthService.logout();
        updateState({
            user: null,
            error: null,
            loading: false
        });
    }, [updateState]);

    const hasAuthority = useCallback((authority: string): boolean => {
        return state.user?.authorities?.includes(authority) ?? false;
    }, [state.user?.authorities]);

    const clearError = useCallback(() => {
        updateState({error: null});
    }, [updateState]);

    useEffect(() => {
        if (baseAuthService.isAuthenticated()) {
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