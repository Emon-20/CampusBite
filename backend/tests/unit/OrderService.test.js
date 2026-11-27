const orderService = require('../../services/orderService');
const { DiscountService } = require('../../services/discountService');
const { OrderSubject, StudentNotificationObserver } = require('../../patterns/OrderObserver');

describe('OrderService Unit Tests with Jest Mocks', () => {
  test('rejects order when stock is insufficient and does NOT deduct stock', async () => {
    const mockFood = {
      _id: 'food-1',
      name: 'Chicken Burger',
      price: 150,
      stock: 2,
      isAvailable: true,
      save: jest.fn()
    };

    const mockFoodRepo = {
      findById: jest.fn().mockResolvedValue(mockFood)
    };
    const mockOrderRepo = {
      create: jest.fn()
    };

    await expect(
      orderService.placeOrder(
        {
          userId: 'user-1',
          items: [{ foodId: 'food-1', quantity: 5 }]
        },
        {
          foodRepo: mockFoodRepo,
          orderRepo: mockOrderRepo,
          discountSvc: new DiscountService()
        }
      )
    ).rejects.toThrow(/Insufficient stock/);

    expect(mockOrderRepo.create).not.toHaveBeenCalled();
    expect(mockFood.save).not.toHaveBeenCalled();
    expect(mockFood.stock).toBe(2);
  });

  test('places order, calculates discount, and deducts stock only after order creation', async () => {
    const mockFoods = {
      f1: { _id: 'f1', name: 'Chips', price: 30, stock: 10, isAvailable: true, save: jest.fn() },
      f2: { _id: 'f2', name: 'Cake', price: 80, stock: 10, isAvailable: true, save: jest.fn() },
      f3: { _id: 'f3', name: 'Juice', price: 70, stock: 1, isAvailable: true, save: jest.fn() }
    };

    const mockFoodRepo = {
      findById: jest.fn((id) => Promise.resolve(mockFoods[id]))
    };

    const mockOrderRepo = {
      create: jest.fn((payload) => Promise.resolve({ _id: 'order-1', orderCode: 'CB-1001', ...payload }))
    };

    const order = await orderService.placeOrder(
      {
        userId: 'student-1',
        items: [
          { foodId: 'f1', quantity: 1 },
          { foodId: 'f2', quantity: 1 },
          { foodId: 'f3', quantity: 1 }
        ]
      },
      {
        foodRepo: mockFoodRepo,
        orderRepo: mockOrderRepo,
        discountSvc: new DiscountService()
      }
    );

    expect(mockOrderRepo.create).toHaveBeenCalledTimes(1);
    expect(order.subtotal).toBe(180);
    expect(order.discount).toBe(30);
    expect(order.total).toBe(150);
    expect(order.paymentMethod).toBe('Cash on Pickup');

    expect(mockFoods.f1.stock).toBe(9);
    expect(mockFoods.f2.stock).toBe(9);
    expect(mockFoods.f3.stock).toBe(0);
    expect(mockFoods.f3.isAvailable).toBe(false);
  });

  test('updates order status and notifies mocked observer', async () => {
    const mockOrder = {
      _id: 'order-2',
      orderCode: 'CB-2002',
      userId: 'student-1',
      status: 'Pending',
      paymentStatus: 'Pending',
      items: [],
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      })
    };

    const mockOrderRepo = {
      findById: jest.fn().mockResolvedValue(mockOrder)
    };
    const mockSubject = {
      notify: jest.fn()
    };

    const updated = await orderService.updateOrderStatus(
      { orderId: 'order-2', status: 'Preparing' },
      { orderRepo: mockOrderRepo, foodRepo: {}, subject: mockSubject }
    );

    expect(updated.status).toBe('Preparing');
    expect(mockSubject.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-2',
        previousStatus: 'Pending',
        newStatus: 'Preparing'
      })
    );
  });

  test('restores stock when a Pending order is Cancelled and notifies observer', async () => {
    const mockFood = {
      _id: 'f1',
      name: 'Singara',
      stock: 5,
      isAvailable: true,
      save: jest.fn()
    };
    const mockOrder = {
      _id: 'order-3',
      orderCode: 'CB-3003',
      userId: 'student-1',
      status: 'Pending',
      items: [{ foodId: 'f1', quantity: 3 }],
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      })
    };

    const mockOrderRepo = { findById: jest.fn().mockResolvedValue(mockOrder) };
    const mockFoodRepo = { findById: jest.fn().mockResolvedValue(mockFood) };

    const subject = new OrderSubject();
    const observer = new StudentNotificationObserver();
    subject.attach(observer);

    const updated = await orderService.updateOrderStatus(
      { orderId: 'order-3', status: 'Cancelled' },
      { orderRepo: mockOrderRepo, foodRepo: mockFoodRepo, subject }
    );

    expect(updated.status).toBe('Cancelled');
    expect(mockFood.stock).toBe(8);
    expect(mockFood.save).toHaveBeenCalledTimes(1);
    expect(observer.getByUser('student-1')).toHaveLength(1);
  });
});
