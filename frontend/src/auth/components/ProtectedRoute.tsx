import {Navigate, useLocation} from "react-router-dom";
import {useAuthContext} from "../hooks/useAuthContext";
import {LoadingSpinner} from "../../components/shared/LoadingSpinner";
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredAuthority?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredAuthority
                                                              }) => {
    const {user, loading, hasAuthority} = useAuthContext();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (!user) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    if (requiredAuthority && !hasAuthority(requiredAuthority)) {
        return <Navigate to="/unauthorized" replace/>;
    }

    return <>{children}</>
};