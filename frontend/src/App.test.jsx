import { describe, it, expect } from 'vitest';

describe('CampusBite Frontend Smoke Tests', () => {
  it('computes cart item count and subtotal accurately', () => {
    const items = [
      { name: 'Chips', price: 30, quantity: 2 },
      { name: 'Juice', price: 70, quantity: 1 }
    ];
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    expect(totalCount).toBe(3);
    expect(subtotal).toBe(130);
  });
});
