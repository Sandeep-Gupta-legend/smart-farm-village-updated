const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // Product endpoints
  async getProducts() {
    return this.request('/products');
  }

  async addProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });
  }

  async getSellerProducts(sellerId) {
    return this.request(`/products/seller/${sellerId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
  }

  async getUserOrders() {
    return this.request('/orders/user', {
      headers: this.getAuthHeaders()
    });
  }

  // Learning endpoints
  async getLearningMaterials(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/learning?${queryString}`);
  }
}

export default new ApiService();