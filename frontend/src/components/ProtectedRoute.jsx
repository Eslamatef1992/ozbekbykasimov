import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { openAuth } = useUI();

  useEffect(() => {
    if (!loading && !user) openAuth('login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-16">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}
