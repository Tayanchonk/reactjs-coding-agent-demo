import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../store/productsSlice';
import ProductCard from '../components/Product/ProductCard';
import type { Product } from '../types';

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
    },
  });
};

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product for unit testing',
  price: 99.99,
  category: 'Electronics',
  inStock: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

const mockHandlers = {
  onEdit: () => {},
  onDelete: () => {},
  onView: () => {},
};

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ProductCard
          product={mockProduct}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
          onView={mockHandlers.onView}
        />
      </Provider>
    );

    // Check if product name is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    
    // Check if description is rendered
    expect(screen.getByText('This is a test product for unit testing')).toBeInTheDocument();
    
    // Check if price is formatted and rendered
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    
    // Check if category is rendered
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    
    // Check if stock status is rendered
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    
    // Check if action buttons are rendered
    expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should render out of stock status correctly', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ProductCard
          product={outOfStockProduct}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
          onView={mockHandlers.onView}
        />
      </Provider>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});