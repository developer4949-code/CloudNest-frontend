import api from './axios';

// Get all files for dashboard (Owned + Shared)
export const getFiles = async () => {
    const response = await api.get('/api/documents/owned');
    return response.data;
};

// Upload a new file (Multipart)
export const uploadFile = async (formData, onProgress) => {
    const response = await api.post('/api/documents/upload', formData, {
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });
    return response.data;
};

// Admin delete - permanent
export const deleteFile = async (fileId) => {
    await api.delete(`/api/documents/${fileId}`);
};

// Revoke access by token (public link)
export const revokeAccessByToken = async (token) => {
    await api.post(`/api/documents/revoke/${token}`);
};

// Revoke access by ID (for Manage Access modal)
export const revokeAccess = async (documentId, accessId) => {
    await api.delete(`/api/documents/access/${accessId}`);
};

// Get list of users with access to a document
export const getSharedUsers = async (documentId) => {
    const response = await api.get(`/api/documents/${documentId}/access`);
    // Map backend DocumentAccess to frontend format
    return response.data.map(access => ({
        userId: access.id, // Using the access UUID as identifier
        email: access.userEmail,
        expiresAt: access.expiresAt,
        accessType: access.expiresAt ? 'Time-Limited' : 'Permanent',
        revoked: access.revoked
    }));
};

// Versioning
export const uploadNewVersion = async (fileId, formData) => {
    const response = await api.post(`/api/documents/${fileId}/version`, formData);
    return response.data;
};

// Sharing
export const shareFile = async (documentId, shareData) => {
    // shareData = { email, accessType, expiresAt }
    const response = await api.post('/api/documents/grant-access', null, {
        params: {
            documentId,
            reviewerEmail: shareData.email,
            expiresAt: shareData.expiresAt || null
        }
    });
    return response.data;
};

export const getDownloadUrl = async (documentId) => {
    const response = await api.get(`/api/documents/${documentId}/download`);
    return response.data;
};

export const getPreviewUrl = async (documentId) => {
    const response = await api.get(`/api/documents/${documentId}/preview`);
    return response.data;
};

export const getSharedFiles = async () => {
    const response = await api.get('/api/documents/shared');
    return response.data;
};

// Helper to construct review URL for display
export const constructReviewUrl = (token) => {
    return `${window.location.origin}/review/${token}`;
};

export const updateSharingPermissions = async (documentId, accessId, updateData) => {
    // updateData = { expiresAt }
    const response = await api.put(`/api/documents/access/${accessId}`, null, {
        params: {
            expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt).toISOString() : null
        }
    });
    return response.data;
};

export const getFileVersions = async (fileId) => {
    const response = await api.get(`/api/documents/${fileId}/versions`);
    return response.data;
};

export const restoreVersion = async (fileId, versionId) => {
    const response = await api.post(`/api/documents/${fileId}/restore/${versionId}`);
    return response.data;
};
