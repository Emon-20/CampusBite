import { useEffect, useState } from 'react';
import api from '../services/api';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, notifRes] = await Promise.all([
        api.get('/orders/my'),
        api.get('/orders/notifications')
      ]);
      setOrders(ordersRes.data.orders || []);
      setNotifications(notifRes.data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this pending order?')) return;
    try {
      setError('');
      await api.patch(`/orders/${orderId}/cancel`);
      setSuccessMsg('Order cancelled and stock restored.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Orders</h1>
        <button className="btn btn-outline btn-sm" onClick={loadData}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {notifications.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.6rem', color: 'var(--primary)' }}>
            Recent Status Notifications
          </h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
            {notifications.slice(0, 5).map((n) => (
              <li key={n.id} style={{ marginBottom: '0.35rem' }}>
                {n.message}{' '}
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                  ({new Date(n.createdAt).toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="card">You have not placed any orders yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div className="card" key={order._id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}
              >
                <div>
                  <strong>Order ID: {order.orderCode}</strong>
                  <div style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>
                    {new Date(order.createdAt).toLocaleString()} • {order.paymentMethod}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                  <span className={`badge badge-${order.paymentStatus}`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>৳{item.price}</td>
                      <td>৳{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: '0.75rem',
                  gap: '0.75rem'
                }}
              >
                <div style={{ fontSize: '0.9rem' }}>
                  Subtotal: ৳{order.subtotal} | Discount ({order.promotionName}): -৳{order.discount}{' '}
                  | <strong style={{ color: 'var(--primary)' }}>Total: ৳{order.total}</strong>
                </div>
                {order.status === 'Pending' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
