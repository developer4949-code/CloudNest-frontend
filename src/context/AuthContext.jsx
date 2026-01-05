import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const userData = await authApi.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user profile', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const data = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // Fetch user profile immediately after login to populate state
        const userData = await authApi.getProfile();
        setUser(userData);
        return data;
    };

    const register = async (name, email, password) => {
        return authApi.register(name, email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
