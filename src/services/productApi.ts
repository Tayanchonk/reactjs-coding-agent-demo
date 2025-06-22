import { v4 as uuidv4 } from 'uuid';
import type { Product, CreateProductRequest, UpdateProductRequest, ApiResponse } from '../types';

// Mock data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    category: 'Electronics',
    inStock: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with programmable timer',
    price: 89.99,
    category: 'Appliances',
    inStock: true,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily exercise',
    price: 129.99,
    category: 'Sports',
    inStock: false,
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
  {
    id: '4',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 45.99,
    category: 'Home',
    inStock: true,
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-18T13:00:00Z',
  },
  {
    id: '5',
    name: 'Smartphone',
    description: 'Latest smartphone with advanced camera features',
    price: 799.99,
    category: 'Electronics',
    inStock: true,
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T14:00:00Z',
  },
];

// In-memory storage (simulates database)
let products: Product[] = [...INITIAL_PRODUCTS];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ProductApiService {
  // Get all products
  static async getProducts(): Promise<ApiResponse<Product[]>> {
    await delay(500); // Simulate network delay
    
    try {
      return {
        data: [...products],
        message: 'Products fetched successfully',
      };
    } catch {
      return {
        data: [],
        error: 'Failed to fetch products',
      };
    }
  }

  // Get product by ID
  static async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    await delay(300);
    
    try {
      const product = products.find(p => p.id === id);
      return {
        data: product || null,
        message: product ? 'Product found' : 'Product not found',
      };
    } catch {
      return {
        data: null,
        error: 'Failed to fetch product',
      };
    }
  }

  // Create new product
  static async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
    await delay(800);
    
    try {
      const now = new Date().toISOString();
      const newProduct: Product = {
        id: uuidv4(),
        ...productData,
        createdAt: now,
        updatedAt: now,
      };

      products.push(newProduct);
      
      return {
        data: newProduct,
        message: 'Product created successfully',
      };
    } catch {
      return {
        data: {} as Product,
        error: 'Failed to create product',
      };
    }
  }

  // Update existing product
  static async updateProduct(productData: UpdateProductRequest): Promise<ApiResponse<Product>> {
    await delay(700);
    
    try {
      const index = products.findIndex(p => p.id === productData.id);
      
      if (index === -1) {
        return {
          data: {} as Product,
          error: 'Product not found',
        };
      }

      const updatedProduct: Product = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      };

      products[index] = updatedProduct;
      
      return {
        data: updatedProduct,
        message: 'Product updated successfully',
      };
    } catch {
      return {
        data: {} as Product,
        error: 'Failed to update product',
      };
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    await delay(600);
    
    try {
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        return {
          data: false,
          error: 'Product not found',
        };
      }

      products.splice(index, 1);
      
      return {
        data: true,
        message: 'Product deleted successfully',
      };
    } catch {
      return {
        data: false,
        error: 'Failed to delete product',
      };
    }
  }

  // Reset to initial data (for testing)
  static resetData(): void {
    products = [...INITIAL_PRODUCTS];
  }
}