import React, { useState } from "react";
import './AdminPanel.css';

const HARDCODED_EMAIL = "sandeep1legend";
const HARDCODED_PASSWORD = "sandeep123";

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  // Admin features state
  const [orders, setOrders] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addAdminMsg, setAddAdminMsg] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePwdMsg, setChangePwdMsg] = useState("");

  React.useEffect(() => {
    if (loggedIn) {
      fetch('/api/admin/orders')
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(() => setOrders([]));
    }
  }, [loggedIn]);

  const handleStatusChange = (orderId: number, status: string) => {
    fetch('/api/admin/order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status })
    })
      .then(res => res.json())
      .then(() => {
        setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status } : o));
      });
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newAdminEmail })
    })
      .then(res => res.json())
      .then(data => setAddAdminMsg(data.message));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    })
      .then(res => res.json())
      .then(data => setChangePwdMsg(data.message || data.error));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="admin-panel-container">
      {!loggedIn ? (
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <div className="admin-error">{error}</div>}
        </form>
      ) : (
        <div className="admin-dashboard">
          <h2>Welcome, Admin!</h2>
          <div className="admin-section">
            <h3>Delivery Status Management</h3>
            <div className="delivery-list">
              {orders.length === 0 ? (
                <div>No orders found.</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="delivery-item">
                    <span>Order #{order.id} (Buyer: {order.buyer_id})</span>
                    <select value={order.status} className="delivery-status" onChange={e => handleStatusChange(order.id, e.target.value)}>
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="admin-section">
            <h3>Add Admin</h3>
            <form className="add-admin-form" onSubmit={handleAddAdmin}>
              <input type="email" placeholder="New Admin Email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} required />
              <button type="submit">Add Admin</button>
            </form>
            {addAdminMsg && <div style={{color:'#2b6cb0',marginTop:'0.5rem'}}>{addAdminMsg}</div>}
            <p style={{fontSize:'0.9rem',color:'#888'}}>Email verification will be sent to new admin.</p>
          </div>
          <div className="admin-section">
            <h3>Change Password</h3>
            <form className="change-password-form" onSubmit={handleChangePassword}>
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              <button type="submit">Change Password</button>
            </form>
            {changePwdMsg && <div style={{color:'#2b6cb0',marginTop:'0.5rem'}}>{changePwdMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
