import { useState, useEffect } from 'react';
import * as fileApi from '../api/fileApi';
import { formatBytes } from '../utils/format';
import { User, DownloadCloud, File, AlertCircle, Eye } from 'lucide-react';

export default function SharedWithMe() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSharedFiles();
    }, []);

    const loadSharedFiles = async () => {
        try {
            const data = await fileApi.getSharedFiles();
            setFiles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load shared files');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const url = await fileApi.getDownloadUrl(fileId);
            window.location.href = url;
        } catch (err) {
            alert('Failed to get download URL');
        }
    };

    const handlePreview = async (fileId) => {
        try {
            const url = await fileApi.getPreviewUrl(fileId);
            window.open(url, '_blank');
        } catch (err) {
            alert('Failed to get preview URL');
        }
    };

    const handleRemove = async (documentId, accessId) => {
        if (!confirm('Remove this file from your shared list?')) return;
        try {
            await fileApi.revokeAccess(documentId, accessId);
            setFiles(files.filter(f => f.accessId !== accessId));
            alert('File removed from your shared list');
        } catch (err) {
            alert('Failed to remove file');
        }
    };

    if (loading) return <div className="text-center" style={{ padding: '4rem' }}><span className="loader"></span></div>;

    return (
        <div className="files-container">
            <div className="section-header">
                <h1>Shared With Me</h1>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {files.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Shared By</th>
                                    <th>Access Type</th>
                                    <th>Size</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((file) => (
                                    <tr key={file.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                                    <File size={16} color="#fbbf24" />
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{file.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                                <User size={14} /> {file.ownerName}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{
                                                display: 'inline-flex',
                                                flexDirection: 'column',
                                                gap: '4px',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                background: file.accessType === 'Permanent' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                border: `1px solid ${file.accessType === 'Permanent' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                                minWidth: '120px'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    color: file.accessType === 'Permanent' ? '#60a5fa' : '#fbbf24',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.025em'
                                                }}>
                                                    {file.accessType}
                                                </span>
                                                {file.expiresAt && (
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        color: 'rgba(255,255,255,0.6)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        Expires: {new Date(file.expiresAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{formatBytes(file.size)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handlePreview(file.id)} className="action-btn" title="Preview">
                                                    <Eye size={14} />
                                                </button>
                                                <button onClick={() => handleDownload(file.id)} className="action-btn btn-download">
                                                    <DownloadCloud size={14} /> Download
                                                </button>
                                                <button onClick={() => handleRemove(file.id, file.accessId)} className="action-btn" style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '4rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No files have been shared with you.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
