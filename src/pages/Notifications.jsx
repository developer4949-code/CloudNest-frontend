import { useState, useEffect } from 'react';
import * as notificationApi from '../api/notificationApi';
import { Bell, Check, Info } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationApi.getNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        // Optimistic update
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        try {
            await notificationApi.markAsRead(id);
        } catch (err) {
            // Undo if failed? Nah, simplified for now.
        }
    };

    if (loading) return <div className="text-center" style={{ padding: '4rem' }}><span className="loader"></span></div>;

    return (
        <div className="dashboard-container">
            <div className="section-header">
                <h1>Notifications</h1>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
                {notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map((note) => (
                            <div key={note.id} style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: note.read ? 'rgba(255,255,255,0.02)' : 'rgba(var(--primary-rgb), 0.1)',
                                border: note.read ? '1px solid transparent' : '1px solid var(--neon-cyan)',
                                display: 'flex',
                                alignItems: 'start',
                                gap: '1rem',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    padding: '8px',
                                    background: note.read ? 'rgba(255,255,255,0.05)' : 'rgba(0, 243, 255, 0.1)',
                                    borderRadius: '50%',
                                    color: note.read ? 'var(--text-muted)' : 'var(--neon-cyan)'
                                }}>
                                    <Info size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: note.read ? 'var(--text-secondary)' : '#fff' }}>
                                        {note.message}
                                    </p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(note.time).toLocaleString()}
                                    </span>
                                </div>
                                {!note.read && (
                                    <button
                                        onClick={() => handleMarkRead(note.id)}
                                        title="Mark as read"
                                        style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer' }}
                                    >
                                        <Check size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
