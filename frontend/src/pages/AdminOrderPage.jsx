import { useEffect, useState } from 'react';
import api from '../services/api';

const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = async (orderId, payload) => {
    if (
      payload.status === 'Cancelled' &&
      !window.confirm('Cancel this pending order and restore food stock?')
    ) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await api.patch(`/orders/${orderId}/status`, payload);
      setSuccess('Order updated successfully.');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <button className="btn btn-outline btn-sm" onClick={fetchOrders}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card table-wrap">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Student</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>{order.orderCode}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    {order.userId?.name || 'Student'}
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      {order.userId?.email}
                    </div>
                  </td>
                  <td>
                    {order.items.map((i, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem' }}>
                        {i.name} × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    <strong>৳{order.total}</strong>
                    {order.discount > 0 && (
                      <div style={{ fontSize: '0.76rem', color: 'var(--success)' }}>
                        Saved ৳{order.discount}
                      </div>
                    )}
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ minWidth: '110px' }}
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdate(order._id, { paymentStatus: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ minWidth: '130px' }}
                      value={order.status}
                      onChange={(e) => handleUpdate(order._id, { status: e.target.value })}
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
