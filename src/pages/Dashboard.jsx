import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as dashboardApi from '../api/dashboard';
import { formatBytes } from '../utils/format';
import { FileText, HardDrive, Plus, File, AlertCircle, Share2, RotateCw, Database } from 'lucide-react';

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [storagePercent, setStoragePercent] = useState(0);

    useEffect(() => {
        console.log('Dashboard Component Mounted');
        loadSummary();
    }, []);

    useEffect(() => {
        if (summary && summary.quotaBytes > 0) {
            const percent = (summary.totalStorageBytes / summary.quotaBytes) * 100;
            // Immediate set for initial load, could animate with another useEffect if desired
            setStoragePercent(Math.min(percent, 100));
        }
    }, [summary]);

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

    const usedStorageFormatted = formatBytes(summary.totalStorageBytes);
    const totalQuotaFormatted = formatBytes(summary.quotaBytes);

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

                <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <div className="icon-wrapper">
                            <Database size={28} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="stat-value" style={{ fontSize: '1.8rem', color: '#00f3ff' }}>{usedStorageFormatted}</div>
                            <div className="stat-label">Used of {totalQuotaFormatted}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', width: '100%' }}>
                        <div style={{
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: `${storagePercent}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #00f3ff, #006ce6)',
                                borderRadius: '4px',
                                transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)'
                            }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>{storagePercent.toFixed(1)}% full</span>
                            <span>{formatBytes(summary.quotaBytes - summary.totalStorageBytes)} free</span>
                        </div>
                    </div>
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

                <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '250px' }}>
                    <h3 style={{ marginBottom: '1rem' }}><Share2 size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Sharing Activity</h3>
                    <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                        {summary.sharingActivity && summary.sharingActivity.length > 0 ? (
                            <ul className="activity-list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                {summary.sharingActivity.map((item, i) => (
                                    <li key={i} style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <span style={{ color: '#fff', fontWeight: 500 }}>{item.fileName}</span>
                                                <br />
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    Shared with <span style={{ color: '#00f3ff' }}>{item.sharedWith}</span>
                                                </span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    background: item.type === 'Permanent' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: item.type === 'Permanent' ? '#60a5fa' : '#fbbf24',
                                                    border: `1px solid ${item.type === 'Permanent' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                                }}>
                                                    {item.type}
                                                </span>
                                                <br />
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                    {new Date(item.sharedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No recent sharing activity.</p>
                        )}
                    </div>
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
                                        <td style={{ textAlign: 'right' }}>{formatBytes(file.size)}</td>
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
