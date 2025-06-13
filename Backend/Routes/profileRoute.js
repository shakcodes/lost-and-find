import express from 'express';
import {getProfile, updateProfile} from '../Controller/profileController.js'; // Ensure this path is correct
import jwtAuth from '../Middleware/jwtAuth.js';

const router = express.Router();

router.get('/:userId', jwtAuth, getProfile);
router.put('/:userId',jwtAuth, updateProfile);

export default router;
