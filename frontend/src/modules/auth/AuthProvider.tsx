import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { getAccessToken, getRefreshToken, clearTokens } from './tokenStore';
import { refreshAccessToken } from './api';
import { jwtDecode } from 'jwt-decode';

type AuthContextValue = {
    isLoggedIn: boolean;
    isLoading: boolean;
    authLogin: () => void;
    authLogout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false,
    isLoading: true,
    authLogin: () => { },
    authLogout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        const restore = async () => {
            try {
                setIsLoading(true);
                const access = await getAccessToken();
                if (!isActive) return;

                // If access token exists, decode and check expiry (with 30s buffer)
                if (access) {
                    try {
                        const payload = jwtDecode<{ exp?: number }>(access);
                        const exp = payload?.exp;
                        const now = Math.floor(Date.now() / 1000);
                        if (exp && exp > now + 30) {
                            setIsLoggedIn(true);
                            return;
                        }
                        // otherwise token considered expired; fallthrough to refresh
                    } catch {
                        // malformed token -> treat as expired and try refresh
                    }
                }

                const refresh = await getRefreshToken();
                if (!isActive) return;
                if (refresh) {
                    try {
                        await refreshAccessToken();
                        if (!isActive) return;
                        setIsLoggedIn(true);
                        return;
                    } catch {
                        if (!isActive) return;
                        await clearTokens();
                        setIsLoggedIn(false);
                        return;
                    }
                }

                setIsLoggedIn(false);
            } catch {
                if (!isActive) return;
                setIsLoggedIn(false);
            } finally {
                if (!isActive) return;
                setIsLoading(false);
            }
        };

        restore();

        return () => {
            isActive = false;
        };
    }, []);

    const authLogin = () => {
        setIsLoggedIn(true);
    };

    const authLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, authLogin, authLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
