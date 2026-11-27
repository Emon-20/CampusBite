import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [summary, setSummary] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
    promotionName: 'None'
  });
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      setSummary({ subtotal: 0, discount: 0, total: 0, promotionName: 'None' });
      return;
    }

    api
      .post('/orders/preview', {
        items: cartItems.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity
        }))
      })
      .then((res) => setSummary(res.data))
      .catch(() => {
        const sub = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
        setSummary({ subtotal: sub, discount: 0, total: sub, promotionName: 'None' });
      });
  }, [cartItems]);

  const handleConfirmOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      const res = await api.post('/orders', {
        items: cartItems.map((i) => ({
          foodId: i.foodId,
          quantity: i.quantity
        }))
      });
      setConfirmedOrder(res.data.order);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '620px', margin: '0 auto' }} data-testid="order-receipt">
          <div className="alert alert-success">
            Order Confirmed! Please pay <strong>৳{confirmedOrder.total}</strong> via{' '}
            <strong>{confirmedOrder.paymentMethod}</strong>.
          </div>
          <h2 className="page-title" style={{ marginBottom: '0.75rem' }}>
            Order Receipt
          </h2>
          <p>
            <strong>Order ID:</strong> {confirmedOrder.orderCode}
          </p>
          <p>
            <strong>Date:</strong> {new Date(confirmedOrder.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`badge badge-${confirmedOrder.status}`}>{confirmedOrder.status}</span>
          </p>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {confirmedOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>৳{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <p>Subtotal: ৳{confirmedOrder.subtotal}</p>
            <p style={{ color: 'var(--success)' }}>
              Discount ({confirmedOrder.promotionName}): -৳{confirmedOrder.discount}
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
              Total Payable: ৳{confirmedOrder.total}
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <Link to="/my-orders" className="btn btn-primary">
              View My Orders
            </Link>
            <Link to="/" className="btn btn-outline">
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <Link to="/" className="btn btn-outline">
          Continue Browsing
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {cartItems.length === 0 ? (
        <div className="card">
          Your cart is empty. <Link to="/" style={{ color: 'var(--secondary)' }}>Browse the menu</Link> to add items.
        </div>
      ) : (
        <div className="cart-layout">
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Line Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.foodId}>
                    <td>{item.name}</td>
                    <td>৳{item.price}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => updateQuantity(item.foodId, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => updateQuantity(item.foodId, 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>৳{item.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.foodId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal</span>
              <strong>৳{summary.subtotal}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Promotion</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                {summary.promotionName}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                color: 'var(--success)'
              }}
            >
              <span>Discount</span>
              <strong>-৳{summary.discount}</strong>
            </div>
            <hr style={{ margin: '0.75rem 0', borderColor: 'var(--border)' }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              <span>Payable Total</span>
              <span style={{ color: 'var(--primary)' }}>৳{summary.total}</span>
            </div>

            <div className="alert alert-info" style={{ fontSize: '0.85rem' }}>
              Payment Method: <strong>Cash on Pickup</strong>
            </div>

            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={handleConfirmOrder}
              disabled={placing}
              data-testid="confirm-order-btn"
            >
              {placing ? 'Placing Order...' : 'Confirm Order (Cash on Pickup)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
