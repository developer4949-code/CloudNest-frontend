import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as fileApi from '../api/fileApi';
import { formatBytes } from '../utils/format';
import { Clock, DownloadCloud, RotateCw, ArrowLeft, File } from 'lucide-react';

export default function FileVersions() {
    const { fileId } = useParams();
    const navigate = useNavigate();
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState(null);

    useEffect(() => {
        loadVersions();
    }, [fileId]);

    const loadVersions = async () => {
        try {
            const data = await fileApi.getFileVersions(fileId);
            setVersions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load versions');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (versionId) => {
        if (!confirm('Are you sure you want to restore this version? It will become the latest version.')) return;

        setRestoring(versionId);
        try {
            await fileApi.restoreVersion(fileId, versionId);
            alert('Version restored successfully');
            loadVersions(); // Refresh list
        } catch (err) {
            alert('Failed to restore version');
        } finally {
            setRestoring(null);
        }
    };

    const handlePreview = async (versionId) => {
        try {
            // For version preview, we might need a different endpoint, but for now use file preview
            const url = await fileApi.getPreviewUrl(fileId);
            window.open(url, '_blank');
        } catch (err) {
            alert('Failed to get preview URL');
        }
    };

    if (loading) return <div className="text-center" style={{ padding: '4rem' }}><span className="loader"></span></div>;

    return (
        <div className="files-container">
            <button
                onClick={() => navigate('/files')}
                style={{
                    background: 'none', border: 'none', color: 'var(--neon-cyan)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', fontSize: '1rem'
                }}
            >
                <ArrowLeft size={20} /> Back to My Files
            </button>

            <div className="section-header">
                <h1>Version History</h1>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Version</th>
                                <th>Date Uploaded</th>
                                <th>Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versions.length > 0 ? versions.map((ver, index) => (
                                <tr key={ver.id || index} style={index === 0 ? { background: 'rgba(16, 185, 129, 0.05)' } : {}}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                                <Clock size={14} color={index === 0 ? '#34d399' : '#94a3b8'} />
                                            </div>
                                            <span style={{ fontWeight: index === 0 ? 'bold' : 'normal', color: index === 0 ? '#34d399' : 'inherit' }}>
                                                {ver.label || `Version ${ver.versionNumber}`}
                                                {index === 0 && <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#34d399', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>CURRENT</span>}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{new Date(ver.uploadedAt).toLocaleString()}</td>
                                    <td>{formatBytes(ver.size)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handlePreview(ver.id)}
                                                className="action-btn"
                                                title="Preview Version"
                                                style={{ color: 'var(--neon-cyan)', borderColor: 'rgba(0, 243, 255, 0.3)' }}
                                            >
                                                <File size={14} /> Preview
                                            </button>
                                            {index !== 0 && (
                                                <button
                                                    onClick={() => handleRestore(ver.id)}
                                                    className="action-btn"
                                                    title="Restore this version"
                                                    disabled={restoring === ver.id}
                                                    style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' }}
                                                >
                                                    <RotateCw size={14} className={restoring === ver.id ? 'spin' : ''} />
                                                    {restoring === ver.id ? 'Restoring...' : 'Restore'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center">No version history available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
