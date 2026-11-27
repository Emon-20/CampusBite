const {
  ComboDiscountStrategy,
  ThresholdDiscountStrategy
} = require('../../patterns/DiscountStrategy');
const { DiscountService } = require('../../services/discountService');

describe('Discount Strategy & Selection Unit Tests (TDD)', () => {
  test('ComboDiscountStrategy applies Chips + Cake + Juice = ৳150', () => {
    const strategy = new ComboDiscountStrategy();
    const items = [
      { name: 'Chips', price: 30, quantity: 1 },
      { name: 'Cake', price: 80, quantity: 1 },
      { name: 'Juice', price: 70, quantity: 1 }
    ];

    const result = strategy.calculate(items, 180);
    expect(result.discount).toBe(30);
    expect(result.total).toBe(150);
    expect(result.promotionName).toContain('Snack Trio Combo');
  });

  test('ComboDiscountStrategy returns zero discount if combo is incomplete', () => {
    const strategy = new ComboDiscountStrategy();
    const items = [
      { name: 'Chips', price: 30, quantity: 1 },
      { name: 'Cake', price: 80, quantity: 1 }
    ];

    const result = strategy.calculate(items, 110);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(110);
    expect(result.promotionName).toBe('None');
  });

  test('ThresholdDiscountStrategy applies 10% discount for subtotal >= ৳500', () => {
    const strategy = new ThresholdDiscountStrategy({ minSubtotal: 500, discountRate: 0.1 });
    const result = strategy.calculate([], 600);

    expect(result.discount).toBe(60);
    expect(result.total).toBe(540);
    expect(result.promotionName).toContain('Threshold Discount');
  });

  test('ThresholdDiscountStrategy does not apply below ৳500', () => {
    const strategy = new ThresholdDiscountStrategy({ minSubtotal: 500, discountRate: 0.1 });
    const result = strategy.calculate([], 499);

    expect(result.discount).toBe(0);
    expect(result.total).toBe(499);
  });

  test('DiscountService never combines promotions and picks the lowest payable total', () => {
    const service = new DiscountService();
    // 1x Snack Trio (saves 30) + 2x Beef Tehari Box (400) => subtotal = 580
    // Combo gives 580 - 30 = 550
    // Threshold (10% of 580 = 58) gives 580 - 58 = 522 -> lowest!
    const items = [
      { name: 'Chips', price: 30, quantity: 1 },
      { name: 'Cake', price: 80, quantity: 1 },
      { name: 'Juice', price: 70, quantity: 1 },
      { name: 'Beef Tehari Box', price: 200, quantity: 2 }
    ];

    const best = service.calculateBestDiscount(items);
    expect(best.subtotal).toBe(580);
    expect(best.discount).toBe(58);
    expect(best.total).toBe(522);
    expect(best.promotionName).toContain('Threshold Discount');
  });

  test('DiscountService returns original subtotal when no promotion applies', () => {
    const service = new DiscountService();
    const items = [{ name: 'Singara', price: 25, quantity: 4 }];

    const best = service.calculateBestDiscount(items);
    expect(best.subtotal).toBe(100);
    expect(best.discount).toBe(0);
    expect(best.total).toBe(100);
    expect(best.promotionName).toBe('None');
  });
});
