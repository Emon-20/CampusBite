import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Campus<span>Bite</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Menu
          </Link>

          {user?.role === 'student' && (
            <>
              <Link to="/cart" className="nav-link" data-testid="nav-cart">
                Cart
                {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
              </Link>
              <Link to="/my-orders" className="nav-link">
                My Orders
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="nav-link">
                Dashboard
              </Link>
              <Link to="/admin/foods" className="nav-link">
                Foods
              </Link>
              <Link to="/admin/orders" className="nav-link">
                Orders
              </Link>
            </>
          )}

          {user ? (
            <>
              <span style={{ fontSize: '0.88rem', opacity: 0.9 }}>
                Hi, {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
