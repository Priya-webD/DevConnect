import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { id } = useParams();
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', skills: '' });
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [error, setError] = useState('');

  const isOwnProfile = user && user.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/${id}`);
        setProfile(res.data.user);
        setForm({
          name: res.data.user.name,
          bio: res.data.user.bio || '',
          skills: (res.data.user.skills || []).join(', '),
        });
      } catch (err) {
        setError('Could not load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Check connection status when viewing someone else's profile
  useEffect(() => {
    if (isOwnProfile) return;
    const checkConnection = async () => {
      try {
        const [myConnections, pending] = await Promise.all([
          api.get('/connections/me'),
          api.get('/connections/pending'),
        ]);
        const isConnected = myConnections.data.connections.some(
          (c) => c.requester._id === id || c.recipient._id === id
        );
        if (isConnected) {
          setConnectionStatus('connected');
        }
      } catch (err) {
        // fail silently, default stays 'none'
      }
    };
    checkConnection();
  }, [id, isOwnProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const skillsArray = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.put('/users/me', {
        name: form.name,
        bio: form.bio,
        skills: skillsArray,
      });

      setProfile(res.data.user);
      login(res.data.user, localStorage.getItem('token')); // update AuthContext too
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleConnect = async () => {
    try {
      await api.post(`/connections/request/${id}`);
      setConnectionStatus('pending');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send request');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error && !profile) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-sm">
      {!editing ? (
        <>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-600 mt-2">{profile.bio || 'No bio yet.'}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {(profile.skills || []).map((skill, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-6">
            {isOwnProfile ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={connectionStatus !== 'none'}
                className={`px-4 py-2 rounded text-white ${
                  connectionStatus === 'none'
                    ? 'bg-blue-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {connectionStatus === 'none' && 'Connect'}
                {connectionStatus === 'pending' && 'Pending'}
                {connectionStatus === 'connected' && 'Connected'}
              </button>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={300}
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="node, react, mongodb"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}