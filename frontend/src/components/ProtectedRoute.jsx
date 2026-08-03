import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}