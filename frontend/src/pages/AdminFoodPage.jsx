import { useEffect, useState } from 'react';
import api from '../services/api';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'Snacks',
  price: '',
  stock: '',
  image: ''
};

export default function AdminFoodPage() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await api.get('/foods');
      setFoods(res.data.foods || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image
    };

    try {
      if (editingId) {
        await api.put(`/foods/${editingId}`, payload);
        setSuccess('Food item updated successfully.');
      } else {
        await api.post('/foods', payload);
        setSuccess('Food item added successfully.');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save food item');
    }
  };

  const startEdit = (food) => {
    setEditingId(food._id);
    setForm({
      name: food.name,
      description: food.description,
      category: food.category,
      price: String(food.price),
      stock: String(food.stock),
      image: food.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (food) => {
    if (!window.confirm(`Delete "${food.name}" from the menu?`)) return;
    try {
      setError('');
      await api.delete(`/foods/${food._id}`);
      setSuccess(`Deleted "${food.name}".`);
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete food');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Food Management</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
          {editingId ? 'Edit Food Item' : 'Add New Food Item'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}
          >
            <div className="form-group">
              <label>Food Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Snacks">Snacks</option>
                <option value="Drinks">Drinks</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price (৳)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL (optional)</label>
              <input
                type="text"
                className="form-control"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/images/snacks.svg"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Food' : 'Add Food'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card table-wrap">
        {loading ? (
          <p>Loading foods...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>
                    <strong>{food.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {food.description}
                    </div>
                  </td>
                  <td>{food.category}</td>
                  <td>৳{food.price}</td>
                  <td>{food.stock}</td>
                  <td>
                    <span className={`badge ${food.isAvailable ? 'badge-Ready' : 'badge-Cancelled'}`}>
                      {food.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(food)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(food)}>
                        Delete
                      </button>
                    </div>
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
