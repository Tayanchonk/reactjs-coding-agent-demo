import { describe, it, expect } from '@jest/globals';
import { formatCurrency, formatDate, getUniqueCategories, validateProduct } from '../utils/helpers';
import type { Product } from '../types';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const dateString = '2024-01-15T10:00:00Z';
      const formatted = formatDate(dateString);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
    });
  });

  describe('getUniqueCategories', () => {
    it('should return unique categories sorted', () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 10,
          category: 'Electronics',
          inStock: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Description 2',
          price: 20,
          category: 'Books',
          inStock: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '3',
          name: 'Product 3',
          description: 'Description 3',
          price: 30,
          category: 'Electronics',
          inStock: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      const categories = getUniqueCategories(products);
      expect(categories).toEqual(['Books', 'Electronics']);
    });
  });

  describe('validateProduct', () => {
    it('should pass validation for valid product', () => {
      const validProduct = {
        name: 'Valid Product',
        description: 'This is a valid product description with enough characters',
        price: 99.99,
        category: 'Electronics',
      };

      const errors = validateProduct(validProduct);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return errors for invalid product', () => {
      const invalidProduct = {
        name: '',
        description: 'Short',
        price: -10,
        category: '',
      };

      const errors = validateProduct(invalidProduct);
      expect(errors.name).toBe('Product name is required');
      expect(errors.description).toBe('Description must be at least 10 characters');
      expect(errors.price).toBe('Price must be a positive number');
      expect(errors.category).toBe('Category is required');
    });

    it('should return error for name too short', () => {
      const product = {
        name: 'A',
        description: 'This is a valid description',
        price: 10,
        category: 'Test',
      };

      const errors = validateProduct(product);
      expect(errors.name).toBe('Product name must be at least 2 characters');
    });
  });
});