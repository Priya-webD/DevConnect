import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <Link to="/" className="font-bold text-lg">DevConnect</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/feed">Feed</Link>
            <Link to={`/profile/${user.id}`}>Profile</Link>
            <Link to="/connections">Connections</Link>
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}