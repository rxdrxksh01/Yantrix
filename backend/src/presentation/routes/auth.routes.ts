import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controllers.js';
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', upload.single('govt_id'), authController.register);
router.post('/login',  authController.login);
// router.post('/refresh-tokens', authController.refreshTokens);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.post('/change-password', authenticate, authController.changePassword);

export default router;