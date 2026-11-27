const express = require('express');
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
} = require('../controllers/foodController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', protect, requireAdmin, createFood);
router.put('/:id', protect, requireAdmin, updateFood);
router.delete('/:id', protect, requireAdmin, deleteFood);

module.exports = router;
