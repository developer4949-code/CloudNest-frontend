import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import * as authApi from '../api/authApi';
import { User, Mail, Shield, LogOut } from 'lucide-react';

export default function Profile() {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch fresh profile data
        const loadProfile = async () => {
            try {
                const data = await authApi.getProfile();
                setProfileData(data);
            } catch (err) {
                console.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    if (loading) return <div className="text-center" style={{ padding: '4rem' }}><span className="loader"></span></div>;

    return (
        <div className="profile-container">
            <div className="section-header">
                <h1>My Profile</h1>
            </div>

            <div className="card profile-card">
                <div className="profile-avatar-section">
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                    }}>
                        {profileData?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h2 style={{ margin: 0, fontSize: '2rem' }}>{profileData?.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Shield size={16} />
                        {profileData?.role || 'User'}
                    </p>

                    <button
                        onClick={logout}
                        className="btn-primary"
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            color: '#fca5a5',
                            marginTop: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <div className="profile-details">
                    <div className="profile-field">
                        <span className="label">
                            <User size={14} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                            Full Name
                        </span>
                        <div className="value">{profileData?.name}</div>
                    </div>
                    <div className="profile-field">
                        <span className="label">
                            <Mail size={14} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                            Email Address
                        </span>
                        <div className="value">{profileData?.email}</div>
                    </div>
                    <div className="profile-field" style={{ borderBottom: 'none' }}>
                        <span className="label">Account Status</span>
                        <div className="value">
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.25rem 1rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#34d399',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                                <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', marginRight: '8px', boxShadow: '0 0 5px #34d399' }}></span>
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
