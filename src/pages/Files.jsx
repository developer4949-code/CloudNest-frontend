import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as filesApi from '../api/fileApi';
import { DownloadCloud, Trash2, File, AlertCircle, Share2, History, Eye, Users } from 'lucide-react';
import ShareModal from '../components/ShareModal';
import ManageAccessModal from '../components/ManageAccessModal';

export default function Files() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sharingFile, setSharingFile] = useState(null);
    const [managingAccessFile, setManagingAccessFile] = useState(null);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const data = await filesApi.getFiles();
            setFiles(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load files');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const url = await filesApi.getDownloadUrl(fileId);
            window.location.href = url;
        } catch (err) {
            alert('Failed to get download URL');
        }
    };

    const handleDelete = async (fileId) => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;

        try {
            await filesApi.deleteFile(fileId);
            setFiles(files.filter(f => (f.fileId || f.id) !== fileId));
        } catch (err) {
            alert('Failed to delete file');
        }
    };

    const handlePreview = async (fileId) => {
        try {
            const url = await filesApi.getPreviewUrl(fileId);
            window.open(url, '_blank');
        } catch (err) {
            alert('Failed to get preview URL');
        }
    };

    const handleShareSuccess = () => {
        setSharingFile(null);
        // Optionally refresh files list
    };

    if (loading) return <div className="text-center" style={{ padding: '4rem' }}><span className="loader"></span></div>;
    if (error) return <div className="error-message" style={{ maxWidth: '600px', margin: '2rem auto' }}><AlertCircle size={20} style={{ marginRight: '8px' }} />{error}</div>;

    return (
        <div className="files-container">
            <div className="section-header">
                <h1>My Files</h1>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {files.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Size</th>
                                    <th>Versions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((file) => (
                                    <tr key={file.fileId || file.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                                <File size={16} color="#00f3ff" />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 500, color: '#fff' }}>{file.fileName || file.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td>{file.size}</td>
                                        <td>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem'
                                            }}>
                                                {file.versionCount || 1} v
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handlePreview(file.id)} className="action-btn" title="Preview">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleDownload(file.fileId || file.id)} className="action-btn btn-download" title="Download">
                                                    <DownloadCloud size={16} />
                                                </button>
                                                <button onClick={() => navigate(`/files/${file.id}/versions`)} className="action-btn" title="History" style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                                                    <History size={16} />
                                                </button>
                                                <button onClick={() => setSharingFile(file)} className="action-btn" title="Share" style={{ color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.3)' }}>
                                                    <Share2 size={16} />
                                                </button>
                                                <button onClick={() => setManagingAccessFile(file)} className="action-btn" title="Manage Access" style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                                                    <Users size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(file.fileId || file.id)} className="action-btn btn-delete" title="Delete">
                                                    <Trash2 size={16} />
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
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📂</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>You haven&apos;t uploaded any files yet.</p>
                    </div>
                )}
            </div>

            {sharingFile && <ShareModal file={sharingFile} onClose={() => setSharingFile(null)} onSuccess={handleShareSuccess} />}
            {managingAccessFile && <ManageAccessModal file={managingAccessFile} onClose={() => setManagingAccessFile(null)} onUpdate={loadFiles} />}
        </div>
    );
}
