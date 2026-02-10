import api from './axios';

export const getNotifications = async () => {
    const response = await api.get('/api/notifications');
    return response.data;
};

export const markAsRead = async (notificationId) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
};
