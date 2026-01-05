import { useState, useEffect } from 'react';
import { X, Calendar, UserX, Edit2, Save, XCircle } from 'lucide-react';
import * as fileApi from '../api/fileApi';

export default function ManageAccessModal({ file, onClose, onUpdate }) {
    const [sharedUsers, setSharedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ accessType: '', expiresAt: '' });
    const [revoking, setRevoking] = useState(null);

    useEffect(() => {
        loadSharedUsers();
    }, [file]);

    const loadSharedUsers = async () => {
        try {
            const data = await fileApi.getSharedUsers(file.id || file.fileId);
            setSharedUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load shared users');
            setSharedUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (userId) => {
        if (!confirm('Are you sure you want to revoke access for this user?')) return;

        setRevoking(userId);
        try {
            await fileApi.revokeAccess(file.id || file.fileId, userId);
            setSharedUsers(sharedUsers.filter(u => u.userId !== userId));
            if (onUpdate) onUpdate();
            alert('Access revoked successfully');
        } catch (err) {
            alert('Failed to revoke access');
        } finally {
            setRevoking(null);
        }
    };

    const handleStartEdit = (user) => {
        setEditingUser(user.userId);
        setEditForm({
            accessType: user.accessType || 'Permanent',
            expiresAt: user.expiresAt ? new Date(user.expiresAt).toISOString().slice(0, 16) : ''
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditForm({ accessType: '', expiresAt: '' });
    };

    const handleSaveEdit = async (userId) => {
        try {
            await fileApi.updateSharingPermissions(
                file.id || file.fileId,
                userId,
                {
                    accessType: editForm.accessType,
                    expiresAt: editForm.accessType === 'Time-Limited' ? editForm.expiresAt : null
                }
            );
            await loadSharedUsers();
            setEditingUser(null);
            setEditForm({ accessType: '', expiresAt: '' });
            if (onUpdate) onUpdate();
            alert('Access updated successfully');
        } catch (err) {
            alert('Failed to update access');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', zIndex: 10 }}>
                    <X size={24} />
                </button>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Manage Access - "{file.name || file.fileName}"</h3>

                {loading ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <span className="loader"></span>
                    </div>
                ) : sharedUsers.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {sharedUsers.map((user) => (
                            <div key={user.userId} style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {editingUser === user.userId ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div className="form-group" style={{ margin: 0 }}>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Access Type</label>
                                            <select
                                                className="form-input"
                                                value={editForm.accessType}
                                                onChange={(e) => setEditForm({ ...editForm, accessType: e.target.value })}
                                                style={{ marginTop: '0.5rem' }}
                                            >
                                                <option value="Permanent">Permanent Access</option>
                                                <option value="Time-Limited">Time-Limited Access</option>
                                            </select>
                                        </div>
                                        {editForm.accessType === 'Time-Limited' && (
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expiry Date & Time</label>
                                                <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                                    <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                                                    <input
                                                        type="datetime-local"
                                                        className="form-input"
                                                        style={{ paddingLeft: '35px' }}
                                                        value={editForm.expiresAt}
                                                        onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleSaveEdit(user.userId)}
                                                className="action-btn"
                                                style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)', flex: 1 }}
                                            >
                                                <Save size={14} /> Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="action-btn"
                                                style={{ color: 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.1)', flex: 1 }}
                                            >
                                                <XCircle size={14} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <UserX size={16} color="var(--neon-cyan)" />
                                                <span style={{ fontWeight: 500, color: '#fff' }}>{user.email}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px',
                                                    background: user.accessType === 'Permanent' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: user.accessType === 'Permanent' ? '#60a5fa' : '#fbbf24',
                                                    border: `1px solid ${user.accessType === 'Permanent' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                                }}>
                                                    {user.accessType || 'Permanent'}
                                                </span>
                                                {user.expiresAt && (
                                                    <span style={{ color: 'var(--text-muted)' }}>
                                                        Expires: {new Date(user.expiresAt).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleStartEdit(user)}
                                                className="action-btn"
                                                title="Edit Access"
                                                style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' }}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleRevoke(user.userId)}
                                                className="action-btn"
                                                title="Revoke Access"
                                                disabled={revoking === user.userId}
                                                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                            >
                                                <UserX size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <UserX size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No users have access to this file yet.</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Share the file to grant access.</p>
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
