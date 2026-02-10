import api from './axios';

export const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    // Assuming backend returns { token, email, name, role }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post('/api/auth/signup', { fullName: name, email, password });
    return response.data;
};

export const getProfile = async (email) => {
    const response = await api.get(`/api/auth/profile?email=${email}`);
    return response.data;
};
