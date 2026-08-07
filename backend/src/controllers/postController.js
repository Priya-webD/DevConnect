import Post from '../models/Post.js';
import Connection from '../models/Connection.js';

export const createPost = async (req, res) => {
  try {
    const post = await Post.create({ author: req.user.id, text: req.body.text });
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await Connection.find({
      status: 'accepted',
      $or: [{ requester: userId }, { recipient: userId }],
    });

    const connectedIds = connections.map((c) =>
      c.requester.toString() === userId ? c.recipient : c.requester
    );
    connectedIds.push(userId);

    //const posts = await Post.find({ author: { $in: connectedIds } })
    //  .sort({ createdAt: -1 })
     // .populate('author', 'name avatar');
     const posts = await Post.find({ author: { $in: connectedIds } })
     .sort({ createdAt: -1 })
     .populate('author', 'name avatar')
     .populate('comments.author', 'name');

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ author: req.user.id, text: req.body.text });
    await post.save();
    await post.populate('comments.author', 'name');
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isCommentAuthor = comment.author.toString() === req.user.id;
    const isPostAuthor = post.author.toString() === req.user.id;
    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await post.save();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};