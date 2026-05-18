# Search Functionality Documentation

## 🎯 Overview

The Smart Farm Village application now includes comprehensive search functionality with voice recognition and camera search capabilities across all pages. This document explains how to use and implement the search features.

## 🔍 Features

### 1. **Voice Search (Microphone)**
- Click the microphone icon to start voice recognition
- Speak your search query naturally
- The system will convert speech to text and perform the search
- Works in English (can be extended to other languages)

### 2. **Camera Search (Photo)**
- Click the camera icon to activate camera mode
- Take a photo or upload an image
- The system will analyze the image and suggest search terms
- Currently uses mock AI processing (can be connected to real AI services)

### 3. **Text Search**
- Type directly in the search bar
- Real-time search with debouncing
- Searches across multiple fields (name, description, category, etc.)

### 4. **Smart Search Results**
- Displays relevant results with loading indicators
- Shows "No results found" when appropriate
- Maintains search state across page navigation

## 📁 Components

### SearchBar Component
```tsx
import SearchBar from '@/components/SearchBar';

<SearchBar
  placeholder="Search crops, products, or categories..."
  onSearch={handleSearch}
  className="p-3"
  showCamera={true}  // Optional: show camera button
  showMic={true}     // Optional: show microphone button
/>
```

### useSearch Hook
```tsx
import { useSearch, mockSearchProducts } from '@/hooks/useSearch';

const { searchQuery, handleSearch, searchResults, isSearching } = useSearch(mockSearchProducts);
```

## 🛠️ Implementation

### Adding Search to a New Page

1. **Import the required components:**
```tsx
import SearchBar from '@/components/SearchBar';
import { useSearch, mockSearchProducts } from '@/hooks/useSearch';
```

2. **Set up the search hook:**
```tsx
const { searchQuery, handleSearch, searchResults, isSearching } = useSearch(mockSearchProducts);
```

3. **Add the SearchBar component:**
```tsx
<SearchBar
  placeholder="Search your content..."
  onSearch={handleSearch}
  className="mb-6"
/>
```

4. **Filter your data based on search:**
```tsx
const filteredData = searchQuery 
  ? data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : data;
```

5. **Display search results with loading state:**
```tsx
{isSearching && (
  <div className="text-center py-4">
    <div className="inline-flex items-center gap-2 text-gray-600">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      Searching...
    </div>
  </div>
)}

{searchQuery && filteredData.length === 0 && !isSearching && (
  <div className="text-center py-8">
    <p className="text-gray-500">No results found for "{searchQuery}"</p>
  </div>
)}
```

## 📱 Pages with Search Functionality

### ✅ Implemented
- **BuyerMarketplace** - Search products by name, category, description
- **SellerMarketplace** - Search own products
- **LearningHub** - Search learning content, articles, videos
- **Crops** - Search crops by name, season, description
- **Fertilizers** - Search fertilizers by name, type, usage

### 🔄 Ready for Implementation
- **Pesticides** - Can be easily added using the same pattern
- **SeasonFarming** - Can be easily added using the same pattern
- **DocumentationLearning** - Can be easily added using the same pattern

## 🎨 Customization

### Search Bar Styling
The SearchBar component accepts a `className` prop for custom styling:
```tsx
<SearchBar
  className="custom-search-styles"
  // ... other props
/>
```

### Custom Search Functions
Create custom search functions for specific data types:
```tsx
const searchCustomData = async (query: string): Promise<any[]> => {
  // Your custom search logic
  return filteredResults;
};

const { searchQuery, handleSearch, searchResults } = useSearch(searchCustomData);
```

### Disable Features
You can disable microphone or camera functionality:
```tsx
<SearchBar
  showMic={false}      // Hide microphone button
  showCamera={false}   // Hide camera button
  // ... other props
/>
```

## 🔧 Backend Integration

### API Search Functions
The search hook includes functions for backend API integration:

```tsx
import { searchProducts, searchCategories } from '@/hooks/useSearch';

// Use with real API
const { searchQuery, handleSearch, searchResults } = useSearch(searchProducts);
```

### Backend API Endpoints
The backend provides search endpoints:
- `GET /api/products?search=query` - Search products
- `GET /api/categories` - Get all categories
- Additional endpoints can be added as needed

## 🚀 Advanced Features

### Voice Recognition
- Uses Web Speech API
- Automatically detects when speech recognition is not supported
- Provides user feedback during voice input
- Handles errors gracefully

### Camera Search
- Uses device camera (prefers back camera for better image quality)
- Supports both photo capture and file upload
- Includes image processing simulation
- Can be connected to real AI services for image analysis

### Search State Management
- Maintains search query across component re-renders
- Provides loading states
- Handles empty results gracefully
- Includes debouncing to prevent excessive API calls

## 🐛 Troubleshooting

### Common Issues

1. **Voice recognition not working:**
   - Check browser compatibility (Chrome, Edge, Safari)
   - Ensure microphone permissions are granted
   - Check if HTTPS is required for your domain

2. **Camera not working:**
   - Check camera permissions
   - Ensure HTTPS connection
   - Try different browsers

3. **Search not returning results:**
   - Check if search function is properly implemented
   - Verify data filtering logic
   - Check console for errors

### Browser Support
- **Voice Recognition:** Chrome, Edge, Safari (limited)
- **Camera Access:** All modern browsers
- **Text Search:** All browsers

## 📈 Performance Considerations

- Search is debounced (300ms delay) to prevent excessive API calls
- Results are cached during the session
- Loading states provide user feedback
- Empty states are handled gracefully

## 🔮 Future Enhancements

1. **AI Integration:**
   - Connect camera search to real AI services
   - Implement image recognition for crop diseases
   - Add natural language processing

2. **Advanced Search:**
   - Add filters and sorting options
   - Implement search suggestions
   - Add search history

3. **Multi-language Support:**
   - Extend voice recognition to multiple languages
   - Add translation capabilities
   - Support regional dialects

## 📞 Support

For issues or questions about the search functionality:
1. Check this documentation
2. Review the component source code
3. Check browser console for errors
4. Contact the development team

---

**Happy Searching! 🔍**





