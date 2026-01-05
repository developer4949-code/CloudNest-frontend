import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LayoutDashboard, FileText, UploadCloud, UserCircle, LogOut, Cloud, Users, Bell } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="app-container">
            {/* Ambient Background Elements */}
            <div className="app-bg-wrapper">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
                <div className="grid-overlay"></div>
            </div>

            <nav className="navbar glass-panel">
                <div className="nav-brand">
                    <Link to="/">
                        <Cloud size={32} color="#00f3ff" style={{ filter: 'drop-shadow(0 0 10px #00f3ff)' }} />
                        CloudNest
                    </Link>
                </div>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/files" className={`nav-item ${isActive('/files') ? 'active' : ''}`}>
                                <FileText size={20} />
                                <span>My Files</span>
                            </Link>
                            <Link to="/shared-with-me" className={`nav-item ${isActive('/shared-with-me') ? 'active' : ''}`}>
                                <Users size={20} />
                                <span>Shared with Me</span>
                            </Link>
                            <Link to="/notifications" className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}>
                                <Bell size={20} />
                                <span>Notifications</span>
                            </Link>
                            <Link to="/upload" className={`nav-item ${isActive('/upload') ? 'active' : ''}`}>
                                <UploadCloud size={18} />
                                <span>Upload</span>
                            </Link>
                            <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                                <UserCircle size={18} />
                                <span>Profile</span>
                            </Link>
                            <button onClick={handleLogout} className="btn-logout">
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`nav-item ${isActive('/login') ? 'active' : ''}`}>
                                <UserCircle size={18} />
                                <span>Login</span>
                            </Link>
                            <Link to="/register" className={`nav-item ${isActive('/register') ? 'active' : ''}`}>
                                <UserCircle size={18} />
                                <span>Register</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
