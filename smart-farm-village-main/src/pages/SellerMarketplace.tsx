import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { getTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Plus, User, Home, Info, Phone, ArrowLeft, Edit, Trash } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { useSearch, mockSearchProducts } from '@/hooks/useSearch';

const SellerMarketplace = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
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

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      image: newProduct.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
      description: newProduct.description,
      category: newProduct.category,
      quantity: parseInt(newProduct.quantity),
      sellerId: state.currentUser?.id || ''
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', image: '', description: '', category: '', quantity: '' });
    setShowAddProduct(false);
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
              <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
              <Input
                type="url"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleAddProduct} 
                className="flex-1"
                disabled={!newProduct.name || !newProduct.price || !newProduct.quantity}
              >
                Add Product
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
    // Filter products based on search
    const filteredProducts = searchQuery 
      ? products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-primary">My Products</h2>
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
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

        {searchQuery && filteredProducts.length === 0 && !isSearching && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found for "{searchQuery}"</p>
          </div>
        )}

        {filteredProducts.length === 0 && !searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products listed yet</p>
            <Button onClick={() => setShowAddProduct(true)} className="mt-4">
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
            <div key={product.id} className="farm-card group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
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
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
        <h3 className="text-lg font-semibold text-primary mb-2">Revenue This Month</h3>
        <p className="text-3xl font-bold">₹0</p>
      </div>
      <div className="farm-card">
        <h3 className="text-lg font-semibold text-primary mb-2">Orders Pending</h3>
        <p className="text-3xl font-bold">0</p>
      </div>
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