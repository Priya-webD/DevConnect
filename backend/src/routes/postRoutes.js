import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { createPost, getFeed, toggleLike, deletePost } from '../controllers/postController.js';
import { addComment, deleteComment } from '../controllers/postController.js';

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/feed', authMiddleware, getFeed);
router.put('/:id/like', authMiddleware, toggleLike);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/comments', authMiddleware, addComment);
router.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);

export default router;