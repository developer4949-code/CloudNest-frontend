import api from './axios';

export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

export const markAsRead = async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
};
