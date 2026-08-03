import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      await api.post('/auth/signup', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
      </p>
    </div>
  );
}