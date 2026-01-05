import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import * as fileApi from '../api/fileApi';

export default function ShareModal({ file, onClose, onSuccess }) {
    const [email, setEmail] = useState('');
    const [accessType, setAccessType] = useState('Permanent');
    const [expiresAt, setExpiresAt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fileApi.shareFile(file.id || file.fileId, { email, accessType, expiresAt });
            alert('File shared successfully');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            alert('Failed to share file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                <h3 style={{ marginTop: 0 }}>Share "{file.name || file.fileName}"</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label>User Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="friend@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Access Type</label>
                        <select
                            className="form-input"
                            value={accessType}
                            onChange={(e) => setAccessType(e.target.value)}
                        >
                            <option value="Permanent">Permanent Access</option>
                            <option value="Time-Limited">Time-Limited Access</option>
                        </select>
                    </div>

                    {accessType === 'Time-Limited' && (
                        <div className="form-group">
                            <label>Expiry Date & Time</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    style={{ paddingLeft: '35px' }}
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#34d399' }}>
                            <strong>Permission:</strong> Preview + Download only
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Sharing...' : 'Share File'}
                        </button>
                        <button type="button" onClick={onClose} className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
