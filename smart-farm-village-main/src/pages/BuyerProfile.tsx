import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Star,
  Edit2,
  LogOut,
  Calendar,
  AlertCircle,
  Check,
  X,
  Download,
  Camera,
  FileUp,
  Trash,
  Award,
  TrendingUp
} from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
}

const BuyerProfile = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    address: state.user?.address || '',
    city: state.user?.city || '',
    state: state.user?.state || '',
    pincode: state.user?.pincode || '',
    dateOfBirth: state.user?.dateOfBirth || '',
    gender: state.user?.gender || 'not-specified',
    bio: state.user?.bio || '',
    preferredLanguage: state.user?.preferredLanguage || 'english',
    notifications: state.user?.notifications !== false,
    marketingEmails: state.user?.marketingEmails !== false
  });

  useEffect(() => {
    if (!state.user || state.user.userType !== 'buyer') {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      setProfilePhoto(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!profilePhoto) {
      alert('Please select a photo first');
      return;
    }

    const formData = new FormData();
    formData.append('file', profilePhoto);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        alert('Photo uploaded successfully');
        setPhotoPreview(null);
        setProfilePhoto(null);
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
    setProfilePhoto(null);
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
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'blue' },
    { label: 'Total Spent', value: `₹${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`, icon: Mail, color: 'green' },
    { label: 'Wishlist Items', value: 0, icon: Heart, color: 'red' },
    { label: 'Reviews Given', value: 0, icon: Star, color: 'yellow' }
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-20">
      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-blue-600">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Profile Photo Upload */}
              <div className="col-span-2">
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        state.user?.profilePhoto ? (
                          <img src={state.user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          state.user?.firstName?.charAt(0) || 'B'
                        )
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors duration-300 shadow-lg"
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
                      {state.user?.firstName} {state.user?.lastName}
                    </h1>
                    <p className="text-blue-600 text-lg font-semibold mb-1">Verified Buyer</p>
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
                      placeholder="First Name"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      value={editForm.dateOfBirth}
                      onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="not-specified">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={editForm.pincode}
                      onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editForm.preferredLanguage}
                      onChange={(e) => setEditForm({ ...editForm, preferredLanguage: e.target.value })}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="tamil">Tamil</option>
                      <option value="telugu">Telugu</option>
                      <option value="marathi">Marathi</option>
                    </select>
                    <textarea
                      placeholder="Bio (Tell us about yourself)"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="col-span-2 flex gap-3">
                      <button
                        onClick={handleUpdateProfile}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
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
                      <Mail size={16} className="text-blue-600" /> {state.user?.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} className="text-blue-600" /> {state.user?.phone || 'Not added'}
                    </div>
                    {state.user?.dateOfBirth && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-blue-600" /> {new Date(state.user.dateOfBirth).toLocaleDateString()}
                      </div>
                    )}
                    {state.user?.gender && state.user.gender !== 'not-specified' && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <User size={16} className="text-blue-600" /> {state.user.gender.charAt(0).toUpperCase() + state.user.gender.slice(1)}
                      </div>
                    )}
                    <div className="col-span-2 flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-blue-600" /> {state.user?.address}, {state.user?.city}, {state.user?.state} - {state.user?.pincode}
                    </div>
                    {state.user?.bio && (
                      <div className="col-span-2">
                        <p className="font-semibold text-blue-600 mb-1">About Me</p>
                        <p className="text-gray-700">{state.user.bio}</p>
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
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit2 size={20} /> Edit Profile
                  </button>
                )}
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
                  className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-blue-600 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-8 h-8 text-blue-600" />
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
            {['overview', 'orders', 'wishlist', 'reviews', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
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
                    <span className="text-gray-700">Email Verified</span>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Account Active</span>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700">Phone Verified</span>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Total Orders</span>
                    <span className="text-blue-600 font-bold text-lg">{orders.length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Completed Orders</span>
                    <span className="text-green-600 font-bold text-lg">{orders.filter(o => o.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700 font-semibold">Average Order Value</span>
                    <span className="text-orange-600 font-bold text-lg">
                      ₹{orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length) : 0}
                    </span>
                  </div>
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-300">
                        <td className="px-6 py-4 text-sm font-mono text-gray-700">{order._id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">View</button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-semibold mb-2">No orders yet</p>
                          <button
                            onClick={() => navigate('/buyer-marketplace')}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Start shopping now
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist</h3>
              <p className="text-gray-600 mb-6">You haven't added any items to your wishlist yet</p>
              <button
                onClick={() => navigate('/buyer-marketplace')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold inline-block"
              >
                Browse Products
              </button>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in">
              <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Reviews</h3>
              <p className="text-gray-600 mb-6">You haven't written any reviews yet</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold inline-block">
                Write Your First Review
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h3>
                <div className="space-y-4">
                  {['Order Updates', 'Promotional Offers', 'New Products', 'Payment Alerts'].map((setting) => (
                    <label key={setting} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                      <span className="text-gray-700 font-semibold">{setting}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  {['Make Profile Public', 'Show Order History', 'Allow Recommendations'].map((setting) => (
                    <label key={setting} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                      <span className="text-gray-700 font-semibold">{setting}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl shadow-lg p-8 border-l-4 border-red-600">
                <h3 className="text-2xl font-bold text-red-600 mb-3">Danger Zone</h3>
                <p className="text-gray-700 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BuyerProfile;
