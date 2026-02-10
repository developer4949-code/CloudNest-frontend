import api from './axios';

export const getDashboardSummary = async () => {
    const response = await api.get('/api/documents/summary');
    return response.data;
};
