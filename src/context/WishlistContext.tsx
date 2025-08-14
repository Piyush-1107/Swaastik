'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload;
      const existsInWishlist = state.items.some(item => item._id === product._id);
      
      if (existsInWishlist) {
        return state; // Don't add if already in wishlist
      }

      return {
        ...state,
        items: [...state.items, product],
      };
    }

    case 'REMOVE_ITEM': {
      const productId = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item._id !== productId),
      };
    }

    case 'CLEAR_WISHLIST':
      return { items: [] };

    case 'LOAD_WISHLIST':
      return { items: action.payload };

    default:
      return state;
  }
}

interface WishlistProviderProps {
  children: React.ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedWishlist = localStorage.getItem('swastik-wishlist');
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('swastik-wishlist', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
      }
    }
  }, [state.items]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId: string) => {
    return state.items.some(item => item._id === productId);
  };

  const getTotalItems = () => {
    return state.items.length;
  };

  const value: WishlistContextType = {
    items: state.items,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    getTotalItems,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
