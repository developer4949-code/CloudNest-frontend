import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as filesApi from '../api/fileApi';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setProgress(0);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await filesApi.uploadFile(formData, (percent) => {
                setProgress(percent);
            });
            // Redirect to files list after successful upload
            // Optional: show success message briefly
            setTimeout(() => navigate('/files'), 500);
        } catch (err) {
            setError('Failed to upload file');
            setUploading(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '600px' }}>
            <div className="section-header">
                <h1>Upload File</h1>
            </div>

            <div className="card">
                <div
                    className="upload-area"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="file-input"
                        onChange={handleFileChange}
                    />
                    {file ? (
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                            <h3>{file.name}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                            <p style={{ color: 'var(--primary-color)', fontWeight: 500 }}>
                                Click to change file
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☁️</div>
                            <h3>Click or Drag file to upload</h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Support for PDF, DOCX, PNG, JPG (Max 10MB)
                            </p>
                        </div>
                    )}
                </div>

                {uploading && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Uploading...</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{progress}%</span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                {error && <div className="error-message" style={{ marginTop: '1.5rem' }}>{error}</div>}

                <button
                    className="btn-primary"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    style={{ marginTop: '2rem' }}
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>
        </div>
    );
}
