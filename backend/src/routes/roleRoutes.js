import express from 'express';
import { switchRole, getAvailableRoles } from '../controllers/roleController.js';
import {auth} from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/switch', auth, switchRole);
router.get('/available', auth, getAvailableRoles);

export default router;