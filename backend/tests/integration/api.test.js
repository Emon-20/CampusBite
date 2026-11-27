const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/User');
const Food = require('../../models/Food');
const { studentNotificationObserver } = require('../../patterns/OrderObserver');

let mongoServer;
let studentToken;
let otherStudentToken;
let adminToken;
let createdFoodId;
let placedOrderId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create demo admin directly in DB
  await User.create({
    name: 'Test Admin',
    email: 'admin@test.ruet.ac.bd',
    password: 'AdminPassword123',
    role: 'admin'
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.ruet.ac.bd', password: 'AdminPassword123' });
  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('CampusBite API Integration Tests', () => {
  test('1. Student registration creates student role even if admin role is requested', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Student One',
      email: 'student1@ruet.ac.bd',
      password: 'Password123',
      role: 'admin'
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('student');
    expect(res.body.token).toBeDefined();
    studentToken = res.body.token;

    // Register a second student for authorization isolation tests
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Student Two',
      email: 'student2@ruet.ac.bd',
      password: 'Password123'
    });
    otherStudentToken = res2.body.token;
  });

  test('2. Student login returns valid JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student1@ruet.ac.bd',
      password: 'Password123'
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('student1@ruet.ac.bd');
  });

  test('3. Student cannot create food item (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/foods')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Unauthorized Burger',
        category: 'Fast Food',
        price: 100,
        stock: 10
      });

    expect(res.status).toBe(403);
  });

  test('4. Admin can create food item using FoodFactory', async () => {
    const res = await request(app)
      .post('/api/foods')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Chicken Burger',
        description: 'Grilled chicken burger',
        category: 'Fast Food',
        price: 150,
        stock: 5
      });

    expect(res.status).toBe(201);
    expect(res.body.food.name).toBe('Chicken Burger');
    expect(res.body.food.isAvailable).toBe(true);
    createdFoodId = res.body.food._id;
  });

  test('5. Public food listing returns created food and supports search', async () => {
    const res = await request(app).get('/api/foods?search=Burger');
    expect(res.status).toBe(200);
    expect(res.body.foods.length).toBe(1);
    expect(res.body.foods[0].name).toBe('Chicken Burger');
  });

  test('6. Rejects order when stock is insufficient without deducting stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        items: [{ foodId: createdFoodId, quantity: 10 }]
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Insufficient stock/);

    const foodInDb = await Food.findById(createdFoodId);
    expect(foodInDb.stock).toBe(5);
  });

  test('7. Places Cash on Pickup order successfully and deducts stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        items: [{ foodId: createdFoodId, quantity: 2 }]
      });

    expect(res.status).toBe(201);
    expect(res.body.order.paymentMethod).toBe('Cash on Pickup');
    expect(res.body.order.total).toBe(300);
    expect(res.body.order.status).toBe('Pending');
    placedOrderId = res.body.order._id;

    const foodInDb = await Food.findById(createdFoodId);
    expect(foodInDb.stock).toBe(3);
  });

  test('8. Student can view own order history but another student gets 403', async () => {
    const myRes = await request(app)
      .get('/api/orders/my')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(myRes.status).toBe(200);
    expect(myRes.body.orders.length).toBe(1);

    const otherRes = await request(app)
      .get(`/api/orders/${placedOrderId}`)
      .set('Authorization', `Bearer ${otherStudentToken}`);
    expect(otherRes.status).toBe(403);
  });

  test('9. Admin updates order status and Observer logs student notification', async () => {
    studentNotificationObserver.clear();

    const res = await request(app)
      .patch(`/api/orders/${placedOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Preparing', paymentStatus: 'Paid' });

    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('Preparing');
    expect(res.body.order.paymentStatus).toBe('Paid');

    const notifRes = await request(app)
      .get('/api/orders/notifications')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(notifRes.status).toBe(200);
    expect(notifRes.body.notifications.length).toBe(1);
    expect(notifRes.body.notifications[0].newStatus).toBe('Preparing');
  });
});
