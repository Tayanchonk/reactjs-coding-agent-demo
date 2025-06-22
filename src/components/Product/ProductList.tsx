import React, { useState } from 'react';
import type { Product, ProductFilters as ProductFiltersType, ProductSortOptions } from '../../types';
import ProductCard from './ProductCard';
import ProductFiltersComponent from './ProductFilters';
import LoadingSpinner from '../UI/LoadingSpinner';
import ConfirmationModal from '../UI/ConfirmationModal';
import { useAppSelector } from '../../hooks/redux';

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onSortChange: (sortOptions: ProductSortOptions) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
  onFiltersChange,
  onSortChange,
}) => {
  const { products, filteredProducts, loading, filters, sortOptions } = useAppSelector(
    state => state.products
  );

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      product,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.product) {
      onDeleteProduct(deleteModal.product);
    }
    setDeleteModal({
      isOpen: false,
      product: null,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      product: null,
    });
  };

  if (loading.isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <ProductFiltersComponent
        products={products}
        filters={filters}
        sortOptions={sortOptions}
        onFiltersChange={onFiltersChange}
        onSortChange={onSortChange}
      />

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
        {loading.isLoading && (
          <span className="ml-2 inline-flex items-center">
            <LoadingSpinner size="sm" />
            <span className="ml-1">Updating...</span>
          </span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {products.length === 0 ? 'No products found.' : 'No products match your filters.'}
          </div>
          <div className="text-gray-400 text-sm">
            {products.length === 0 
              ? 'Start by adding your first product!' 
              : 'Try adjusting your search criteria.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={handleDeleteClick}
              onView={onViewProduct}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ProductList;