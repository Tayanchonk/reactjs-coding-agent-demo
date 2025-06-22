import React from 'react';
import type { Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => onView(product)}>
          {product.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-blue-600">
          {formatCurrency(product.price)}
        </span>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      
      <div className="text-xs text-gray-400 mb-4">
        Created: {formatDate(product.createdAt)}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onView(product)}
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          View
        </button>
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;