import { useState, useCallback, useEffect } from 'react';

interface SearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
  isSearching: boolean;
  searchResults: any[];
  clearSearch: () => void;
}

export const useSearch = (
  searchFunction: (query: string) => Promise<any[]> | any[],
  options: SearchOptions = {}
): UseSearchReturn => {
  const {
    debounceMs = 300,
    minQueryLength = 1
  } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.length >= minQueryLength) {
            setIsSearching(true);
            try {
              const results = await searchFunction(query);
              setSearchResults(results);
            } catch (error) {
              console.error('Search error:', error);
              setSearchResults([]);
            } finally {
              setIsSearching(false);
            }
          } else {
            setSearchResults([]);
          }
        }, debounceMs);
      };
    })(),
    [searchFunction, debounceMs, minQueryLength]
  );

  // Handle search input
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // Auto-search when query changes
  useEffect(() => {
    if (searchQuery.length >= minQueryLength) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch, minQueryLength]);

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    isSearching,
    searchResults,
    clearSearch
  };
};

// API search functions
export const searchProducts = async (query: string): Promise<any[]> => {
  try {
    const response = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const searchCategories = async (query: string): Promise<any[]> => {
  try {
    const response = await fetch(`http://localhost:5000/api/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories = await response.json();
    return categories.filter((category: any) => 
      category.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching categories:', error);
    return [];
  }
};

// Mock search functions for pages without API integration
export const mockSearchProducts = (query: string): any[] => {
  const mockProducts = [
    { id: 1, name: 'Fresh Tomatoes', category: 'Vegetables', price: 45 },
    { id: 2, name: 'Organic Spinach', category: 'Vegetables', price: 25 },
    { id: 3, name: 'Mangoes', category: 'Fruits', price: 120 },
    { id: 4, name: 'Basmati Rice', category: 'Grains', price: 85 },
    { id: 5, name: 'Turmeric Powder', category: 'Spices', price: 35 },
    { id: 6, name: 'Organic Fertilizer', category: 'Fertilizers', price: 150 },
    { id: 7, name: 'Garden Spade', category: 'Tools', price: 250 },
    { id: 8, name: 'Fresh Milk', category: 'Dairy', price: 60 }
  ];

  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
};

export const mockSearchLearning = (query: string): any[] => {
  const mockContent = [
    { id: 1, title: 'Organic Farming Techniques', type: 'Article', category: 'Farming' },
    { id: 2, title: 'Crop Rotation Guide', type: 'Video', category: 'Farming' },
    { id: 3, title: 'Soil Health Management', type: 'Article', category: 'Soil' },
    { id: 4, title: 'Pest Control Methods', type: 'Video', category: 'Pest Control' },
    { id: 5, title: 'Water Conservation Tips', type: 'Article', category: 'Water Management' },
    { id: 6, title: 'Government Farming Schemes', type: 'Resource', category: 'Government' }
  ];

  return mockContent.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );
};


