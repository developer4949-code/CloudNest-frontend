import api from './axios';

// Get owned files
export const getFiles = async () => {
    const response = await api.get('/files');
    return response.data;
};

// Upload a new file
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

// --- Preview ---
export const getPreviewUrl = async (fileId) => {
    const response = await api.get(`/files/${fileId}/preview`);
    return response.data.previewUrl;
};

// --- Versioning ---
export const getFileVersions = async (fileId) => {
    const response = await api.get(`/files/${fileId}/versions`);
    return response.data;
};

export const restoreVersion = async (fileId, versionId) => {
    const response = await api.post(`/files/${fileId}/versions/${versionId}/restore`);
    return response.data;
};

// --- Sharing ---
export const shareFile = async (fileId, shareData) => {
    // shareData = { email, accessType, expiresAt }
    const response = await api.post(`/files/${fileId}/share`, shareData);
    return response.data;
};

export const getSharedFiles = async () => {
    const response = await api.get('/shared-files');
    return response.data;
};

// --- Sharing Management ---
export const getSharedUsers = async (fileId) => {
    const response = await api.get(`/files/${fileId}/shared-users`);
    return response.data;
};

export const revokeAccess = async (fileId, userId) => {
    const response = await api.delete(`/files/${fileId}/shared-users/${userId}`);
    return response.data;
};

export const updateSharingPermissions = async (fileId, userId, updateData) => {
    // updateData = { accessType, expiresAt }
    const response = await api.patch(`/files/${fileId}/shared-users/${userId}`, updateData);
    return response.data;
};
