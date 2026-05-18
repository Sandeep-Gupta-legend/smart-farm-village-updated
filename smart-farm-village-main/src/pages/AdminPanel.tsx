import React, { useState, useEffect } from "react";
import './AdminPanel.css';

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem("adminToken"));
  
  // Admin features state
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [verifiedProducts, setVerifiedProducts] = useState<any[]>([]);
  const [rejectedProducts, setRejectedProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'pending' | 'verified' | 'rejected'>('orders');
  
  // Admin management state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addAdminMsg, setAddAdminMsg] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePwdMsg, setChangePwdMsg] = useState("");
  
  // Product rejection state
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  const buildAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
    return headers;
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setLoggedIn(false);
    setError('Session expired. Please login again.');
  };

  // Restore session from stored token
  useEffect(() => {
    if (adminToken) {
      setLoggedIn(true);
    }
  }, [adminToken]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', { headers: buildAuthHeaders() });
      if (response.status === 401) { handleUnauthorized(); return; }
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      // Ensure data is always an array
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  };

  const fetchPendingProducts = async () => {
    try {
      const response = await fetch('/api/admin/products/pending', { headers: buildAuthHeaders() });
      if (response.status === 401) { handleUnauthorized(); return; }
      const data = await response.json();
      setPendingProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch pending products:', err);
      setPendingProducts([]);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const headers = buildAuthHeaders();
      // Fetch verified products
      const verifiedRes = await fetch('/api/admin/products?status=verified', { headers });
      if (verifiedRes.status === 401) { handleUnauthorized(); return; }
      const verifiedData = await verifiedRes.json();
      setVerifiedProducts(verifiedData.products || []);

      // Fetch rejected products
      const rejectedRes = await fetch('/api/admin/products?status=rejected', { headers });
      if (rejectedRes.status === 401) { handleUnauthorized(); return; }
      const rejectedData = await rejectedRes.json();
      setRejectedProducts(rejectedData.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setVerifiedProducts([]);
      setRejectedProducts([]);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchOrders();
      fetchPendingProducts();
      fetchAllProducts();
    }
  }, [loggedIn]);

  const handleVerifyProduct = async (productId: string) => {
    try {
      const headers = buildAuthHeaders();
      const response = await fetch(`/api/admin/products/${productId}/verify`, {
        method: 'POST',
        headers
      });
      if (response.status === 401) { handleUnauthorized(); return; }
      const data = await response.json();
      
      if (response.ok) {
        setActionMessage(`✓ Product "${data.product.name}" verified successfully!`);
        fetchPendingProducts();
        fetchAllProducts();
        setTimeout(() => setActionMessage(""), 3000);
      } else {
        setActionMessage(`✗ Error: ${data.error || 'Failed to verify product'}`);
      }
    } catch (err) {
      setActionMessage("✗ Error verifying product");
      console.error(err);
    }
  };

  const handleRejectProduct = async (productId: string) => {
    if (!rejectionReason.trim()) {
      setActionMessage("✗ Please provide a rejection reason");
      return;
    }

    try {
      const headers = buildAuthHeaders();
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason: rejectionReason })
      });
      if (response.status === 401) { handleUnauthorized(); return; }
      const data = await response.json();
      
      if (response.ok) {
        setActionMessage(`✓ Product "${data.product.name}" rejected successfully!`);
        setRejectionReason("");
        setSelectedProductId(null);
        fetchPendingProducts();
        fetchAllProducts();
        setTimeout(() => setActionMessage(""), 3000);
      } else {
        setActionMessage(`✗ Error: ${data.error || 'Failed to reject product'}`);
      }
    } catch (err) {
      setActionMessage("✗ Error rejecting product");
      console.error(err);
    }
  };

  const handleStatusChange = (orderId: string, status: string) => {
    const headers = buildAuthHeaders();
    fetch('/api/admin/order-status', {
      method: 'POST',
      headers,
      body: JSON.stringify({ orderId, status })
    })
      .then(res => {
        if (res.status === 401) { handleUnauthorized(); return Promise.reject(new Error('unauthorized')); }
        return res.json();
      })
      .then(() => {
        setOrders(orders => orders.map(o => o._id === orderId || o.id === orderId ? { ...o, status } : o));
        setActionMessage("✓ Order status updated successfully!");
        setTimeout(() => setActionMessage(""), 3000);
      })
      .catch(err => {
        setActionMessage("✗ Error updating order status");
        console.error(err);
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
      .then(data => {
        setAddAdminMsg(data.message);
        setNewAdminEmail("");
      });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    })
      .then(res => res.json())
      .then(data => {
        setChangePwdMsg(data.message || data.error);
        setCurrentPassword("");
        setNewPassword("");
      });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password, userType: 'admin' })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Invalid credentials. Please try again.');
        setLoggedIn(false);
        return;
      }

      if (data?.user?.userType !== 'admin') {
        setError('You must log in with an admin account.');
        setLoggedIn(false);
        return;
      }

      localStorage.setItem('adminToken', data.token);
      setAdminToken(data.token);
      setLoggedIn(true);
      setError("");
      setPassword("");
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Login failed. Please try again.');
    }
  };

  const renderPendingProductsTab = () => (
    <div className="admin-section">
      <h3>Pending Products Verification ({pendingProducts.length})</h3>
      {actionMessage && <div style={{marginBottom: '1rem', padding: '0.75rem', backgroundColor: actionMessage.includes('✓') ? '#d4edda' : '#f8d7da', color: actionMessage.includes('✓') ? '#155724' : '#721c24', borderRadius: '4px'}}>{actionMessage}</div>}
      
      {pendingProducts.length === 0 ? (
        <div style={{padding: '1rem', color: '#666'}}>No pending products for verification.</div>
      ) : (
        <div className="products-list">
          {pendingProducts.map(product => (
            <div key={product.id} className="product-card" style={{border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#f9f9f9'}}>
              <div style={{display: 'flex', gap: '1rem'}}>
                {product.image_url && <img src={product.image_url} alt={product.name} style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px'}} />}
                <div style={{flex: 1}}>
                  <h4 style={{margin: '0 0 0.5rem 0'}}>{product.name}</h4>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Price: ₹{product.price}</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Category: {product.category || 'N/A'}</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Seller: {product.seller_name} ({product.seller_state})</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.85rem', color: '#999'}}>Quantity: {product.quantity}</p>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px'}}>
                  <button onClick={() => handleVerifyProduct(product.id)} style={{padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'}}>✓ Verify</button>
                  <button onClick={() => setSelectedProductId(product.id)} style={{padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'}}>✗ Reject</button>
                </div>
              </div>
              
              {selectedProductId === product.id && (
                <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd'}}>
                  <textarea
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontFamily: 'inherit', minHeight: '60px'}}
                  />
                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                    <button onClick={() => handleRejectProduct(product.id)} style={{padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Confirm Reject</button>
                    <button onClick={() => {setSelectedProductId(null); setRejectionReason("");}} style={{padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVerifiedProductsTab = () => (
    <div className="admin-section">
      <h3>Verified Products ({verifiedProducts.length})</h3>
      {verifiedProducts.length === 0 ? (
        <div style={{padding: '1rem', color: '#666'}}>No verified products yet.</div>
      ) : (
        <div className="products-list">
          {verifiedProducts.map(product => (
            <div key={product.id} className="product-card" style={{border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#f0f8ff'}}>
              <div style={{display: 'flex', gap: '1rem'}}>
                {product.image_url && <img src={product.image_url} alt={product.name} style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px'}} />}
                <div style={{flex: 1}}>
                  <h4 style={{margin: '0 0 0.5rem 0'}}>{product.name} <span style={{backgroundColor: '#28a745', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginLeft: '0.5rem'}}>✓ Verified</span></h4>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Price: ₹{product.price}</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Category: {product.category || 'N/A'}</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Seller: {product.seller_name}</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.85rem', color: '#999'}}>Quantity: {product.quantity} | Verified on: {new Date(product.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRejectedProductsTab = () => (
    <div className="admin-section">
      <h3>Rejected Products ({rejectedProducts.length})</h3>
      {rejectedProducts.length === 0 ? (
        <div style={{padding: '1rem', color: '#666'}}>No rejected products.</div>
      ) : (
        <div className="products-list">
          {rejectedProducts.map(product => (
            <div key={product.id} className="product-card" style={{border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#fff5f5'}}>
              <div style={{display: 'flex', gap: '1rem'}}>
                {product.image_url && <img src={product.image_url} alt={product.name} style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px'}} />}
                <div style={{flex: 1}}>
                  <h4 style={{margin: '0 0 0.5rem 0'}}>{product.name} <span style={{backgroundColor: '#dc3545', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginLeft: '0.5rem'}}>✗ Rejected</span></h4>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Price: ₹{product.price}</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Category: {product.category || 'N/A'}</p>
                  <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#666'}}>Seller: {product.seller_name}</p>
                  <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', backgroundColor: '#fff3cd', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid #dc3545'}}>
                    <strong>Reason:</strong> {product.rejection_reason || 'No reason provided'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrdersTab = () => (
    <div className="admin-section">
      <h3>Delivery Status Management</h3>
      {actionMessage && <div style={{marginBottom: '1rem', padding: '0.75rem', backgroundColor: actionMessage.includes('✓') ? '#d4edda' : '#f8d7da', color: actionMessage.includes('✓') ? '#155724' : '#721c24', borderRadius: '4px'}}>{actionMessage}</div>}
      
      <div className="delivery-list">
        {!orders || orders.length === 0 ? (
          <div style={{padding: '1rem', color: '#666'}}>No orders found.</div>
        ) : (
          orders.map(order => (
            <div key={order._id || order.id} className="delivery-item" style={{padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <span style={{fontWeight: 'bold'}}>Order #{(order._id || order.id).toString().slice(-6)}</span>
                <p style={{margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666'}}>Buyer ID: {order.buyer_id}</p>
              </div>
              <select
                value={order.status || 'pending'}
                onChange={e => handleStatusChange(order._id || order.id, e.target.value)}
                style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: order.status === 'delivered' ? '#d4edda' : order.status === 'cancelled' ? '#f8d7da' : 'white'}}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );

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
          
          {/* Tab Navigation */}
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #ddd', flexWrap: 'wrap'}}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === 'orders' ? '#007bff' : 'transparent',
                color: activeTab === 'orders' ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === 'orders' ? '3px solid #0056b3' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'orders' ? 'bold' : 'normal'
              }}
            >
              📦 Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === 'pending' ? '#ffc107' : 'transparent',
                color: activeTab === 'pending' ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === 'pending' ? '3px solid #e0a800' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'pending' ? 'bold' : 'normal'
              }}
            >
              ⏳ Pending ({pendingProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === 'verified' ? '#28a745' : 'transparent',
                color: activeTab === 'verified' ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === 'verified' ? '3px solid #1e7e34' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'verified' ? 'bold' : 'normal'
              }}
            >
              ✓ Verified ({verifiedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === 'rejected' ? '#dc3545' : 'transparent',
                color: activeTab === 'rejected' ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === 'rejected' ? '3px solid #bd2130' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'rejected' ? 'bold' : 'normal'
              }}
            >
              ✗ Rejected ({rejectedProducts.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'pending' && renderPendingProductsTab()}
          {activeTab === 'verified' && renderVerifiedProductsTab()}
          {activeTab === 'rejected' && renderRejectedProductsTab()}

          {/* Admin Management Section */}
          <div style={{marginTop: '2rem', borderTop: '2px solid #ddd', paddingTop: '1.5rem'}}>
            <h3>Admin Settings</h3>
            <div className="admin-section">
              <h4>Add New Admin</h4>
              <form className="add-admin-form" onSubmit={handleAddAdmin} style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
                <input type="email" placeholder="New Admin Email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} required style={{flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd'}} />
                <button type="submit" style={{padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Add Admin</button>
              </form>
              {addAdminMsg && <div style={{color:'#2b6cb0', marginBottom: '1rem'}}>{addAdminMsg}</div>}
              <p style={{fontSize:'0.9rem', color:'#888'}}>Email verification will be sent to new admin.</p>
            </div>

            <div className="admin-section">
              <h4>Change Password</h4>
              <form className="change-password-form" onSubmit={handleChangePassword} style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem'}}>
                <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd'}} />
                <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd'}} />
                <button type="submit" style={{padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start'}}>Change Password</button>
              </form>
              {changePwdMsg && <div style={{color:'#2b6cb0'}}>{changePwdMsg}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
