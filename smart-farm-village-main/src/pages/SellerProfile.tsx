import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  TrendingUp,
  Star,
  Edit2,
  LogOut,
  DollarSign,
  Users,
  AlertCircle,
  Check,
  X,
  BarChart3,
  Plus,
  Eye,
  Trash2,
  Camera,
  Award,
  Calendar
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  status: string;
}

interface SalesData {
  totalRevenue: number;
  totalSales: number;
  activeProducts: number;
  averageRating: number;
}

const SellerProfile = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 0,
    totalSales: 0,
    activeProducts: 0,
    averageRating: 4.8
  });
  const [isEditing, setIsEditing] = useState(false);
  const [storePhoto, setStorePhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({
    storeName: state.user?.storeName || '',
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    address: state.user?.address || '',
    city: state.user?.city || '',
    state: state.user?.state || '',
    pincode: state.user?.pincode || '',
    storeDescription: state.user?.storeDescription || '',
    bankAccount: state.user?.bankAccount || '',
    gstNumber: state.user?.gstNumber || '',
    businessType: state.user?.businessType || 'individual',
    websiteUrl: state.user?.websiteUrl || '',
    farmSize: state.user?.farmSize || '',
    cropTypes: state.user?.cropTypes || ''
  });

  useEffect(() => {
    if (!state.user || state.user.userType !== 'seller') {
      navigate('/login');
      return;
    }
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [productsRes, salesRes] = await Promise.all([
        fetch('/api/products/my-products', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/sellers/sales-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data);
      }
      if (salesRes.ok) {
        const data = await salesRes.json();
        setSalesData(data);
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setStorePhoto(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!storePhoto) {
      alert('Please select a photo first');
      return;
    }

    const formData = new FormData();
    formData.append('file', storePhoto);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/upload-store-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        alert('Store photo uploaded successfully');
        setPhotoPreview(null);
        setStorePhoto(null);
      } else {
        alert('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setStorePhoto(null);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        alert('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const stats = [
    { label: 'Total Revenue', value: `₹${salesData.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Total Sales', value: salesData.totalSales, icon: ShoppingBag, color: 'blue' },
    { label: 'Active Products', value: salesData.activeProducts, icon: TrendingUp, color: 'purple' },
    { label: 'Average Rating', value: `${salesData.averageRating}/5`, icon: Star, color: 'yellow' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 pt-20">
      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-emerald-600">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Profile Photo Upload */}
              <div className="col-span-2">
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-5xl font-bold overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        state.user?.storePhoto ? (
                          <img src={state.user.storePhoto} alt="Store" className="w-full h-full object-cover" />
                        ) : (
                          state.user?.storeName?.charAt(0) || 'S'
                        )
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-3 bg-emerald-600 rounded-full text-white hover:bg-emerald-700 transition-colors duration-300 shadow-lg"
                    >
                      <Camera size={20} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {state.user?.storeName || 'My Store'}
                    </h1>
                    <p className="text-emerald-600 text-lg font-semibold mb-1">
                      {state.user?.firstName} {state.user?.lastName}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">Member since {new Date(state.user?.createdAt || Date.now()).toLocaleDateString()}</p>
                    
                    {photoPreview && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={handleUploadPhoto}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 font-semibold flex items-center gap-2"
                        >
                          <Check size={18} /> Upload Photo
                        </button>
                        <button
                          onClick={handleRemovePhoto}
                          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300 font-semibold flex items-center gap-2"
                        >
                          <X size={18} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Store Name"
                      value={editForm.storeName}
                      onChange={(e) => setEditForm({ ...editForm, storeName: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={editForm.businessType}
                      onChange={(e) => setEditForm({ ...editForm, businessType: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="individual">Individual Farmer</option>
                      <option value="cooperative">Farming Cooperative</option>
                      <option value="company">Company</option>
                    </select>
                    <textarea
                      placeholder="Store Description"
                      value={editForm.storeDescription}
                      onChange={(e) => setEditForm({ ...editForm, storeDescription: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={editForm.pincode}
                      onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="GST Number"
                      value={editForm.gstNumber}
                      onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Bank Account (for payments)"
                      value={editForm.bankAccount}
                      onChange={(e) => setEditForm({ ...editForm, bankAccount: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Website URL"
                      value={editForm.websiteUrl}
                      onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Farm Size (e.g., 5 acres)"
                      value={editForm.farmSize}
                      onChange={(e) => setEditForm({ ...editForm, farmSize: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Crop Types (e.g., Rice, Wheat, Vegetables)"
                      value={editForm.cropTypes}
                      onChange={(e) => setEditForm({ ...editForm, cropTypes: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="col-span-2 flex gap-3">
                      <button
                        onClick={handleUpdateProfile}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
                      >
                        <Check size={20} /> Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
                      >
                        <X size={20} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} className="text-emerald-600" /> {state.user?.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} className="text-emerald-600" /> {state.user?.phone || 'Not added'}
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-emerald-600" /> {state.user?.address}, {state.user?.city}, {state.user?.state} - {state.user?.pincode}
                    </div>
                    {state.user?.storeDescription && (
                      <div className="col-span-2 text-gray-700">
                        <p className="font-semibold text-emerald-600 mb-1">Store Description</p>
                        <p>{state.user.storeDescription}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit2 size={20} /> Edit Profile
                  </button>
                )}
                <button
                  onClick={() => navigate('/seller-marketplace')}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add Product
                </button>
                <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold">
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-emerald-600 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 flex-wrap">
            {['overview', 'products', 'analytics', 'orders', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === tab
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-emerald-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-600" /> Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Store Verified</span>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Account Active</span>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700">Bank Account Verified</span>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Total Views</span>
                    <span className="text-blue-600 font-bold text-lg">1.2K</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Conversion Rate</span>
                    <span className="text-green-600 font-bold text-lg">4.2%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Customer Satisfaction</span>
                    <span className="text-purple-600 font-bold text-lg">98%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Your Products</h3>
                <button
                  onClick={() => navigate('/seller-marketplace')}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
                >
                  <Plus size={20} /> Add New Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-emerald-600 animate-fade-in-up"
                  >
                    <div className="h-40 bg-gradient-to-br from-emerald-200 to-emerald-400 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h4>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-emerald-600">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {product.quantity} in stock
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2">
                          <Eye size={18} /> View
                        </button>
                        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2">
                          <Trash2 size={18} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-6">Start adding products to your store</p>
                  <button
                    onClick={() => navigate('/seller-marketplace')}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 font-semibold inline-block"
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Sales Analytics</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Monthly Revenue</h4>
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">₹45,000</div>
                  <p className="text-blue-700 text-sm">↑ 12% from last month</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Orders This Month</h4>
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">124</div>
                  <p className="text-green-700 text-sm">↑ 8% from last month</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Pending Orders</h4>
                    <AlertCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
                  <p className="text-purple-700 text-sm">Average delivery: 3 days</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Customer Rating</h4>
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">4.8/5</div>
                  <p className="text-yellow-700 text-sm">Based on 245 reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors duration-300">
                        <td className="px-6 py-4 text-sm font-mono text-gray-700">#ORD{i}23456</td>
                        <td className="px-6 py-4 text-sm text-gray-700">Customer {i}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{2000 * i}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            <Check size={14} /> Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Store Settings</h3>
                <div className="space-y-4">
                  {['Enable Shipping', 'Accept Bulk Orders', 'Auto-Accept Orders', 'Notifications On'].map((setting) => (
                    <label key={setting} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600 rounded" />
                      <span className="text-gray-700 font-semibold">{setting}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Commission Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Platform Commission</span>
                    <span className="text-blue-600 font-bold">5%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Payout Method</span>
                    <span className="text-green-600 font-bold">Bank Transfer</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Last Payout</span>
                    <span className="text-purple-600 font-bold">3 days ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl shadow-lg p-8 border-l-4 border-red-600">
                <h3 className="text-2xl font-bold text-red-600 mb-3">Danger Zone</h3>
                <p className="text-gray-700 mb-6">Once you close your store, all products will be unlisted. Please be certain.</p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold">
                  Close Store
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SellerProfile;
