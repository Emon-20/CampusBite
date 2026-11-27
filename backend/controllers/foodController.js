const Food = require('../models/Food');
const FoodFactory = require('../patterns/FoodFactory');

async function getFoods(req, res) {
  try {
    const { search, category, available } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (available === 'true') {
      filter.isAvailable = true;
      filter.stock = { $gt: 0 };
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ foods });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch foods' });
  }
}

async function getFoodById(req, res) {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    return res.status(200).json({ food });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid food ID' });
  }
}

async function createFood(req, res) {
  try {
    const standardizedFood = FoodFactory.createFood(req.body);
    const food = await Food.create(standardizedFood);
    return res.status(201).json({
      message: 'Food item created successfully',
      food
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to create food item' });
  }
}

async function updateFood(req, res) {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const merged = {
      name: req.body.name !== undefined ? req.body.name : food.name,
      description: req.body.description !== undefined ? req.body.description : food.description,
      category: req.body.category !== undefined ? req.body.category : food.category,
      price: req.body.price !== undefined ? req.body.price : food.price,
      stock: req.body.stock !== undefined ? req.body.stock : food.stock,
      image: req.body.image !== undefined ? req.body.image : food.image,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : food.isAvailable
    };

    const validated = FoodFactory.createFood(merged);
    Object.assign(food, validated);
    await food.save();

    return res.status(200).json({
      message: 'Food item updated successfully',
      food
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to update food item' });
  }
}

async function deleteFood(req, res) {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    return res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid food ID' });
  }
}

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
};
