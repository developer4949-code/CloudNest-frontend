
import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Initialize token directly from localStorage
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token && user?.email) {
                try {
                    const userData = await authApi.getProfile(user.email);
                    setUser(prev => ({ ...prev, ...userData }));
                    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
                } catch (error) {
                    console.error('Failed to fetch user profile', error);
                    logout();
                }
            }
            setLoading(false);
        };

        if (token) {
            initAuth();
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const data = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authApi.register(name, email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Named export for the hook to avoid Fast Refresh issues
export function useAuth() {
    return useContext(AuthContext);
}
