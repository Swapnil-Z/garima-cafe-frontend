import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { getImageUrl } from '../api/imageUrl';

const CATEGORIES = ['Hot Drinks', 'Cold Drinks', 'Snacks', 'Meals'];

export default function AdminDashboard({ onLogout }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Hot Drinks');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeCategory, setActiveCategory] = useState('Hot Drinks');
  const [mainTab, setMainTab] = useState('dashboard');
  const [searchPhone, setSearchPhone] = useState('');
  const [historyOrders, setHistoryOrders] = useState([]);
  const [historySearched, setHistorySearched] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/menu');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async () => {
    if (!name || !price || !image || !category) {
      setError('Please fill all fields and select an image');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image);
    try {
      await axios.post('/menu', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Item added successfully!');
      setName(''); setPrice(''); setImage(null); setPreview(null);
      fetchItems();
    } catch (err) {
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Item deleted successfully!');
      fetchItems();
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const searchUserHistory = async () => {
    if (!searchPhone || searchPhone.length < 10) {
      setHistoryError('Please enter a valid 10-digit phone number');
      return;
    }
    setHistoryLoading(true);
    setHistoryError('');
    setHistorySearched(false);
    try {
      const res = await axios.get(`/users/history/${searchPhone}`);
      setHistoryOrders(res.data);
      setHistorySearched(true);
    } catch (err) {
      setHistoryError('Failed to fetch history. Check backend.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredItems = items.filter(item => item.category === activeCategory);

  return (
    <div className="admin-dashboard-wrapper" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* FIXED HEADER */}
      <div className="admin-dash-header">
        <div className="admin-dash-header-left">
          <span className="admin-dash-icon">☕</span>
          <div>
            <h2 className="admin-dash-title">Admin Panel</h2>
            <p className="admin-dash-subtitle">Cafe Coffee Break</p>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* TABS */}
      <div className="admin-dash-tabs">
        <button
          className={`admin-dash-tab ${mainTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setMainTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`admin-dash-tab ${mainTab === 'history' ? 'active' : ''}`}
          onClick={() => setMainTab('history')}
        >
          User History
        </button>
      </div>

      {/* TAB: DASHBOARD */}
      {mainTab === 'dashboard' && (
        <div className="admin-dash-content" style={{ flex: 1 }}>

          <div className="admin-form-card">
            <h3 className="admin-form-title">Add New Item</h3>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}
            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label className="admin-field-label">Item Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Masala Tea"
                  className="admin-field-input"
                />
              </div>
              <div className="admin-form-field">
                <label className="admin-field-label">Price (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="e.g. 30"
                  className="admin-field-input"
                />
              </div>
            </div>

            <div className="admin-form-field">
              <label className="admin-field-label">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="admin-field-input"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label className="admin-field-label">Item Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="admin-file-input"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="admin-preview-img"
                />
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={loading}
              className="admin-add-btn"
            >
              {loading ? 'Adding...' : '+ Add Item'}
            </button>
          </div>

          <div className="admin-category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`admin-category-tab ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat} ({items.filter(i => i.category === cat).length})
              </button>
            ))}
          </div>

          <div className="menu-list">
            {filteredItems.length === 0 ? (
              <div className="admin-empty">
                <p>No items in this category yet.</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div className="menu-row" key={item._id}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="row-img"
                    onError={e => e.target.style.display = 'none'}
                  />
                  <div className="row-info">
                    <b>{item.name}</b>
                    <p>₹{item.price}</p>
                    <p style={{ fontSize: '11px', color: '#ffb347' }}>{item.category}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="admin-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: USER HISTORY */}
      {mainTab === 'history' && (
        <div className="admin-dash-content" style={{ flex: 1 }}>
          <div className="admin-form-card">
            <h3 className="admin-form-title">Search User History</h3>
            <p className="admin-form-desc">
              Enter a registered phone number to view their order history
            </p>

            <div className="admin-search-row">
              <input
                type="number"
                className="admin-field-input"
                placeholder="Enter 10-digit phone number"
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchUserHistory()}
                style={{ flex: 1, marginBottom: 0 }}
              />
              <button
                className="admin-add-btn"
                onClick={searchUserHistory}
                style={{ width: 'auto', padding: '11px 28px' }}
              >
                Search
              </button>
            </div>

            {historyError && (
              <div className="admin-alert admin-alert-error" style={{ marginTop: '12px' }}>
                {historyError}
              </div>
            )}
          </div>

          {historyLoading && (
            <div className="admin-empty">
              <p style={{ color: 'white' }}>Loading orders...</p>
            </div>
          )}

          {historySearched && !historyLoading && (
            <div style={{ marginTop: '20px' }}>
              {historyOrders.length === 0 ? (
                <div className="admin-empty">
                  <p>No orders found for +91 {searchPhone}</p>
                </div>
              ) : (
                <>
                  <p className="admin-result-count">
                    {historyOrders.length} order(s) found for +91 {searchPhone}
                  </p>
                  {historyOrders.map((order, i) => (
                    <div className="admin-order-card" key={order._id}>
                      <div className="admin-order-header">
                        <h3>Order {historyOrders.length - i}</h3>
                        <span className="admin-order-total">₹{order.total}</span>
                      </div>
                      <div className="admin-order-details">
                        <span>👤 {order.name}</span>
                        <span>🪑 Table {order.table}</span>
                        <span>💳 {order.payment}</span>
                      </div>
                      <div className="admin-order-items">
                        {order.items.map((it, j) => (
                          <p key={j}>{it.name} × {it.qty} = ₹{it.price}</p>
                        ))}
                      </div>
                      <p className="admin-order-date">{order.date}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="footer-content">
          <div className="footer-left">
            <h3>☕ Cafe Coffee Break</h3>
            <p>Good coffee, good mood ☕</p>
          </div>
          <div className="footer-center">
            <p>📍 Location: Nagar City</p>
            <p>📞 +91 9876543210</p>
          </div>
          <div className="footer-right">
            <p>Follow Us</p>
            <div className="social-icons">
              <i className="ri-instagram-line"></i>
              <i className="ri-facebook-circle-line"></i>
              <i className="ri-whatsapp-line"></i>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Cafe Coffee Break | All Rights Reserved
        </div>
      </footer>

    </div>
  );
}