import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem('cc_cart_items_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cc_cart_items_v1', JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save cart to localStorage', err);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    lastCheckedOut: null
  },
  reducers: {
    addToCart: (state, action) => {
      const job = action.payload;
      const exists = state.items.some((item) => item.jobId === job.id);
      if (!exists) {
        state.items.push({
          jobId: job.id,
          title: job.title,
          company: job.company,
          logo: job.logo,
          location: job.location,
          type: job.type,
          workplaceType: job.workplaceType,
          minSalary: job.minSalary,
          maxSalary: job.maxSalary,
          category: job.category,
          coverNote: '',
          customResume: 'Alex_Rivera_Resume_2026.pdf',
          addedAt: new Date().toISOString()
        });
        saveCartToStorage(state.items);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.jobId !== action.payload);
      saveCartToStorage(state.items);
    },
    updateCartItemNote: (state, action) => {
      const { jobId, coverNote, customResume } = action.payload;
      const target = state.items.find((i) => i.jobId === jobId);
      if (target) {
        if (coverNote !== undefined) target.coverNote = coverNote;
        if (customResume !== undefined) target.customResume = customResume;
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    setLastCheckedOut: (state, action) => {
      state.lastCheckedOut = action.payload;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemNote,
  clearCart,
  setLastCheckedOut
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.length;
export const selectIsInCart = (jobId) => (state) =>
  state.cart.items.some((item) => item.jobId === jobId);

export default cartSlice.reducer;
