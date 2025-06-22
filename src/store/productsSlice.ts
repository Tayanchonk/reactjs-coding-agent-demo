import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, CreateProductRequest, UpdateProductRequest, LoadingState, ProductFilters, ProductSortOptions } from '../types';
import { ProductApiService } from '../services/productApi';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await ProductApiService.getProducts();
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: CreateProductRequest) => {
    const response = await ProductApiService.createProduct(productData);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData: UpdateProductRequest) => {
    const response = await ProductApiService.updateProduct(productData);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    const response = await ProductApiService.deleteProduct(id);
    if (response.error) {
      throw new Error(response.error);
    }
    return id;
  }
);

// State interface
interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  loading: LoadingState;
  filters: ProductFilters;
  sortOptions: ProductSortOptions;
}

// Initial state
const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  loading: {
    isLoading: false,
    error: null,
  },
  filters: {},
  sortOptions: {
    field: 'name',
    direction: 'asc',
  },
};

// Helper function to apply filters and sorting
const applyFiltersAndSort = (
  products: Product[],
  filters: ProductFilters,
  sortOptions: ProductSortOptions
): Product[] => {
  let filtered = [...products];

  // Apply filters
  if (filters.category) {
    filtered = filtered.filter(product => product.category === filters.category);
  }

  if (filters.inStock !== undefined) {
    filtered = filtered.filter(product => product.inStock === filters.inStock);
  }

  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aValue = a[sortOptions.field];
    const bValue = b[sortOptions.field];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      const comparison = Number(aValue) - Number(bValue);
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    }

    return 0;
  });

  return filtered;
};

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sortOptions);
    },
    setSortOptions: (state, action: PayloadAction<ProductSortOptions>) => {
      state.sortOptions = action.payload;
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sortOptions);
    },
    clearError: (state) => {
      state.loading.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.isLoading = false;
        state.products = action.payload;
        state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sortOptions);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error = action.error.message || 'Failed to fetch products';
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading.isLoading = false;
        state.products.push(action.payload);
        state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sortOptions);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error = action.error.message || 'Failed to create product';
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading.isLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sortOptions);
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error = action.error.message || 'Failed to update product';
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading.isLoading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
        state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sortOptions);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { setSelectedProduct, setFilters, setSortOptions, clearError } = productsSlice.actions;
export default productsSlice.reducer;