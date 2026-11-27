class OrderSubject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    if (observer && typeof observer.update === 'function' && !this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(eventData) {
    for (const observer of this.observers) {
      observer.update(eventData);
    }
  }
}

class StudentNotificationObserver {
  constructor(maxLogs = 200) {
    this.maxLogs = maxLogs;
    this.notifications = [];
  }

  update(eventData) {
    const { orderId, orderCode, userId, previousStatus, newStatus, updatedAt } = eventData;
    const entry = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: String(orderId),
      orderCode: orderCode || String(orderId),
      userId: String(userId),
      previousStatus,
      newStatus,
      message: `Order ${orderCode || orderId} status updated from ${previousStatus} to ${newStatus}.`,
      createdAt: updatedAt || new Date().toISOString()
    };

    this.notifications.unshift(entry);
    if (this.notifications.length > this.maxLogs) {
      this.notifications.pop();
    }

    return entry;
  }

  getByUser(userId) {
    return this.notifications.filter((n) => n.userId === String(userId));
  }

  getAll() {
    return [...this.notifications];
  }

  clear() {
    this.notifications = [];
  }
}

const studentNotificationObserver = new StudentNotificationObserver();
const orderSubject = new OrderSubject();
orderSubject.attach(studentNotificationObserver);

module.exports = {
  OrderSubject,
  StudentNotificationObserver,
  orderSubject,
  studentNotificationObserver
};
