import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Plus, User, Home, Info, Phone, ArrowLeft, Edit, Trash, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { useSearch, mockSearchProducts } from '@/hooks/useSearch';

const SellerMarketplace = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [productStatuses, setProductStatuses] = useState<{ [key: string]: { status: string; reason?: string } }>({});
  const [productFilter, setProductFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  
  // Use the search hook
  const { searchQuery, handleSearch, searchResults, isSearching } = useSearch(mockSearchProducts);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
    quantity: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const buildAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    return headers;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await fetch('/api/products/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await res.json();
      setNewProduct({ ...newProduct, image: data.imageUrl || data.url });
      setImageFile(null);
      setImagePreview(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setNewProduct({ ...newProduct, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fetchMyProducts = async () => {
    if (!authToken) {
      setError('Please log in as a seller to manage products.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/seller/products', { headers: buildAuthHeaders() });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Failed to fetch products');
      }
      const data = await res.json();
      const normalized = (data.products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image_url,
        description: p.description,
        category: p.category,
        quantity: p.quantity,
        sellerId: state.currentUser?.id || '',
      } as Product));
      const statuses: { [key: string]: { status: string; reason?: string } } = {};
      (data.products || []).forEach((p: any) => {
        statuses[p.id] = { status: p.verification_status || 'pending', reason: p.rejection_reason || undefined };
      });
      setProducts(normalized);
      setProductStatuses(statuses);
    } catch (err: any) {
      console.error('Fetch seller products failed:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    if (!authToken) {
      console.log('No auth token for seller orders');
      return;
    }
    try {
      console.log('Fetching seller orders...');
      const res = await fetch('/api/seller/orders', {
        headers: buildAuthHeaders()
      });
      console.log('Seller orders response status:', res.status);
      const data = await res.json();
      console.log('Seller orders data:', data);
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch seller orders:', data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleAddProduct = async () => {
    if (!authToken) {
      setError('Please log in as a seller to add products.');
      return;
    }
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.quantity || !newProduct.image.trim()) {
      setError('Name, price, quantity, and image are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const body = {
        name: newProduct.name,
        price: Number(newProduct.price),
        image_url: newProduct.image,
        description: newProduct.description,
        category: newProduct.category,
        quantity: Number(newProduct.quantity)
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to add product');
      }

      setNewProduct({ name: '', price: '', image: '', description: '', category: '', quantity: '' });
      setShowAddProduct(false);
      await fetchMyProducts();
    } catch (err: any) {
      console.error('Add product failed:', err);
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
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
            onClick={() => setShowAddProduct(true)}
            className="text-white hover:text-white/80"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
          <div className="text-white font-semibold">
            {state.currentUser?.name}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderAddProductModal = () => (
    showAddProduct && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-fade-scale max-h-[80vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-primary mb-6">Add New Product</h3>
          {error && (
            <div style={{backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #f5c6cb'}}>
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <Input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                placeholder="e.g., Grains, Vegetables, Fruits"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹/kg)</label>
              <Input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                placeholder="Enter price per kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity (kg)</label>
              <Input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                placeholder="Available quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Describe your product"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              {/* Image Preview */}
              {imagePreview ? (
                <div className="mb-4 relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-green-500"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleUploadImage}
                      disabled={uploadingImage}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
                    >
                      {uploadingImage ? 'Uploading...' : <>
                        <Check size={18} /> Confirm Upload
                      </>}
                    </button>
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-green-500 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 font-semibold text-green-700"
                  >
                    <Upload size={20} /> Upload Image from Device
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-600 text-center">
                    OR
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Or enter Image URL</label>
                    <Input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}
              {newProduct.image && !imagePreview && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check size={18} /> Image URL added
                  </div>
                  <button
                    onClick={() => setNewProduct({...newProduct, image: ''})}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleAddProduct} 
                className="flex-1"
                disabled={loading || !newProduct.name || !newProduct.price || !newProduct.quantity}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderProducts = () => {
    if (error && !showAddProduct) {
      return (
        <div style={{backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #f5c6cb'}}>
          {error}
        </div>
      );
    }

    // Filter products based on search
    const filteredProducts = searchQuery 
      ? products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;

    // Apply verification status filter
    const statusFilteredProducts = filteredProducts.filter(product => {
      if (productFilter === 'all') return true;
      const status = productStatuses[product.id]?.status || 'pending';
      return status === productFilter;
    });

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-primary">My Products</h2>
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Product Status Filter Tabs */}
        <div style={{display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e0e0e0', paddingBottom: '0.5rem', flexWrap: 'wrap'}}>
          {(['all', 'pending', 'verified', 'rejected'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setProductFilter(filter)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: productFilter === filter ? '#007bff' : 'transparent',
                color: productFilter === filter ? 'white' : '#666',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: productFilter === filter ? 'bold' : 'normal',
                textTransform: 'capitalize'
              }}
            >
              {filter === 'all' ? 'All Products' : filter === 'pending' ? '⏳ Pending' : filter === 'verified' ? '✓ Verified' : '✗ Rejected'}
            </button>
          ))}
        </div>

        <SearchBar
          placeholder="Search your products..."
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

        {searchQuery && statusFilteredProducts.length === 0 && !isSearching && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found for "{searchQuery}"</p>
          </div>
        )}

        {statusFilteredProducts.length === 0 && !searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {productFilter === 'all' ? 'No products listed yet' : `No ${productFilter} products`}
            </p>
            {productFilter === 'all' && (
              <Button onClick={() => setShowAddProduct(true)} className="mt-4">
                Add Your First Product
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusFilteredProducts.map((product) => {
              const status = productStatuses[product.id]?.status || 'pending';
              const rejectionReason = productStatuses[product.id]?.reason;
              
              return (
            <div key={product.id} className="farm-card group relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              {/* Status Badge */}
              <div style={{position: 'absolute', top: '0.5rem', right: '0.5rem'}}>
                {status === 'verified' && (
                  <Badge style={{backgroundColor: '#28a745', color: 'white'}}>✓ Verified</Badge>
                )}
                {status === 'pending' && (
                  <Badge style={{backgroundColor: '#ffc107', color: 'white'}}>⏳ Pending</Badge>
                )}
                {status === 'rejected' && (
                  <Badge style={{backgroundColor: '#dc3545', color: 'white'}}>✗ Rejected</Badge>
                )}
              </div>
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
                
                {status === 'rejected' && rejectionReason && (
                  <div style={{backgroundColor: '#fff3cd', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid #dc3545', fontSize: '0.85rem'}}>
                    <strong>Rejection Reason:</strong>
                    <p style={{margin: '0.25rem 0 0 0', color: '#666'}}>{rejectionReason}</p>
                  </div>
                )}
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      handleDeleteProduct(product.id);
                      const newStatuses = {...productStatuses};
                      delete newStatuses[product.id];
                      setProductStatuses(newStatuses);
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
              );
            })}
        </div>
      )}
    </div>
  );
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="farm-card">
        <h3 className="text-lg font-semibold text-primary mb-2">Total Products</h3>
        <p className="text-3xl font-bold">{products.length}</p>
      </div>
      <div className="farm-card">
        <h3 className="text-lg font-semibold text-primary mb-2">Total Orders</h3>
        <p className="text-3xl font-bold">{orders.length}</p>
      </div>
      <div className="farm-card">
        <h3 className="text-lg font-semibold text-primary mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold">₹{orders.reduce((sum, o) => sum + (o.seller_total || 0), 0).toFixed(2)}</p>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-primary">My Orders</h3>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="farm-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">Order #{order.id.slice(-8)}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Buyer:</strong> {order.buyer_name} ({order.buyer_state})
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {order.buyer_phone}
                  </p>
                  <p className="text-sm">
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p className="text-sm">
                    <strong>Payment:</strong> {order.payment_method}
                  </p>
                </div>
                <Badge className={
                  order.status === 'delivered' ? 'bg-green-500' :
                  order.status === 'shipped' ? 'bg-blue-500' :
                  order.status === 'cancelled' ? 'bg-red-500' :
                  'bg-yellow-500'
                }>{order.status}</Badge>
              </div>
              <div className="border-t pt-3 mt-3">
                <h5 className="font-semibold mb-2">Items:</h5>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{item.product_name} ({item.category}) x {item.quantity}</span>
                    <span className="font-semibold">₹{item.total}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.seller_total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            {renderDashboard()}
            {renderProducts()}
          </div>
        );
      case 'orders':
        return renderOrders();
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="farm-card">
              <h3 className="text-2xl font-bold text-primary mb-6">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input value={state.currentUser?.name} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GST Number</label>
                  <Input value={state.currentUser?.gstNumber} disabled />
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
              <h3 className="text-3xl font-bold text-primary mb-6">Seller Dashboard</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Manage your crop listings, track sales, and connect with buyers directly.
                Our platform provides you with tools to grow your agricultural business.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="farm-card">
              <h3 className="text-3xl font-bold text-primary mb-6">Seller Support</h3>
              <div className="space-y-4">
                <p><strong>Email:</strong> seller@smartcropadvisory.com</p>
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
      {renderAddProductModal()}
    </div>
  );
};

export default SellerMarketplace;