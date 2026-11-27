import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Snacks', 'Drinks', 'Fast Food', 'Desserts'];

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedMsg, setAddedMsg] = useState('');

  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchFoods = async (searchVal = search, catVal = category) => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchVal.trim()) params.search = searchVal.trim();
      if (catVal !== 'All') params.category = catVal;

      const res = await api.get('/foods', { params });
      setFoods(res.data.foods || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cafeteria menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods(search, category);
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods(search, category);
  };

  const handleAdd = (food) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(food);
    setAddedMsg(`${food.name} added to cart!`);
    setTimeout(() => setAddedMsg(''), 2500);
  };

  return (
    <div className="container">
      <div className="promo-banner">
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            CampusBite – RUET Cafeteria Menu
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.92rem' }}>
            Fresh campus meals with Cash on Pickup. Best promotion is applied automatically!
          </p>
        </div>
        <div className="promo-pills">
          <span className="promo-pill">Combo: Chips + Cake + Juice = ৳150</span>
          <span className="promo-pill">10% Off Orders ≥ ৳500</span>
        </div>
      </div>

      {addedMsg && <div className="alert alert-success">{addedMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSearchSubmit} className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search food by name (e.g., Burger, Chips)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`cat-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </form>

      {loading ? (
        <p>Loading menu...</p>
      ) : foods.length === 0 ? (
        <div className="card">No food items match your search.</div>
      ) : (
        <div className="food-grid">
          {foods.map((food) => {
            const available = food.isAvailable && food.stock > 0;
            return (
              <div className="food-card" key={food._id} data-testid={`food-card-${food.name}`}>
                <img
                  src={food.image || '/images/fallback.svg'}
                  alt={food.name}
                  className="food-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/fallback.svg';
                  }}
                />
                <div className="food-body">
                  <div className="food-meta">
                    <span>{food.category}</span>
                    <span className={`badge ${available ? 'badge-Ready' : 'badge-Cancelled'}`}>
                      {available ? `Stock: ${food.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  <h3 className="food-title">{food.name}</h3>
                  <p className="food-desc">{food.description}</p>
                  <div className="food-footer">
                    <span className="price-tag">৳{food.price}</span>
                    {user?.role !== 'admin' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={!available}
                        onClick={() => handleAdd(food)}
                        data-testid={`add-to-cart-${food.name}`}
                      >
                        {available ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
