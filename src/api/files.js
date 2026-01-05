import api from './axios';

export const getFiles = async () => {
    const response = await api.get('/files');
    return response.data;
};

export const uploadFile = async (formData, onProgress) => {
    const response = await api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });
    return response.data;
};

export const deleteFile = async (fileId) => {
    await api.delete(`/files/${fileId}`);
};

export const getDownloadUrl = async (fileId) => {
    const response = await api.get(`/files/${fileId}/download`);
    return response.data.downloadUrl;
};
