import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  sendRequest, acceptRequest, rejectRequest, getMyConnections, getPendingRequests,
} from '../controllers/connectionController.js';

const router = express.Router();

router.post('/request/:userId', authMiddleware, sendRequest);
router.put('/accept/:requestId', authMiddleware, acceptRequest);
router.put('/reject/:requestId', authMiddleware, rejectRequest);
router.get('/me', authMiddleware, getMyConnections);
router.get('/pending', authMiddleware, getPendingRequests);

export default router;