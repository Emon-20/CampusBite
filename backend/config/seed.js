require('dotenv').config();
const User = require('../models/User');
const Food = require('../models/Food');
const FoodFactory = require('../patterns/FoodFactory');
const { connectDB, disconnectDB } = require('./db');

const SAMPLE_FOODS = [
  {
    name: 'Chips',
    description: 'Crispy salted potato chips packet.',
    category: 'Snacks',
    price: 30,
    stock: 40,
    image: '/images/snacks.svg'
  },
  {
    name: 'Cake',
    description: 'Soft vanilla sponge cake slice.',
    category: 'Desserts',
    price: 80,
    stock: 25,
    image: '/images/desserts.svg'
  },
  {
    name: 'Juice',
    description: 'Chilled mango fruit juice box (250ml).',
    category: 'Drinks',
    price: 70,
    stock: 35,
    image: '/images/drinks.svg'
  },
  {
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with lettuce and house sauce.',
    category: 'Fast Food',
    price: 150,
    stock: 20,
    image: '/images/fast-food.svg'
  },
  {
    name: 'French Fries',
    description: 'Golden crispy potato fries with tomato ketchup.',
    category: 'Fast Food',
    price: 80,
    stock: 30,
    image: '/images/fast-food.svg'
  },
  {
    name: 'Cold Coffee',
    description: 'Iced blended coffee with milk and chocolate drizzle.',
    category: 'Drinks',
    price: 90,
    stock: 25,
    image: '/images/drinks.svg'
  },
  {
    name: 'Singara',
    description: 'Traditional Bangladeshi spiced potato singara (2 pcs).',
    category: 'Snacks',
    price: 25,
    stock: 60,
    image: '/images/snacks.svg'
  },
  {
    name: 'Samosa',
    description: 'Crispy triangular vegetable samosa (2 pcs).',
    category: 'Snacks',
    price: 30,
    stock: 50,
    image: '/images/snacks.svg'
  },
  {
    name: 'Chicken Roll',
    description: 'Warm paratha wrap filled with spiced shredded chicken.',
    category: 'Fast Food',
    price: 110,
    stock: 18,
    image: '/images/fast-food.svg'
  },
  {
    name: 'Lemonade',
    description: 'Freshly squeezed lemon juice with mint.',
    category: 'Drinks',
    price: 45,
    stock: 40,
    image: '/images/drinks.svg'
  },
  {
    name: 'Chocolate Brownie',
    description: 'Rich fudge chocolate brownie square.',
    category: 'Desserts',
    price: 95,
    stock: 15,
    image: '/images/desserts.svg'
  },
  {
    name: 'Beef Tehari Box',
    description: 'Aromatic spiced rice with tender beef cubes.',
    category: 'Fast Food',
    price: 200,
    stock: 15,
    image: '/images/fast-food.svg'
  }
];

async function seedDatabase() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@campusbite.ruet.ac.bd').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.ADMIN_NAME || 'Cafeteria Admin';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    console.log(`Seeded demo admin: ${adminEmail}`);
  }

  const demoStudents = [
    {
      name: 'Rahim Ahmed',
      email: 'rahim@student.ruet.ac.bd',
      password: 'Password@123',
      role: 'student'
    },
    {
      name: 'Nusrat Jahan',
      email: 'nusrat@student.ruet.ac.bd',
      password: 'Password@123',
      role: 'student'
    }
  ];

  for (const student of demoStudents) {
    const exists = await User.findOne({ email: student.email });
    if (!exists) {
      await User.create(student);
      console.log(`Seeded demo student: ${student.email}`);
    }
  }

  const foodCount = await Food.countDocuments();
  if (foodCount === 0) {
    const standardizedFoods = SAMPLE_FOODS.map((item) => FoodFactory.createFood(item));
    await Food.insertMany(standardizedFoods);
    console.log(`Seeded ${standardizedFoods.length} food items using FoodFactory`);
  }
}

if (require.main === module) {
  connectDB()
    .then(seedDatabase)
    .then(async () => {
      console.log('Database seeding completed.');
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seeding failed:', err);
      await disconnectDB();
      process.exit(1);
    });
}

module.exports = { seedDatabase, SAMPLE_FOODS };
