import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalFoods: 0,
    outOfStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/foods'), api.get('/orders')])
      .then(([foodsRes, ordersRes]) => {
        const foods = foodsRes.data.foods || [];
        const orders = ordersRes.data.orders || [];

        const outOfStock = foods.filter((f) => !f.isAvailable || f.stock <= 0).length;
        const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
        const revenue = orders
          .filter((o) => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + Number(o.total || 0), 0);

        setStats({
          totalFoods: foods.length,
          outOfStock,
          totalOrders: orders.length,
          pendingOrders,
          revenue
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/foods" className="btn btn-primary">
            Manage Foods
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            Manage Orders
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Menu Items</div>
            <div className="stat-value">{stats.totalFoods}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Out of Stock Items</div>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>
              {stats.outOfStock}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Orders</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              {stats.pendingOrders}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Order Revenue</div>
            <div className="stat-value">৳{stats.revenue}</div>
          </div>
        </div>
      )}
    </div>
  );
}
