import express from 'express';
const router = express.Router();
import { getGigs, getGig, createGig, getMyGigs, deleteGig} from '../controllers/gigController.js';
import { auth } from '../middleware/auth.js';
import { validateGig, checkValidation } from '../middleware/validate.js';

router.get('/', getGigs);
router.get('/:id', getGig);

router.post('/', auth, validateGig, checkValidation, createGig);
router.get('/user/my-gigs', auth, getMyGigs);
router.delete('/:id', auth, deleteGig);

export default router;