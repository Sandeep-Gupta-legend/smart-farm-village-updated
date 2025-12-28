import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Product, CartItem } from '@/types';
import { ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { loadStripe } from '@stripe/stripe-js';

const BuyerMarketplace = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    address: '',
    paymentMethod: '',
    location: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || 'Failed to load products');
        }
        const normalized = (data.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image_url,
          description: p.description,
          category: p.category,
          sellerId: p.seller_id,
          sellerName: p.seller_name,
          sellerState: p.seller_state,
          quantity: p.quantity,
        } as Product));
        setProducts(normalized);
      } catch (err: any) {
        console.error('Fetch products failed:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchOrders();

    // Stripe checkout return handling
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      handleStripeReturn();
      params.delete('session_id');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleStripeReturn = async () => {
    const pending = localStorage.getItem('pendingStripeOrder');
    if (!pending) return;
    try {
      const parsed = JSON.parse(pending);
      await placeOrder('Card (Stripe)', parsed);
      localStorage.removeItem('pendingStripeOrder');
    } catch (err) {
      console.error('Failed to finalize Stripe order:', err);
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found');
      return;
    }
    
    // Decode token to get user ID
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      
      console.log('Fetching orders for user:', userId);
      
      const res = await fetch(`/api/orders/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Orders response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Orders data:', data);
        setOrders(Array.isArray(data) ? data : []);
      } else {
        const errorData = await res.json();
        console.error('Failed to fetch orders:', errorData);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };
  const addToCart = (product: Product, quantity: number = 1) => {
    const cartItem: CartItem = { product, quantity };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const getTotalAmount = () => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const placeOrder = async (paymentMethodLabel: string, payloadOverride?: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to place an order');
      return;
    }

    const source = payloadOverride || {
      cart: state.cart,
      address: paymentData.address,
      location: paymentData.location,
      total: getTotalAmount()
    };

    const orderData = {
      products: source.cart,
      total_amount: source.total,
      address: source.address,
      payment_method: paymentMethodLabel,
      location: source.location
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to place order');
    }

    dispatch({ type: 'ADD_ORDER', payload: {
      id: data.order._id,
      products: orderData.products,
      totalAmount: orderData.total_amount,
      address: orderData.address,
      paymentMethod: paymentMethodLabel,
      status: data.order.status,
      createdAt: new Date(data.order.createdAt)
    }});
    dispatch({ type: 'CLEAR_CART' });
    setShowPayment(false);
    setShowCart(false);
    await fetchOrders();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('#razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  };

  const startRazorpayPayment = async () => {
    try {
      const amount = getTotalAmount();
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login to place an order');
        return;
      }
      await loadRazorpayScript();

      const res = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to initiate Razorpay');

      const options: any = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Smart Farm Village',
        description: 'Order payment',
        order_id: data.orderId,
        prefill: {
          name: state.currentUser?.name,
          email: state.currentUser?.email,
          contact: state.currentUser?.mobile
        },
        handler: async (response: any) => {
          try {
            await placeOrder('UPI (Razorpay)');
            alert('Payment successful');
          } catch (e: any) {
            alert(e.message || 'Payment succeeded but order save failed');
          }
        },
        theme: { color: '#16a34a' }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay payment failed:', err);
      alert(err.message || 'Failed to start Razorpay payment');
    }
  };

  const startStripeCheckout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login to place an order');
        return;
      }

      const payload = {
        cart: state.cart,
        address: paymentData.address,
        location: paymentData.location,
        total: getTotalAmount()
      };

      // Persist pending data for post-redirect order creation
      localStorage.setItem('pendingStripeOrder', JSON.stringify(payload));

      const res = await fetch('/api/payments/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: state.cart })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to start Stripe checkout');

      // Modern Stripe approach: redirect to session URL directly
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err: any) {
      console.error('Stripe checkout failed:', err);
      alert(err.message || 'Failed to start Stripe checkout');
    }
  };

  const handlePayment = async () => {
    const method = paymentData.paymentMethod;
    if (!method) {
      alert('Please select a payment method');
      return;
    }
    if (!paymentData.address.trim()) {
      alert('Please enter delivery address');
      return;
    }

    if (method.startsWith('UPI')) {
      await startRazorpayPayment();
      return;
    }

    if (method.startsWith('Card')) {
      await startStripeCheckout();
      return;
    }

    // Cash on Delivery fallback
    try {
      await placeOrder(method);
      alert('Order placed successfully!');
    } catch (err: any) {
      console.error('Order placement failed:', err);
      alert(err.message || 'Failed to place order. Please try again.');
    }
  };

  const renderNavbar = () => (
    <nav className="farm-navbar sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit
          </Button>
          <div className="flex space-x-6">
            {['home', 'orders', 'about', 'contact', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'orders' ? 'Orders' : getTranslation(tab, state.language)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setShowCart(true)}
            className="text-white hover:text-white/80 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {state.cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                {state.cart.length}
              </Badge>
            )}
          </Button>
          <div className="text-white font-semibold">
            {state.currentUser?.name}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderPaymentModal = () => (
    showPayment && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-xl w-full animate-fade-scale shadow-2xl border border-gray-100">
          <h3 className="text-2xl font-bold text-primary mb-3">Payment Details</h3>
          <p className="text-sm text-muted-foreground mb-6">Secure checkout powered by Razorpay (UPI) and Stripe (Cards)</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Address</label>
              <Input
                type="text"
                value={paymentData.address}
                onChange={(e) => setPaymentData({...paymentData, address: e.target.value})}
                placeholder="Enter delivery address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Live Location</label>
              <Input
                type="text"
                value={paymentData.location}
                onChange={(e) => setPaymentData({...paymentData, location: e.target.value})}
                placeholder="Current location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[ 
                  { label: 'UPI (Razorpay)', value: 'UPI (Razorpay)', note: 'Pay with any UPI app' },
                  { label: 'Card (Stripe)', value: 'Card (Stripe)', note: 'Credit/Debit cards' },
                  { label: 'Cash on Delivery', value: 'Cash on Delivery', note: 'Pay at delivery' }
                ].map((method) => {
                  const isSelected = paymentData.paymentMethod === method.value;
                  return (
                    <button
                      key={method.value}
                      onClick={() => setPaymentData({...paymentData, paymentMethod: method.value})}
                      className={`p-3 rounded-lg border text-left transition duration-200 ${
                        isSelected 
                          ? 'bg-primary text-white shadow-lg scale-[1.01]' 
                          : 'bg-white hover:bg-secondary'
                      }`}
                    >
                      <div className="font-semibold">{method.label}</div>
                      <div className={isSelected ? 'text-white/90 text-sm' : 'text-muted-foreground text-sm'}>{method.note}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="text-lg font-semibold">
              Total: ₹{getTotalAmount()}
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handlePayment} 
                className="flex-1"
                disabled={!paymentData.address || !paymentData.paymentMethod}
              >
                Confirm Order
              </Button>
              <Button variant="outline" onClick={() => setShowPayment(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderCartModal = () => (
    showCart && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-fade-scale max-h-[80vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-primary mb-6">Shopping Cart</h3>
          {state.cart.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {state.cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-muted-foreground">₹{item.product.price} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => removeFromCart(item.product.id)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => addToCart(item.product, 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-xl font-bold text-right">
                Total: ₹{getTotalAmount()}
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => { setShowCart(false); setShowPayment(true); }} className="flex-1">
                  Proceed to Payment
                </Button>
                <Button variant="outline" onClick={() => setShowCart(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );

  const renderProducts = () => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8">
        <SearchBar
          placeholder="Search crops, products, or categories..."
          onSearch={(q) => setSearchQuery(q)}
          className="p-3"
        />

        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              Loading products...
            </div>
          </div>
        )}

        {error && (
          <div style={{backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #f5c6cb'}}>
            {error}
          </div>
        )}

        {searchQuery && filtered.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found for "{searchQuery}"</p>
          </div>
        )}

        {filtered.length === 0 && !searchQuery && !loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products listed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="farm-card group relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <Badge className="bg-green-500 text-white flex items-center gap-1">
                    <span>✓</span> Verified
                  </Badge>
                  {product.quantity <= 0 && (
                    <Badge variant="destructive">Out of stock</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="text-sm text-muted-foreground">Seller: {product.sellerName || 'Unknown'} ({product.sellerState || 'N/A'})</div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">₹{product.price} /kg</span>
                    <span className="text-sm text-muted-foreground">{product.quantity}kg available</span>
                  </div>
                  <Button 
                    onClick={() => addToCart(product)}
                    className="w-full mt-4"
                    disabled={product.quantity <= 0}
                    variant={product.quantity <= 0 ? 'secondary' : 'default'}
                  >
                    {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOrderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-primary">Order History</h3>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="farm-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">Order #{order.id.slice(-8)}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm mt-1"><strong>Address:</strong> {order.address}</p>
                <p className="text-sm"><strong>Payment:</strong> {order.payment_method}</p>
              </div>
              <Badge className={order.status === 'delivered' ? 'bg-green-500' : order.status === 'shipped' ? 'bg-blue-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}>{order.status}</Badge>
            </div>
            <div className="space-y-2">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.product_name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderProducts();
      case 'orders':
        return renderOrderHistory();
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="farm-card">
              <h3 className="text-2xl font-bold text-primary mb-6">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input value={state.currentUser?.name} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'hi', name: 'हिंदी' },
                      { code: 'pa', name: 'ਪੰਜਾਬੀ' }
                    ].map((lang) => (
                      <Button
                        key={lang.code}
                        variant={state.language === lang.code ? 'default' : 'outline'}
                        onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: lang.code as any })}
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="farm-card">
              <h3 className="text-3xl font-bold text-primary mb-6">Buyer Marketplace</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover verified agricultural products directly from trusted sellers.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="farm-card">
              <h3 className="text-3xl font-bold text-primary mb-6">Support</h3>
              <div className="space-y-4">
                <p><strong>Email:</strong> support@smartfarm.com</p>
                <p><strong>Phone:</strong> +91-9876543211</p>
                <p><strong>Support Hours:</strong> 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        );
      default:
        return renderProducts();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderNavbar()}
      <div className="container mx-auto px-6 py-8">
        {renderContent()}
      </div>
      {renderCartModal()}
      {renderPaymentModal()}
    </div>
  );
};

export default BuyerMarketplace;