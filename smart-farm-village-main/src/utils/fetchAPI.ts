// Fetch wrapper that automatically adds API_BASE_URL for relative API paths
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch wrapper that automatically handles API URLs
 * Converts relative paths like '/api/...' to full URLs in production
 * @param input URL or Request object
 * @param init RequestInit options
 * @returns Promise<Response>
 */
export const fetchAPI = (input: string | Request, init?: RequestInit): Promise<Response> => {
  let url = typeof input === 'string' ? input : input.url;
  
  // If it's a relative API path, convert it to full URL
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = `${API_BASE_URL}${url.substring(4)}`; // Remove '/api' and add base URL
  }
  
  return fetch(url, init);
};

export default fetchAPI;
