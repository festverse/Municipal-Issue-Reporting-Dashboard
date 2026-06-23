import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProtectedRoute({ children, restrictTo }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner text="Authenticating..." />;
  if (!user) return <Navigate to="/login" replace />;

  if (restrictTo && !restrictTo.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
        <span className="text-5xl mb-4">🔒</span>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
