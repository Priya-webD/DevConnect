import { useState, useEffect } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');

  const fetchFeed = async () => {
    try {
      const res = await api.get('/posts/feed');
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    try {
      const res = await api.post('/posts', { text: newPostText });
      setPosts([res.data.post, ...posts]);
      setNewPostText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Feed</h1>

      <form onSubmit={handleCreatePost} className="mb-6">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Post
        </button>
      </form>

      {loading ? (
        <p>Loading feed...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">
          No posts yet — connect with people to see their updates.
        </p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
        ))
      )}
    </div>
  );
}