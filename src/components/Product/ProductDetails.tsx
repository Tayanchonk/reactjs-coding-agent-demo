import React from 'react';
import type { Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface ProductDetailsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onEdit,
  onDelete,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Name and Status */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(product.price)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Category</h4>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {product.category}
            </span>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Created</h4>
              <p className="text-gray-600">{formatDate(product.createdAt)}</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Last Updated</h4>
              <p className="text-gray-600">{formatDate(product.updatedAt)}</p>
            </div>
          </div>

          {/* Product ID */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Product ID</h4>
            <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded border">
              {product.id}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Edit Product
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;