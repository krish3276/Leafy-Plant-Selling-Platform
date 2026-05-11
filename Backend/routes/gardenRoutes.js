import express from 'express';
import {
  getGardenPlants,
  addGardenPlant,
  moveWishlistToGarden,
  updateGardenPlant,
  logGardenCare,
  addGardenNote,
  deleteGardenPlant,
} from '../controllers/gardenController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getGardenPlants);
router.post('/', addGardenPlant);
router.post('/from-wishlist/:productId', moveWishlistToGarden);
router.put('/:id', updateGardenPlant);
router.post('/:id/care', logGardenCare);
router.post('/:id/notes', addGardenNote);
router.delete('/:id', deleteGardenPlant);

export default router;
