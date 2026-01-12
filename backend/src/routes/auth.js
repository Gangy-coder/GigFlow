import express from 'express';
const router = express.Router();
import {register, login, logout, getMe } from '../controllers/authController.js';
import {getUserProfile, updateProfile} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import {validateRegister, validateLogin, checkValidation} from '../middleware/validate.js';

router.post('/register', validateRegister, checkValidation, register);
router.post('/login', validateLogin, checkValidation, login);
router.post('/logout', logout);

router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.get('/:userId', auth, getUserProfile);

export default router;