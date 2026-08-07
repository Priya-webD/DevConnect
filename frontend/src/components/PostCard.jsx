import { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function PostCard({ post, onDelete }) {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const isLiked = likes.includes(user.id);
  const isAuthor = post.author._id === user.id;

  const handleLike = async () => {
    // optimistic update
    const wasLiked = isLiked;
    setLikes(wasLiked ? likes.filter((id) => id !== user.id) : [...likes, user.id]);

    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setLikes(res.data.post.likes);
    } catch (err) {
      // revert on failure
      setLikes(post.likes);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/posts/${post._id}/comments`, { text: newComment });
      setComments(res.data.post.comments);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/${post._id}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between">
        <span className="font-semibold">{post.author.name}</span>
        {isAuthor && (
          <button onClick={handleDeletePost} className="text-red-500 text-sm">
            Delete
          </button>
        )}
      </div>
      <p className="mt-2">{post.text}</p>

      <div className="flex gap-4 mt-3 text-sm text-gray-600">
        <button onClick={handleLike} className={isLiked ? 'text-blue-600 font-semibold' : ''}>
          👍 {likes.length} {isLiked ? 'Liked' : 'Like'}
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          💬 {comments.length} Comments
        </button>
      </div>

      {showComments && (
        <div className="mt-3 border-t pt-3">
          {comments.map((c) => (
            <div key={c._id} className="flex justify-between text-sm mb-2">
              <span>
                <strong>{c.author?.name || 'User'}:</strong> {c.text}
              </span>
              {c.author?._id === user.id && (
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 text-xs ml-2"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}