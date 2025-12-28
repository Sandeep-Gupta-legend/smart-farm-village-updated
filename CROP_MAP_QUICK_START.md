# Quick Start: Indian Crop Map Feature

## Access the Feature

### Direct URL:
```
http://localhost:8081/crop-map
```

### Via Navbar:
1. Click the **"Crop Map"** button (yellow button with leaf icon)
2. Located in the navbar between "About" and "Exit"

## Main Features

### 1. Interactive India Map
- Shows 16 agricultural regions
- Click on regions to filter crops
- Visual highlighting of selected region

### 2. Three Advanced Filters

**Season Dropdown:**
- All Seasons (default)
- Kharif (Monsoon: June-October)
- Rabi (Winter: October-March)
- Summer (April-June)
- Spring (seasonal)
- Autumn (seasonal)
- Year-round (perennial)

**Crop Dropdown:**
- All Crops (default)
- Rice
- Wheat
- Cotton
- Sugarcane
- Corn
- Soybean
- Tea
- Coffee
- Coconut
- Spices

**Region Dropdown:**
- All Regions (default)
- Select any of 16 Indian states/regions

### 3. Real-Time Crop Display
- Left panel: Interactive map
- Right panel: Filtered crops list
- Crops update automatically based on selections

### 4. Crop Details
- Click "Details" button on any crop
- Shows: Growing seasons, regions, production stats
- Click again to collapse

### 5. Information Sections
- Season definitions and timing
- Regional climate types
- Agricultural statistics

## Animations
- ✨ Smooth fade-in of page elements
- ✨ Slide-up animations for content
- ✨ Hover effects on crop cards
- ✨ Scale animations on interaction

## Example Usage Scenarios

### Find crops grown in Punjab:
1. Region filter → Select "Punjab"
2. See rice, wheat, corn options
3. Click crop details for more info

### Find what to plant in Kharif season:
1. Season filter → Select "Kharif"
2. Crops list updates to Kharif crops
3. View growing regions for each

### Search for Cotton:
1. Crop filter → Select "Cotton"
2. Map highlights cotton-growing regions
3. See all cotton growing states

## Button Actions

**Learn More Button:**
- Green gradient button at bottom
- Navigates to learning resources
- URL: `http://localhost:8081/learning`

**Navigation Buttons:**
- "Home" → Homepage
- "About" → About page
- "Crop Map" → This page (current)
- "Exit" → Go back (browser back button)

## Color Legend

| Color | Meaning |
|-------|---------|
| Green circle | Active/selected region |
| Light green | Default region |
| Yellow button | Crop Map navigation |
| Blue card | Season information |
| Green card | Climate information |
| Light blue/green | Crop cards |

## Responsive Design

- **Mobile**: Single column layout, scrollable
- **Tablet**: 2-column layout
- **Desktop**: Full 3-column with large map

## Browser Compatibility

Works on:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers

## Tips & Tricks

1. **Filter Combination**: Use multiple filters together for precise results
2. **Click Map Regions**: More intuitive than dropdown
3. **Expand Crop Cards**: Click "Details" to see full information
4. **Information Cards**: Scroll down to learn about seasons and climate
5. **Learn More**: Use the bottom button to access detailed learning resources

## Troubleshooting

**Page not loading?**
- Ensure frontend server is running: `npm run dev`
- Check URL: `http://localhost:8081/crop-map`

**Navbar button not visible?**
- Refresh the page (Ctrl+R)
- Clear browser cache

**Filters not working?**
- Check browser console for errors
- Ensure JavaScript is enabled

**Map not displaying?**
- SVG may be blocked - check browser security settings
- Try different browser
- Clear cache and reload

## Keyboard Navigation

- Tab through filters
- Enter to select dropdown options
- Space to click buttons
- Arrow keys in dropdowns

## Data Sources

- Regional climate data based on India Meteorological Department
- Crop production data from Indian Ministry of Agriculture
- Growing regions verified with agricultural surveys
- Seasonal data follows Indian farming calendar

---

**Feature Status:** ✅ Live and Fully Functional
**Last Updated:** December 28, 2025
