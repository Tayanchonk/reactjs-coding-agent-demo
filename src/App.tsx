import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import ProductList from './components/Product/ProductList';
import ProductForm from './components/Product/ProductForm';
import ProductDetails from './components/Product/ProductDetails';
import ProductSummary from './components/Product/ProductSummary';
import Notification from './components/UI/Notification';
import PriceDisplay, { SimplePriceDisplay } from './components/UI/PriceDisplay';
import LoginPage from './components/Auth/LoginPage';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setFilters,
  setSortOptions,
  clearError,
} from './store/productsSlice';
import { logout } from './store/authSlice';
import type { Product, CreateProductRequest, UpdateProductRequest, ProductFilters as ProductFiltersType, ProductSortOptions } from './types';
import { formatProductForDisplay, generateProductSummary } from './utils/formatting';
// import BuggyComponent from './buggy';

// Main App Content Component
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, selectedProduct } = useAppSelector(state => state.products);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Load products on mount - only when authenticated
  useEffect(() => {
    // SonarQube issue: ไม่ระบุ dependencies ที่จำเป็น (user, dispatch, isAuthenticated)
    if (isAuthenticated) {
      dispatch(fetchProducts());
      console.log('Loading products for:', user?.username); // SonarQube issue: ใช้ user แต่ไม่ได้เพิ่มในรายการ dependencies
    }
    
    // SonarQube issue: memory leak (ไม่มีการ cleanup)
    const interval = setInterval(() => {
      console.log('Checking for product updates...');
    }, 5000);
    
    // SonarQube issue: cleanup ที่ไม่สมบูรณ์ (ไม่ได้ clear interval)
    return () => {
      // ใช้ interval เพื่อไม่ให้ TypeScript error
      console.log("Component unmounted, but interval not cleared:", interval);
    };
  }, []); // SonarQube issue: ละเว้น dependencies ทั้งหมด

  // Show error notifications
  useEffect(() => {
    if (loading.error) {
      setNotification({
        message: loading.error,
        type: 'error',
      });
    }
  }, [loading.error]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleCreateProduct = async (productData: CreateProductRequest) => {
    try {
      await dispatch(createProduct(productData)).unwrap();
      setShowForm(false);
      setNotification({
        message: 'Product created successfully!',
        type: 'success',
      });
    } catch {
      // Error is handled by Redux state
    }
  };

  const handleUpdateProduct = async (productData: CreateProductRequest) => {
    if (!editingProduct) return;

    const updateData: UpdateProductRequest = {
      id: editingProduct.id,
      ...productData,
    };

    try {
      await dispatch(updateProduct(updateData)).unwrap();
      setShowForm(false);
      setEditingProduct(null);
      setNotification({
        message: 'Product updated successfully!',
        type: 'success',
      });
    } catch {
      // Error is handled by Redux state
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      setShowDetails(false);
      setNotification({
        message: 'Product deleted successfully!',
        type: 'success',
      });
    } catch {
      // Error is handled by Redux state
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleViewProduct = (product: Product) => {
    dispatch(setSelectedProduct(product));
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    dispatch(setSelectedProduct(null));
  };

  const handleFiltersChange = (filters: ProductFiltersType) => {
    dispatch(setFilters(filters));
  };

  const handleSortChange = (sortOptions: ProductSortOptions) => {
    dispatch(setSortOptions(sortOptions));
  };

  const handleCloseNotification = () => {
    setNotification(null);
    dispatch(clearError());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add New Product
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <BuggyComponent /> */}
        <ProductList
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onViewProduct={handleViewProduct}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />
      </main>

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          products={products}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={handleCloseForm}
          isLoading={loading.isLoading}
        />
      )}

      {showDetails && selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onClose={handleCloseDetails}
        />
      )}

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

// Main App Component with Redux Provider
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
