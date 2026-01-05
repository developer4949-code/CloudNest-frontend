export const mockData = {
    user: {
        id: '1',
        name: 'Debi Prasad',
        email: 'debi@cloudnest.com',
        role: 'Owner'
    },
    dashboard: {
        totalFiles: 15,
        totalStorage: '2.4 GB',
        recentUploads: [
            { id: '101', name: 'Project_Proposal.pdf', size: '2.5 MB', uploadedAt: '2026-01-02T10:00:00Z', type: 'pdf' },
            { id: '102', name: 'Design_Assets.zip', size: '150 MB', uploadedAt: '2026-01-03T14:30:00Z', type: 'zip' },
            { id: '103', name: 'Financial_Report_2025.xlsx', size: '1.2 MB', uploadedAt: '2026-01-04T09:15:00Z', type: 'xlsx' }
        ],
        recentRestores: [
            { fileId: '101', versionName: 'v2', restoredAt: '2026-01-04T12:00:00Z' }
        ],
        sharingActivity: [
            { fileId: '102', sharedWith: 'alice@partner.com', type: 'Permanent', date: '2026-01-03T16:00:00Z' }
        ]
    },
    files: [
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
                { email: 'alice@partner.com', accessType: 'Permanent', permissions: 'READ' }
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
        }
    ],
    sharedFiles: [
        {
            id: '201',
            name: 'Team_Roadmap_2026.pdf',
            size: '5.6 MB',
            owner: 'Sarah Connor',
            ownerId: '99',
            sharedAt: '2026-01-01T10:00:00Z',
            accessType: 'Permanent',
            permissions: 'READ'
        },
        {
            id: '202',
            name: 'Q1_Budget.xlsx',
            size: '800 KB',
            owner: 'John Smith',
            ownerId: '98',
            sharedAt: '2026-01-02T11:00:00Z',
            accessType: 'Time-Limited',
            expiresAt: '2026-02-01T00:00:00Z',
            permissions: 'READ'
        }
    ],
    notifications: [
        { id: 'n1', message: 'Sarah Connor shared "Team_Roadmap_2026.pdf" with you', time: '2026-01-01T10:05:00Z', read: false },
        { id: 'n2', message: 'Upload of "Design_Assets.zip" completed', time: '2026-01-03T14:31:00Z', read: true },
        { id: 'n3', message: 'You restored "Project_Proposal.pdf" to version v2', time: '2026-01-04T12:01:00Z', read: false }
    ]
};
