import {useContext} from 'react';
import {BaseAuthContext, AuthContextType} from '../context/BaseAuthContext';

export const useBaseAuthContext = () => {
    const context = useContext(BaseAuthContext);

    if (context === undefined) {
        throw new Error('useBaseAuthContext must be used within an AuthProvider');
    }
    return context;
};

export type {AuthContextType};