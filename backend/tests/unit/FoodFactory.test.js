const FoodFactory = require('../../patterns/FoodFactory');

describe('FoodFactory Unit Tests', () => {
  test('creates a standardized Snack item with defaults when optional fields are omitted', () => {
    const food = FoodFactory.createFood({
      name: '  Chips  ',
      category: 'Snacks',
      price: 30,
      stock: 20
    });

    expect(food).toEqual({
      name: 'Chips',
      description: 'Freshly prepared cafeteria snack item.',
      category: 'Snacks',
      price: 30,
      stock: 20,
      image: '/images/snacks.svg',
      isAvailable: true
    });
  });

  test('sets isAvailable to false when stock is 0 even if isAvailable=true is passed', () => {
    const food = FoodFactory.createFood({
      name: 'Juice',
      category: 'Drinks',
      price: 70,
      stock: 0,
      isAvailable: true
    });

    expect(food.isAvailable).toBe(false);
    expect(food.image).toBe('/images/drinks.svg');
  });

  test('throws error for unsupported category', () => {
    expect(() =>
      FoodFactory.createFood({
        name: 'Pasta',
        category: 'Italian',
        price: 120,
        stock: 10
      })
    ).toThrow(/Invalid category/);
  });

  test('throws error for negative price or non-integer stock', () => {
    expect(() =>
      FoodFactory.createFood({
        name: 'Cake',
        category: 'Desserts',
        price: -10,
        stock: 5
      })
    ).toThrow(/non-negative number/);

    expect(() =>
      FoodFactory.createFood({
        name: 'Cake',
        category: 'Desserts',
        price: 80,
        stock: 2.5
      })
    ).toThrow(/non-negative integer/);
  });
});
