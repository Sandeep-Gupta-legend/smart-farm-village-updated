import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Product, CartItem } from '@/types';
import { ShoppingCart, User, Home, Info, Phone, ArrowLeft, Globe, Plus, Minus } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { useSearch, mockSearchProducts } from '@/hooks/useSearch';

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wheat',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
    description: 'High quality wheat from Punjab farms',
    category: 'Grains',
    sellerId: 'seller1',
    quantity: 100
  },
  {
    id: '2',
    name: 'Organic Rice',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e26c?w=300',
    description: 'Chemical-free organic rice',
    category: 'Grains',
    sellerId: 'seller2',
    quantity: 50
  },
  {
    id: '3',
    name: 'Fresh Cotton',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?w=300',
    description: 'Premium cotton for textile industry',
    category: 'Cash Crops',
    sellerId: 'seller3',
    quantity: 25
  }
];

const BuyerMarketplace = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [showCart, setShowCart] = useState(false);
  
  // Use the search hook
  const { searchQuery, handleSearch, searchResults, isSearching } = useSearch(mockSearchProducts);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    address: '',
    paymentMethod: '',
    location: ''
  });

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

  const handlePayment = () => {
    const order = {
      id: Date.now().toString(),
      products: state.cart,
      totalAmount: getTotalAmount(),
      address: paymentData.address,
      paymentMethod: paymentData.paymentMethod,
      status: 'confirmed',
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });
    setShowPayment(false);
    setShowCart(false);
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
            {['home', 'about', 'contact', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {getTranslation(tab, state.language)}
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
        <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-fade-scale">
          <h3 className="text-2xl font-bold text-primary mb-6">Payment Details</h3>
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
              <div className="grid grid-cols-1 gap-2">
                {['UPI', 'Credit Card', 'Cash on Delivery'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentData({...paymentData, paymentMethod: method})}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentData.paymentMethod === method 
                        ? 'bg-primary text-white' 
                        : 'bg-background hover:bg-secondary'
                    }`}
                  >
                    {method}
                  </button>
                ))}
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
    // Use search results if available, otherwise use filtered mock products
    const productsToShow = searchQuery ? searchResults : mockProducts;
    
    return (
      <div className="space-y-8">
        <SearchBar
          placeholder="Search crops, products, or categories..."
          onSearch={handleSearch}
          className="p-3"
        />

        {isSearching && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              Searching...
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsToShow.map((product) => (
            <div key={product.id} className="farm-card group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
              />
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <p className="text-muted-foreground">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">₹{product.price}/kg</span>
                  <span className="text-sm text-muted-foreground">{product.quantity}kg available</span>
                </div>
                <Button 
                  onClick={() => addToCart(product)}
                  className="w-full mt-4"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
  };

  const renderOrderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-primary">Order History</h3>
      {state.orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet</p>
      ) : (
        state.orders.map((order) => (
          <div key={order.id} className="farm-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">Order #{order.id}</h4>
                <p className="text-sm text-muted-foreground">
                  {order.createdAt.toLocaleDateString()}
                </p>
              </div>
              <Badge>{order.status}</Badge>
            </div>
            <div className="space-y-2">
              {order.products.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
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
            {renderOrderHistory()}
          </div>
        );
      case 'about':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="farm-card">
              <h3 className="text-3xl font-bold text-primary mb-6">About Our Marketplace</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect directly with verified farmers and get the best quality crops at fair prices.
                Our platform ensures secure transactions and quality assurance.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="farm-card">
              <h3 className="text-3xl font-bold text-primary mb-6">Contact Support</h3>
              <div className="space-y-4">
                <p><strong>Email:</strong> buyer@smartcropadvisory.com</p>
                <p><strong>Phone:</strong> +91-9876543210</p>
                <p><strong>Support Hours:</strong> 24/7</p>
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