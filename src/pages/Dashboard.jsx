import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as dashboardApi from '../api/dashboard';
import { FileText, HardDrive, Plus, File, AlertCircle, Share2, RotateCw } from 'lucide-react';

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Dashboard Component Mounted');
        loadSummary();
    }, []);

    const loadSummary = async () => {
        console.log('loadSummary started');
        try {
            const data = await dashboardApi.getDashboardSummary();
            setSummary(data);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center" style={{ padding: '4rem' }}><span className="loader"></span></div>;
    if (error) return <div className="error-message" style={{ maxWidth: '600px', margin: '2rem auto' }}><AlertCircle size={20} style={{ marginRight: '8px' }} />{error}</div>;

    // Fallback if summary is missing
    if (!summary) {
        return (
            <div className="dashboard-container">
                <div className="section-header"><h1>Dashboard</h1></div>
                <div className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                    No dashboard data available.
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="section-header">
                <h1>Dashboard</h1>
                <Link to="/upload" className="btn-primary" style={{ width: 'auto', marginTop: 0, padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    <span>Upload New File</span>
                </Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="icon-wrapper">
                        <FileText size={28} />
                    </div>
                    <div className="stat-value">{summary.totalFiles || 0}</div>
                    <div className="stat-label">Total Files</div>
                </div>
                <div className="stat-card">
                    <div className="icon-wrapper">
                        <HardDrive size={28} />
                    </div>
                    <div className="stat-value">{summary.totalStorage || '0 B'}</div>
                    <div className="stat-label">Storage Used</div>
                </div>
            </div>

            {/* Additional Stats for Versioning and Sharing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                <div className="card">
                    <h3><RotateCw size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Recent Restores</h3>
                    {summary.recentRestores && summary.recentRestores.length > 0 ? (
                        <ul className="activity-list">
                            {summary.recentRestores.map((item, i) => (
                                <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#fbbf24' }}>Restored <strong>{item.fileId}</strong></span>
                                    <br />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To version {item.versionName} • {new Date(item.restoredAt).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No recent versions restored.</p>
                    )}
                </div>

                <div className="card">
                    <h3><Share2 size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Sharing Activity</h3>
                    {summary.sharingActivity && summary.sharingActivity.length > 0 ? (
                        <ul className="activity-list">
                            {summary.sharingActivity.map((item, i) => (
                                <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#a78bfa' }}>Shared <strong>{item.fileId}</strong></span>
                                    <br />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>With {item.sharedWith} • {item.type}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No recent sharing activity.</p>
                    )}
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Recent Uploads</h3>
                {summary.recentUploads && summary.recentUploads.length > 0 ? (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th style={{ textAlign: 'right' }}>Size</th>
                                    <th style={{ textAlign: 'right' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.recentUploads.map((file) => (
                                    <tr key={file.fileId || file.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                                <File size={16} color="#00f3ff" />
                                            </div>
                                            {file.fileName || file.name}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>{file.size}</td>
                                        <td style={{ textAlign: 'right' }}>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center" style={{ color: 'var(--text-secondary)', padding: '2rem' }}>
                        No files uploaded yet.
                    </p>
                )}
                {(!summary.recentUploads || summary.recentUploads.length === 0) &&
                    <div className="text-center" style={{ marginTop: '1rem' }}>
                        <Link to="/upload" className="link-text">Start Uploading</Link>
                    </div>
                }
            </div>
        </div>
    );
}
