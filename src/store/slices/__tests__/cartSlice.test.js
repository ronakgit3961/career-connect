import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateCartItemNote,
  clearCart,
  selectCartCount,
  selectIsInCart
} from '../cartSlice';

describe('cartSlice (Application Basket & Batch Apply)', () => {
  const initialEmptyState = {
    items: [],
    lastCheckedOut: null
  };

  const sampleJob = {
    id: 'job-test-1',
    title: 'Frontend Engineer',
    company: 'Acme Corp',
    logo: '🚀',
    location: 'Remote',
    type: 'Full-time',
    workplaceType: 'Remote',
    minSalary: 120000,
    maxSalary: 150000,
    category: 'Engineering'
  };

  it('should return initial state when passed empty action', () => {
    const state = cartReducer(initialEmptyState, { type: 'unknown' });
    expect(state.items).toEqual([]);
  });

  it('should add a job to the cart and avoid duplicate insertion', () => {
    let state = cartReducer(initialEmptyState, addToCart(sampleJob));
    expect(state.items.length).toBe(1);
    expect(state.items[0].jobId).toBe('job-test-1');
    expect(state.items[0].company).toBe('Acme Corp');

    // Adding same job again should not duplicate
    state = cartReducer(state, addToCart(sampleJob));
    expect(state.items.length).toBe(1);
  });

  it('should remove a job from the cart', () => {
    let state = cartReducer(initialEmptyState, addToCart(sampleJob));
    expect(state.items.length).toBe(1);

    state = cartReducer(state, removeFromCart('job-test-1'));
    expect(state.items.length).toBe(0);
  });

  it('should update the tailored cover note for a specific cart item', () => {
    let state = cartReducer(initialEmptyState, addToCart(sampleJob));
    state = cartReducer(
      state,
      updateCartItemNote({ jobId: 'job-test-1', coverNote: 'Tailored pitch for Acme Corp' })
    );
    expect(state.items[0].coverNote).toBe('Tailored pitch for Acme Corp');
  });

  it('should clear all items from the cart', () => {
    let state = cartReducer(initialEmptyState, addToCart(sampleJob));
    state = cartReducer(state, clearCart());
    expect(state.items.length).toBe(0);
  });

  it('should compute selectors correctly', () => {
    const rootState = {
      cart: {
        items: [
          { jobId: 'job-test-1', title: 'Frontend Engineer' },
          { jobId: 'job-test-2', title: 'Backend Engineer' }
        ],
        lastCheckedOut: null
      }
    };

    expect(selectCartCount(rootState)).toBe(2);
    expect(selectIsInCart('job-test-1')(rootState)).toBe(true);
    expect(selectIsInCart('job-test-999')(rootState)).toBe(false);
  });
});
