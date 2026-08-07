import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function MyConnections() {
  const { user } = useContext(AuthContext);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await api.get('/connections/me');
        setConnections(res.data.connections);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading connections...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">My Connections</h1>
      {connections.length === 0 ? (
        <p className="text-gray-500">
          No connections yet — head to Discover to find people.
        </p>
      ) : (
        <div className="space-y-3">
          {connections.map((c) => {
            const otherUser = c.requester._id === user.id ? c.recipient : c.requester;
            return (
              <Link
                key={c._id}
                to={`/profile/${otherUser._id}`}
                className="block border rounded-lg p-4 hover:bg-gray-50"
              >
                <span className="font-semibold">{otherUser.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}