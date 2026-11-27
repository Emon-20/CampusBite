const {
  ComboDiscountStrategy,
  ThresholdDiscountStrategy
} = require('../patterns/DiscountStrategy');

class DiscountService {
  constructor(strategies = [new ComboDiscountStrategy(), new ThresholdDiscountStrategy()]) {
    this.strategies = strategies;
  }

  /**
   * Calculates subtotal and evaluates each strategy independently.
   * Never combines promotions; selects the single option with the lowest payable total.
   */
  calculateBestDiscount(items = []) {
    const subtotal =
      Math.round(
        items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0) * 100
      ) / 100;

    let best = {
      subtotal,
      promotionName: 'None',
      discount: 0,
      total: subtotal,
      evaluatedOptions: []
    };

    for (const strategy of this.strategies) {
      const result = strategy.calculate(items, subtotal);
      best.evaluatedOptions.push(result);

      if (result.total < best.total) {
        best = {
          subtotal,
          promotionName: result.promotionName,
          discount: result.discount,
          total: result.total,
          evaluatedOptions: best.evaluatedOptions
        };
      }
    }

    return best;
  }
}

module.exports = new DiscountService();
module.exports.DiscountService = DiscountService;
