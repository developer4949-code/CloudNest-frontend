import axios from 'axios';

// --- MULTI-USER MOCK DATABASE ---
const MOCK_DB = {
    users: [
        {
            id: '1',
            name: 'Debi Prasad',
            email: 'debi@cloudnest.com',
            role: 'Owner'
        },
        {
            id: '2',
            name: 'Demo Partner',
            email: 'demo@cloudnest.com',
            role: 'Partner'
        }
    ],
    files: [
        // Debi's Files
        {
            id: '101',
            name: 'Project_Proposal.pdf',
            size: '2.5 MB',
            uploadedAt: '2026-01-02T10:00:00Z',
            versionCount: 3,
            ownerId: '1',
            versions: [
                { id: 'v3', uploadedAt: '2026-01-02T10:00:00Z', size: '2.5 MB', label: 'Current' },
                { id: 'v2', uploadedAt: '2026-01-01T15:00:00Z', size: '2.4 MB', label: 'v2' },
                { id: 'v1', uploadedAt: '2025-12-30T09:00:00Z', size: '2.0 MB', label: 'v1' }
            ],
            sharedWith: []
        },
        {
            id: '102',
            name: 'Design_Assets.zip',
            size: '150 MB',
            uploadedAt: '2026-01-03T14:30:00Z',
            versionCount: 1,
            ownerId: '1',
            versions: [
                { id: 'v1', uploadedAt: '2026-01-03T14:30:00Z', size: '150 MB', label: 'Current' }
            ],
            sharedWith: [
                { userId: '2', email: 'demo@cloudnest.com', accessType: 'Permanent', permissions: 'READ', sharedAt: '2026-01-03T16:00:00Z' }
            ]
        },
        {
            id: '103',
            name: 'Financial_Report_2025.xlsx',
            size: '1.2 MB',
            uploadedAt: '2026-01-04T09:15:00Z',
            versionCount: 5,
            ownerId: '1',
            versions: [
                { id: 'v5', uploadedAt: '2026-01-04T09:15:00Z', size: '1.2 MB', label: 'Current' }
            ],
            sharedWith: []
        },
        // Demo's Files(Partner)
        {
            id: '301',
            name: 'Partner_Agreement.docx',
            size: '500 KB',
            uploadedAt: '2026-01-05T09:00:00Z',
            versionCount: 1,
            ownerId: '2',
            versions: [
                { id: 'v1', uploadedAt: '2026-01-05T09:00:00Z', size: '500 KB', label: 'Current' }
            ],
            sharedWith: [] // Shared back to Debi logic to be handled in sharedFiles
        }
    ],
    // Explicit shared files list for "Shared With Me" view
    sharedFiles: [
        // Shared with Debi (Owner)
        {
            id: '201',
            name: 'Team_Roadmap_2026.pdf',
            size: '5.6 MB',
            owner: 'Sarah Connor',
            ownerId: '99',
            sharedAt: '2026-01-01T10:00:00Z',
            accessType: 'Permanent',
            permissions: 'READ',
            sharedWithUserId: '1'
        },
        // Shared with Demo (Partner)
        {
            id: '102', // Design Assets (owned by Debi)
            name: 'Design_Assets.zip',
            size: '150 MB',
            owner: 'Debi Prasad',
            ownerId: '1',
            sharedAt: '2026-01-03T16:00:00Z',
            accessType: 'Permanent',
            permissions: 'READ',
            sharedWithUserId: '2'
        }
    ],
    notifications: [
        { id: 'n1', userId: '1', message: 'Sarah Connor shared "Team_Roadmap_2026.pdf" with you', time: '2026-01-01T10:05:00Z', read: false },
        { id: 'n2', userId: '1', message: 'Upload of "Design_Assets.zip" completed', time: '2026-01-03T14:31:00Z', read: true },
        { id: 'n3', userId: '1', message: 'You restored "Project_Proposal.pdf" to version v2', time: '2026-01-04T12:01:00Z', read: false },
        { id: 'n4', userId: '2', message: 'Debi Prasad shared "Design_Assets.zip" with you', time: '2026-01-03T16:05:00Z', read: false }
    ]
};

// Toggle this to switch between Real API and Mock Data
const USE_MOCK = true;

// Helper to get current user ID from "token"
const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    if (token.includes('user-1')) return '1';
    if (token.includes('user-2')) return '2';
    return null;
};

let api;

if (USE_MOCK) {
    console.log('------------------------------------------------');
    console.log('MOCK MODE ENABLED: Multi-User Support Active');
    console.log('------------------------------------------------');

    api = {
        defaults: { headers: { common: {} } },
        interceptors: {
            request: { use: () => { } },
            response: { use: () => { } }
        },
        get: async (url) => {
            const userId = getCurrentUserId();
            console.log(`[MOCK API] GET ${url} (User: ${userId})`);

            await new Promise(r => setTimeout(r, 200));

            if (!userId) {
                console.warn('[MOCK API] Unauthorized: No valid user ID found for token');
                return Promise.reject({
                    response: {
                        status: 401,
                        data: { message: 'Unauthorized: Invalid token' }
                    }
                });
            }

            if (url === '/users/me') {
                const user = MOCK_DB.users.find(u => u.id === userId);
                return { data: user || {} };
            }

            if (url === '/dashboard/summary') {
                // Calculate summary for current user
                console.log(`[MOCK API] Calculating summary for user: ${userId} (Type: ${typeof userId})`);
                const userFiles = MOCK_DB.files.filter(f => {
                    console.log(`Checking file ${f.id} owner: ${f.ownerId} vs ${userId}`);
                    return f.ownerId === userId;
                });
                console.log(`[MOCK API] Found ${userFiles.length} files for user ${userId}`);

                const totalSize = userFiles.reduce((acc, file) => {
                    const size = parseFloat(file.size.split(' ')[0]); // Rough parsing
                    const unit = file.size.split(' ')[1];
                    return acc + (unit === 'GB' ? size * 1024 : size);
                }, 0);

                const summaryData = {
                    totalFiles: userFiles.length,
                    totalStorage: `${totalSize.toFixed(1)} MB`,
                    recentUploads: userFiles.slice(0, 5),
                    recentRestores: [],
                    sharingActivity: []
                };
                console.log('[MOCK API] Returning summary:', summaryData);

                return { data: summaryData };
            }

            if (url === '/files') {
                const userFiles = MOCK_DB.files.filter(f => f.ownerId === userId);
                return { data: userFiles };
            }

            if (url === '/shared-files') {
                const shared = MOCK_DB.sharedFiles.filter(f => f.sharedWithUserId === userId);
                return { data: shared };
            }

            if (url === '/notifications') {
                const notifs = MOCK_DB.notifications.filter(n => n.userId === userId);
                return { data: notifs };
            }

            // Regex for versions
            if (url.match(/\/files\/\w+\/versions/)) {
                // Allow viewing versions if owner OR if shared with (simplified)
                const fileId = url.split('/')[2];
                const file = MOCK_DB.files.find(f => f.id === fileId);
                return { data: file ? file.versions : [] };
            }

            if (url.match(/\/files\/\w+\/download/)) {
                return { data: { downloadUrl: '#' } };
            }

            // Preview endpoint
            if (url.match(/\/files\/\w+\/preview/)) {
                const fileId = url.split('/')[2];
                const file = MOCK_DB.files.find(f => f.id === fileId);
                if (file) {
                    return { data: { previewUrl: `#preview-${fileId}` } };
                }
                return Promise.reject({ response: { status: 404, data: { message: 'File not found' } } });
            }

            // Get shared users for a file
            if (url.match(/\/files\/\w+\/shared-users/)) {
                const fileId = url.split('/')[2];
                const file = MOCK_DB.files.find(f => f.id === fileId);
                if (file && file.ownerId === userId) {
                    // Return the shared users list
                    const sharedUsers = file.sharedWith || [];
                    return { data: sharedUsers };
                }
                return Promise.reject({ response: { status: 403, data: { message: 'Access denied' } } });
            }

            console.warn(`[MOCK API] No handler for GET ${url}`);
            return { data: {} };
        },
        post: async (url, data) => {
            console.log(`[MOCK API] POST ${url}`, data);
            // await new Promise(r => setTimeout(r, 200)); // Removed delay

            if (url === '/auth/login') {
                const user = MOCK_DB.users.find(u => u.email === data.email);
                if (user) {
                    return {
                        data: {
                            token: `mock-token-user-${user.id}`,
                            user: user
                        }
                    };
                } else {
                    // Fallback for unknown users or just return error
                    return Promise.reject({ response: { data: { message: 'Invalid credentials' }, status: 401 } });
                }
            }

            if (url === '/auth/register') {
                // Just log them in as User 1 for now or create new
                return {
                    data: {
                        token: 'mock-token-user-1',
                        user: MOCK_DB.users[0]
                    }
                };
            }

            if (url === '/files/upload') {
                const userId = getCurrentUserId();
                const newFile = {
                    id: String(Date.now()),
                    name: 'new-upload.png',
                    size: '1.0 MB',
                    uploadedAt: new Date().toISOString(),
                    versionCount: 1,
                    ownerId: userId,
                    versions: [],
                    sharedWith: []
                };
                // In a real mock, we'd add to MOCK_DB.files here
                MOCK_DB.files.unshift(newFile);
                return { data: newFile };
            }

            // Mock Restore
            if (url.match(/\/files\/\w+\/versions\/\w+\/restore/)) {
                return { data: { message: 'Version restored' } };
            }
            // Mock Share
            if (url.match(/\/files\/\w+\/share/)) {
                const fileId = url.split('/')[2];
                const file = MOCK_DB.files.find(f => f.id === fileId);
                if (file) {
                    // Find user by email
                    const sharedUser = MOCK_DB.users.find(u => u.email === data.email);
                    if (sharedUser) {
                        const newShare = {
                            userId: sharedUser.id,
                            email: data.email,
                            accessType: data.accessType || 'Permanent',
                            permissions: 'READ',
                            sharedAt: new Date().toISOString(),
                            expiresAt: data.expiresAt || null
                        };
                        if (!file.sharedWith) file.sharedWith = [];
                        // Check if already shared
                        const existingIndex = file.sharedWith.findIndex(s => s.userId === sharedUser.id);
                        if (existingIndex >= 0) {
                            file.sharedWith[existingIndex] = newShare;
                        } else {
                            file.sharedWith.push(newShare);
                        }
                        // Also add to sharedFiles for the recipient
                        const sharedFileEntry = {
                            id: fileId,
                            name: file.name,
                            size: file.size,
                            owner: MOCK_DB.users.find(u => u.id === file.ownerId)?.name || 'Unknown',
                            ownerId: file.ownerId,
                            sharedAt: new Date().toISOString(),
                            accessType: data.accessType || 'Permanent',
                            permissions: 'READ',
                            sharedWithUserId: sharedUser.id,
                            expiresAt: data.expiresAt || null
                        };
                        // Remove existing entry if any
                        MOCK_DB.sharedFiles = MOCK_DB.sharedFiles.filter(sf => !(sf.id === fileId && sf.sharedWithUserId === sharedUser.id));
                        MOCK_DB.sharedFiles.push(sharedFileEntry);
                    }
                }
                return { data: { message: 'File shared successfully' } };
            }

            return { data: {} };
        },
        delete: async (url) => {
            console.log(`[MOCK API] DELETE ${url}`);
            await new Promise(r => setTimeout(r, 200));

            // Delete file
            if (url.match(/^\/files\/\w+$/) && !url.includes('/shared-users')) {
                const id = url.split('/')[2];
                const index = MOCK_DB.files.findIndex(f => f.id === id);
                if (index !== -1) {
                    MOCK_DB.files.splice(index, 1);
                    // Also remove from sharedFiles
                    MOCK_DB.sharedFiles = MOCK_DB.sharedFiles.filter(sf => sf.id !== id);
                }
            }

            // Revoke access (delete shared user)
            if (url.match(/\/files\/\w+\/shared-users\/\w+/)) {
                const parts = url.split('/');
                const fileId = parts[2];
                const userId = parts[4];
                const file = MOCK_DB.files.find(f => f.id === fileId);
                if (file && file.ownerId === getCurrentUserId()) {
                    // Remove from file's sharedWith
                    if (file.sharedWith) {
                        file.sharedWith = file.sharedWith.filter(s => s.userId !== userId);
                    }
                    // Remove from sharedFiles
                    MOCK_DB.sharedFiles = MOCK_DB.sharedFiles.filter(sf => !(sf.id === fileId && sf.sharedWithUserId === userId));
                }
            }

            return { data: { success: true } };
        },
        patch: async (url, data) => {
            console.log(`[MOCK API] PATCH ${url}`, data);
            await new Promise(r => setTimeout(r, 200));

            // Update sharing permissions
            if (url.match(/\/files\/\w+\/shared-users\/\w+/)) {
                const parts = url.split('/');
                const fileId = parts[2];
                const userId = parts[4];
                const file = MOCK_DB.files.find(f => f.id === fileId);
                if (file && file.ownerId === getCurrentUserId()) {
                    const sharedUser = file.sharedWith?.find(s => s.userId === userId);
                    if (sharedUser) {
                        sharedUser.accessType = data.accessType || sharedUser.accessType;
                        sharedUser.expiresAt = data.expiresAt || sharedUser.expiresAt;
                        // Update sharedFiles entry
                        const sharedFileEntry = MOCK_DB.sharedFiles.find(sf => sf.id === fileId && sf.sharedWithUserId === userId);
                        if (sharedFileEntry) {
                            sharedFileEntry.accessType = data.accessType || sharedFileEntry.accessType;
                            sharedFileEntry.expiresAt = data.expiresAt || sharedFileEntry.expiresAt;
                        }
                    }
                }
                return { data: { message: 'Access updated successfully' } };
            }

            return { data: {} };
        }
    };
} else {
    // Real API Configuration
    api = axios.create({
        baseURL: '/api/v1',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
}

export default api;
