import api from './axios';

export const getDashboardSummary = async () => {
    console.log('calling api.get(/dashboard/summary)');
    const response = await api.get('/dashboard/summary');
    return response.data;
};
