import { Router } from 'express';
import { login, me, register, updateMe } from '../controllers/AuthController.js';
import { requireAuth } from '../middleware/auth.js';
export const authRoutes=Router();
authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.get('/me',requireAuth,me);
authRoutes.put('/me',requireAuth,updateMe);
