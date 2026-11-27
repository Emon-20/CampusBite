const CATEGORY_DEFAULTS = {
  Snacks: {
    defaultImage: '/images/snacks.svg',
    defaultDescription: 'Freshly prepared cafeteria snack item.'
  },
  Drinks: {
    defaultImage: '/images/drinks.svg',
    defaultDescription: 'Chilled or hot refreshing beverage.'
  },
  'Fast Food': {
    defaultImage: '/images/fast-food.svg',
    defaultDescription: 'Hot and savory fast food item.'
  },
  Desserts: {
    defaultImage: '/images/desserts.svg',
    defaultDescription: 'Sweet treat from the CampusBite bakery.'
  }
};

class FoodFactory {
  static getSupportedCategories() {
    return Object.keys(CATEGORY_DEFAULTS);
  }

  /**
   * Creates a standardized food payload ready for persistence.
   * Ensures category validation, numeric sanitization, and default values.
   */
  static createFood(input = {}) {
    const {
      name,
      description,
      category,
      price,
      stock = 0,
      image,
      isAvailable
    } = input;

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Food name is required');
    }

    if (!CATEGORY_DEFAULTS[category]) {
      throw new Error(
        `Invalid category "${category}". Supported categories: ${this.getSupportedCategories().join(', ')}`
      );
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      throw new Error('Food price must be a non-negative number');
    }

    const numericStock = Number(stock);
    if (Number.isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
      throw new Error('Food stock must be a non-negative integer');
    }

    const defaults = CATEGORY_DEFAULTS[category];
    const resolvedAvailability =
      typeof isAvailable === 'boolean' ? isAvailable && numericStock > 0 : numericStock > 0;

    return {
      name: name.trim(),
      description:
        description && typeof description === 'string' && description.trim()
          ? description.trim()
          : defaults.defaultDescription,
      category,
      price: Math.round(numericPrice * 100) / 100,
      stock: numericStock,
      image:
        image && typeof image === 'string' && image.trim()
          ? image.trim()
          : defaults.defaultImage,
      isAvailable: resolvedAvailability
    };
  }
}

module.exports = FoodFactory;
