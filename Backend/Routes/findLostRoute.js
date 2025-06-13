import express from 'express';
const router = express.Router(); // ✅ Declare router first

import {
  lost,
  getLostItems,
  updateLostItem,
  deleteLostItem,
  getLostItemsByUserId,
  getLostItemById
} from '../Controller/findAndLostController.js';

import jwtAuth from '../Middleware/jwtAuth.js';
import upload from '../Middleware/multerImage.js';

// POST lost item with image upload
router.post('/lost', jwtAuth, upload.array('images', 5), lost);

// GET all lost/found items
router.get('/getLostItems', getLostItems);
router.get('/user/:userId/items', getLostItemsByUserId);
router.get('/lost/:id', getLostItemById); // ✅ now valid

// UPDATE and DELETE
router.put('/lost/:id', jwtAuth, updateLostItem);
router.delete('/lost/:id', jwtAuth, deleteLostItem);

export default router;
