import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function WelcomePage({ onEnter, showAdminLogin }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleEnter = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/users/login', { phone });
      if (res.data.success) {
        onEnter(phone);
      }
    } catch (err) {
      setError('Something went wrong. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome-page">

      {/* ANIMATED BACKGROUND CIRCLES */}
      <div className="welcome-bg-circle circle-1" />
      <div className="welcome-bg-circle circle-2" />
      <div className="welcome-bg-circle circle-3" />

      {/* HEADER */}
      <div className={`welcome-header ${visible ? 'slide-down' : ''}`}>
        <div className="welcome-logo">☕ Cafe Coffee Break</div>
        <div className="welcome-header-right">
          <span className="welcome-tagline-small">Est. 2024</span>
          <button className="admin-top-btn" onClick={showAdminLogin}>
            Admin
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className={`welcome-hero ${visible ? 'fade-up' : ''}`}>

        {/* LEFT TEXT */}
        <div className="welcome-hero-left">
          <p className="welcome-small-text">Welcome to</p>
          <h1 className="welcome-big-text">Cafe<br />Coffee<br />Break</h1>
          <p className="welcome-slogan">
            "Where every sip tells a story"
          </p>
          <div className="welcome-features">
            <span className="welcome-feature-tag">☕ Hot Drinks</span>
            <span className="welcome-feature-tag">🧊 Cold Drinks</span>
            <span className="welcome-feature-tag">🍱 Meals</span>
            <span className="welcome-feature-tag">🥪 Snacks</span>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className={`welcome-card ${visible ? 'fade-up-delay' : ''}`}>
          <div className="welcome-card-icon">☕</div>
          <h2 className="welcome-card-title">Enter Cafe</h2>
          <p className="welcome-card-subtitle">
            Login with your phone number to order
          </p>

          <div className="welcome-divider" />

          <label className="welcome-label">Phone Number</label>
          <input
            type="number"
            className="welcome-input"
            placeholder="eg. 9876543210"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          {error && <p className="welcome-error">{error}</p>}

          <button
            className="welcome-btn"
            onClick={handleEnter}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Enter Cafe ☕'}
          </button>

          <p className="welcome-note">
            New here? We'll create your account automatically!
          </p>
        </div>
      </div>

      {/* SCROLLING MARQUEE */}
      <div className="welcome-marquee-wrapper">
        <div className="welcome-marquee">
          <span>☕ Hot Tea &nbsp;•&nbsp;</span>
          <span>🧊 Cold Coffee &nbsp;•&nbsp;</span>
          <span>🍱 Veg Thali &nbsp;•&nbsp;</span>
          <span>🥪 Sandwich &nbsp;•&nbsp;</span>
          <span>🍜 Noodles &nbsp;•&nbsp;</span>
          <span>☕ Green Tea &nbsp;•&nbsp;</span>
          <span>🥘 Puri Bhaji &nbsp;•&nbsp;</span>
          <span>🧆 Samosa &nbsp;•&nbsp;</span>
          <span>🍚 Fried Rice &nbsp;•&nbsp;</span>
          <span>☕ Hot Tea &nbsp;•&nbsp;</span>
          <span>🧊 Cold Coffee &nbsp;•&nbsp;</span>
          <span>🍱 Veg Thali &nbsp;•&nbsp;</span>
          <span>🥪 Sandwich &nbsp;•&nbsp;</span>
          <span>🍜 Noodles &nbsp;•&nbsp;</span>
          <span>☕ Green Tea &nbsp;•&nbsp;</span>
          <span>🥘 Puri Bhaji &nbsp;•&nbsp;</span>
          <span>🧆 Samosa &nbsp;•&nbsp;</span>
          <span>🍚 Fried Rice &nbsp;•&nbsp;</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`welcome-footer ${visible ? 'fade-up' : ''}`}>
        <div className="welcome-footer-left">
          <span>📍 Nagar City</span>
          <span>📞 +91 9876543210</span>
        </div>
        <div className="welcome-footer-center">
          © 2026 Cafe Coffee Break | All Rights Reserved
        </div>
        <div className="welcome-footer-right">
          <i className="ri-instagram-line" />
          <i className="ri-facebook-circle-line" />
          <i className="ri-whatsapp-line" />
        </div>
      </div>

    </div>
  );
}