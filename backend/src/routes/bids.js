import express from 'express';
const router = express.Router();
import {createBid, getMyBids, getGigBids, hireFreelancer} from '../controllers/bidController.js';
import { auth } from '../middleware/auth.js';
import { validateBid, checkValidation } from '../middleware/validate.js';

router.post('/', auth, validateBid, checkValidation, createBid);
router.get('/my-bids', auth, getMyBids);
router.get('/gig/:gigId', auth, getGigBids);
router.patch('/:bidId/hire', auth, hireFreelancer);

export default router;