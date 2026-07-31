import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { getUserById, updateMyProfile, listUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', listUsers);
router.get('/:id', getUserById);
router.put('/me', authMiddleware, updateMyProfile);

export default router;