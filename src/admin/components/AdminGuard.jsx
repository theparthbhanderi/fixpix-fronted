import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import LoadingOverlay from '../../components/ui/LoadingOverlay';

const AdminGuard = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <LoadingOverlay message="Verifying access..." />;
    }

    // Check if user exists and has staff access
    if (user && user.is_staff) {
        return children;
    }

    // If logged in but not staff - redirect to app dashboard
    if (user) {
        return <Navigate to="/app" replace />;
    }

    // If not logged in - redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminGuard;
