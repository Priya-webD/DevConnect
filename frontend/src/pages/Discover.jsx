import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Discover() {
  const [users, setUsers] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState([]);

  const fetchUsers = async (skill = '') => {
    setLoading(true);
    try {
      const url = skill ? `/users?skill=${skill}` : '/users';
      const res = await api.get(url);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(skillFilter);
  };

  const handleConnect = async (userId) => {
    try {
      await api.post(`/connections/request/${userId}`);
      setPendingIds([...pendingIds, userId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Discover Developers</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Filter by skill (e.g. react)"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <Link to={`/profile/${u._id}`} className="font-semibold hover:underline">
                  {u.name}
                </Link>
                <p className="text-sm text-gray-600">{u.bio || 'No bio yet.'}</p>
              </div>
              <button
                onClick={() => handleConnect(u._id)}
                disabled={pendingIds.includes(u._id)}
                className={`px-3 py-1 rounded text-white text-sm ${
                  pendingIds.includes(u._id) ? 'bg-gray-400' : 'bg-blue-600'
                }`}
              >
                {pendingIds.includes(u._id) ? 'Pending' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}