const DEFAULT_COMBOS = [
  {
    name: 'Snack Trio Combo (Chips + Cake + Juice = ৳150)',
    requiredItems: ['Chips', 'Cake', 'Juice'],
    comboPrice: 150
  },
  {
    name: 'Burger Meal Combo (Chicken Burger + French Fries + Cold Coffee = ৳220)',
    requiredItems: ['Chicken Burger', 'French Fries', 'Cold Coffee'],
    comboPrice: 220
  }
];

class DiscountStrategy {
  calculate(_items, subtotal) {
    return {
      promotionName: 'None',
      discount: 0,
      total: subtotal
    };
  }
}

class ComboDiscountStrategy extends DiscountStrategy {
  constructor(combos = DEFAULT_COMBOS) {
    super();
    this.combos = combos;
  }

  /**
   * Evaluates configured combo offers against cart items.
   * Each item is expected to have { name, price, quantity }.
   * Picks the single combo that yields the largest savings.
   */
  calculate(items, subtotal) {
    if (!Array.isArray(items) || items.length === 0) {
      return { promotionName: 'None', discount: 0, total: subtotal };
    }

    const itemMap = new Map();
    for (const item of items) {
      const key = String(item.name || '').trim().toLowerCase();
      if (!key || item.quantity <= 0) continue;
      const existing = itemMap.get(key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        itemMap.set(key, { price: Number(item.price), quantity: Number(item.quantity) });
      }
    }

    let bestResult = { promotionName: 'None', discount: 0, total: subtotal };

    for (const combo of this.combos) {
      let minSets = Infinity;
      let singleSetOriginalPrice = 0;

      for (const reqName of combo.requiredItems) {
        const found = itemMap.get(reqName.trim().toLowerCase());
        if (!found || found.quantity < 1) {
          minSets = 0;
          break;
        }
        minSets = Math.min(minSets, found.quantity);
        singleSetOriginalPrice += found.price;
      }

      if (minSets > 0 && minSets !== Infinity && singleSetOriginalPrice > combo.comboPrice) {
        const discount = Math.round((singleSetOriginalPrice - combo.comboPrice) * minSets * 100) / 100;
        const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
        if (discount > bestResult.discount) {
          bestResult = {
            promotionName: combo.name,
            discount,
            total
          };
        }
      }
    }

    return bestResult;
  }
}

class ThresholdDiscountStrategy extends DiscountStrategy {
  constructor({ minSubtotal = 500, discountRate = 0.1 } = {}) {
    super();
    this.minSubtotal = minSubtotal;
    this.discountRate = discountRate;
  }

  calculate(_items, subtotal) {
    if (subtotal >= this.minSubtotal) {
      const discount = Math.round(subtotal * this.discountRate * 100) / 100;
      const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
      return {
        promotionName: `Threshold Discount (${Math.round(this.discountRate * 100)}% off orders >= ৳${this.minSubtotal})`,
        discount,
        total
      };
    }

    return {
      promotionName: 'None',
      discount: 0,
      total: subtotal
    };
  }
}

module.exports = {
  DiscountStrategy,
  ComboDiscountStrategy,
  ThresholdDiscountStrategy,
  DEFAULT_COMBOS
};
