import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {LoginPage} from "./LoginPage";
import {useBaseAuthContext} from "../../hooks/useBaseAuthContext";
import {RedirectingPage} from "../../../components/shared/RedirectingPage";

const ProtectedLoginRoute = () => {
    const {user, loading} = useBaseAuthContext();
    const navigate = useNavigate();
    const attemptingLogin = useRef(false);
    const [initialCheck, setInitialCheck] = useState(false);

    useEffect(() => {
        if (!loading) {
            setInitialCheck(true);
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && user && !attemptingLogin.current) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [user, loading, navigate]);

    const handleLoginAttempt = () => {
        attemptingLogin.current = true;
    };

    if (!initialCheck) {
        return <RedirectingPage/>;
    }

    if (!loading && user && !attemptingLogin.current) {
        return <RedirectingPage/>;
    }

    if (loading) {
        return <LoginPage onLoginAttempt={handleLoginAttempt}/>;
    }

    return <LoginPage onLoginAttempt={handleLoginAttempt}/>;
};

export default ProtectedLoginRoute;