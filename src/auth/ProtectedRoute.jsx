import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
    const { loading, token } = useAuth();

    // In mock bypass mode, we just want to ensure we're not stuck loading
    if (loading) {
        console.log('ProtectedRoute: Loading...');
        return <div>Loading...</div>;
    }

    if (!token) {
        console.log('ProtectedRoute: No token, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
