import { createSlice } from '@reduxjs/toolkit';

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    categories: ['Tech', 'Business', 'Sports', 'Entertainment', 'General'],
    currentCategory: 'Tech'
  },
  reducers: {
    addNews: (state, action) => {
      // Validate payload
      if (!action.payload || !action.payload.title) return;

      // Check if news item already exists
      const isDuplicate = state.items.some(item => 
        item._id === action.payload._id || 
        (item.title === action.payload.title && item.createdAt === action.payload.createdAt)
      );

      // Add only if not a duplicate and matches current category
      if (!isDuplicate && action.payload.category === state.currentCategory) {
        state.items.unshift({
          ...action.payload,
          timestamp: new Date().toISOString()
        });
        
        // Keep only the latest 10 unique news items
        if (state.items.length > 10) {
          state.items.splice(10);
        }
      }
    },
    setNews: (state, action) => {
      // Remove duplicates and filter by current category
      const uniqueNews = action.payload
        .filter(item => item.category === state.currentCategory)
        .filter((item, index, self) =>
          index === self.findIndex((t) => (
            t._id === item._id || 
            (t.title === item.title && t.createdAt === item.createdAt)
          ))
        );

      // Update items
      state.items = uniqueNews.slice(0, 10);
    },
    changeCategory: (state, action) => {
      state.currentCategory = action.payload;
      state.items = []; // Clear items when changing category
    },
    clearNews: (state) => {
      state.items = [];
    }
  }
});

export const { addNews, setNews, changeCategory, clearNews } = newsSlice.actions;
export default newsSlice.reducer;
