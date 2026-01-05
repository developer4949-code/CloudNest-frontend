
import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Initialize token directly from localStorage
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token && !user) {
                try {
                    const userData = await authApi.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user profile', error);
                    logout(); // Clear token if profile fetch fails
                }
            }
            setLoading(false);
        };

        if (token) {
            initAuth();
        } else {
            setLoading(false); // No token, so not loading user profile
        }
    }, [token]); // Depend on token to re-run if it changes (e.g., after login)

    const login = async (email, password) => {
        const data = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authApi.register(name, email, password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        // Allow logout to see the login screen if desired, but user can just click "Login" to get back
        localStorage.removeItem('token');
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
