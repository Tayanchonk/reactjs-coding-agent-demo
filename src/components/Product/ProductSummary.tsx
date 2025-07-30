import React from 'react';
import type { Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  formatPrice, 
  formatDateTime, 
  calculateDiscount 
} from '../../utils/duplications';

interface ProductSummaryProps {
  product: Product;
  discountPercent?: number;
}

// Component with duplicate structure to ProductCard
const ProductSummary: React.FC<ProductSummaryProps> = ({ product, discountPercent = 0 }) => {
  // Duplicate logic from other components
  const isInStock = product.inStock;
  const formattedPrice = formatCurrency(product.price);
  const formattedDate = formatDate(product.createdAt);
  
  // Calculate discounted price if applicable
  const discountedPrice = discountPercent > 0 
    ? calculateDiscount(product.price, discountPercent)
    : product.price;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {product.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isInStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-2xl font-bold text-blue-600">
            {formattedPrice}
          </span>
          
          {discountPercent > 0 && (
            <span className="ml-2 text-lg line-through text-gray-400">
              {formatPrice(discountedPrice)}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      
      <div className="text-xs text-gray-400 mb-4">
        Created: {formattedDate}
      </div>
    </div>
  );
};

export default ProductSummary;
