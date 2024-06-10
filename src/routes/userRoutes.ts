import express from 'express';
import {sendMessage, getMessages, getAllUsers, getUser} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/send-message', authMiddleware, sendMessage);
router.get('/messages', authMiddleware, getMessages);
router.get('/logged-user', authMiddleware, getUser);
router.get('/all-users', authMiddleware, getAllUsers);

export default router;
