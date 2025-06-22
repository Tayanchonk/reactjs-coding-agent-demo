// Jest globals are available automatically
import { ProductApiService } from '../services/productApi';

describe('ProductApiService', () => {
  beforeEach(() => {
    // Reset data before each test
    ProductApiService.resetData();
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const response = await ProductApiService.getProducts();
      
      expect(response.data).toHaveLength(5);
      expect(response.message).toBe('Products fetched successfully');
      expect(response.error).toBeUndefined();
    });
  });

  describe('getProductById', () => {
    it('should return a product when found', async () => {
      const response = await ProductApiService.getProductById('1');
      
      expect(response.data).toBeDefined();
      expect(response.data?.id).toBe('1');
      expect(response.data?.name).toBe('Wireless Headphones');
      expect(response.message).toBe('Product found');
    });

    it('should return null when product not found', async () => {
      const response = await ProductApiService.getProductById('nonexistent');
      
      expect(response.data).toBeNull();
      expect(response.message).toBe('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'A test product for unit testing',
        price: 99.99,
        category: 'Test',
        inStock: true,
      };

      const response = await ProductApiService.createProduct(newProduct);
      
      expect(response.data).toBeDefined();
      expect(response.data.name).toBe(newProduct.name);
      expect(response.data.price).toBe(newProduct.price);
      expect(response.data.id).toBeDefined();
      expect(response.data.createdAt).toBeDefined();
      expect(response.message).toBe('Product created successfully');

      // Verify it was added to the list
      const allProducts = await ProductApiService.getProducts();
      expect(allProducts.data).toHaveLength(6);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateData = {
        id: '1',
        name: 'Updated Headphones',
        price: 249.99,
      };

      const response = await ProductApiService.updateProduct(updateData);
      
      expect(response.data).toBeDefined();
      expect(response.data.name).toBe('Updated Headphones');
      expect(response.data.price).toBe(249.99);
      expect(response.data.updatedAt).toBeDefined();
      expect(response.message).toBe('Product updated successfully');
    });

    it('should return error when product not found', async () => {
      const updateData = {
        id: 'nonexistent',
        name: 'Updated Product',
      };

      const response = await ProductApiService.updateProduct(updateData);
      
      expect(response.error).toBe('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const response = await ProductApiService.deleteProduct('1');
      
      expect(response.data).toBe(true);
      expect(response.message).toBe('Product deleted successfully');

      // Verify it was removed from the list
      const allProducts = await ProductApiService.getProducts();
      expect(allProducts.data).toHaveLength(4);
      expect(allProducts.data.find(p => p.id === '1')).toBeUndefined();
    });

    it('should return error when product not found', async () => {
      const response = await ProductApiService.deleteProduct('nonexistent');
      
      expect(response.data).toBe(false);
      expect(response.error).toBe('Product not found');
    });
  });
});