import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ConnectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/connections/pending');
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/connections/accept/${requestId}`);
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/connections/reject/${requestId}`);
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading requests...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Connection Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <span className="font-semibold">{r.requester.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(r._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(r._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}