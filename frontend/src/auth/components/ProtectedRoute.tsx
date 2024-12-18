import {Navigate, useLocation} from "react-router-dom";
import {useBaseAuthContext} from "../hooks/useBaseAuthContext";
import {LoadingSpinner} from "@/components/shared/LoadingSpinner";
import React from "react";
import {Authority} from "../types/roles";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredAuthorities?: Authority[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredAuthorities = []
                                                              }) => {
    const {user, loading, hasAuthority} = useBaseAuthContext();
    const location = useLocation();

    const hasRequiredAuthorities = React.useMemo(() =>
            requiredAuthorities.length === 0 ||
            requiredAuthorities.every(authority => hasAuthority(authority)),
        [requiredAuthorities, hasAuthority]
    );

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (!user) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    if (!hasRequiredAuthorities) {
        return <Navigate to="/unauthorized" replace/>;
    }

    return <>{children}</>
};