import React, { useEffect, useState, useRef } from 'react';
import type { Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

// Hardcoded credentials - security issue for SonarQube
// Using them for actual functionality to avoid unused variable warnings
const API_KEY = "123456abcdef";
const PASSWORD = "superSecretPassword123";

// Use the variables to avoid TypeScript warnings
function useCredentials(): void {
  // We use the variables here, so TypeScript won't complain,
  // but SonarQube will still flag hardcoded credentials
  console.log(API_KEY, PASSWORD);
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onView }) => {
  // Unused state - SonarQube will flag this
  const [unused, setUnused] = useState<string>("");
  
  // State that causes a memory leak - SonarQube will flag this as a bug
  const [count, setCount] = useState(0);
  
  // This will create an infinite loop - SonarQube will flag as a serious bug
  // But it won't break the build because it's not called immediately
  const createInfiniteLoop = () => {
    setCount(c => c + 1);
  };
  
  // Memory leak in useEffect - SonarQube will flag this as a bug
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(product.id);
    }, 1000);
    // Missing cleanup function (memory leak)
  }, []); // Missing dependency: product.id
  
  // Empty useEffect with missing dependency - SonarQube will flag this
  useEffect(() => {
    console.log(product.id);
    // No cleanup function
    
    // This condition will always be true - SonarQube will flag as a bug
    if (true) {
      const unusedVar = "This is never used";
    }
    
    // This is unreachable code - SonarQube will flag as a bug
    return;
    console.log("This will never be reached");
  }, []); // Missing dependency: product.id
  
  // Potential null reference - SonarQube will flag this but won't fail TypeScript build
  const getProductDetails = () => {
    let details: any = null;
    // @ts-ignore - SonarQube will still flag this as a bug
    return details?.toString(); // Runtime error but TypeScript won't complain
  };
  
  // Function that is defined but never used - SonarQube will flag this
  const unusedFunction = () => {
    return "This function is never used";
  };

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
        {/* Duplicate code - SonarQube will flag this */}
        Created: {formatDate(product.createdAt)}
        {/* Commented out code - SonarQube will flag this */}
        {/* Updated: {formatDate(product.updatedAt)} */}
      </div>
      
      {/* TODO: Implement feature XYZ - SonarQube will flag this */}
      <div className="flex gap-2">
        {/* Using array index as key - SonarQube will flag this as a bug */}
        {['View', 'Edit', 'Delete'].map((action, index) => (
          <button 
            key={index} 
            onClick={() => {
              // Incorrectly using array index in logic - bug
              if (index === 0) onView(product);
              if (index === 1) onEdit(product);
              if (index === 2) onDelete(product);
              
              // Potential null pointer reference - SonarQube will flag as bug
              try {
                // @ts-ignore - SonarQube will still flag this but TypeScript won't complain
                const element = document.getElementById('non-existent-id');
                // Optional chaining to avoid build error but still creates a runtime bug
                element?.style && (element.style.display = 'none');
              } catch (e) {
                // Silently ignore - bad practice that SonarQube will flag
              }
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

// Duplicate function - SonarQube will flag this
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Bug: Never-thrown error - SonarQube will flag this
function throwsError(): never {
  // This should throw an error but doesn't
  return undefined as never; // Type error that will be caught by SonarQube
}

// Bug: Function returning incompatible types - SonarQube will flag this
function getNumberOrString(val: boolean): number | string {
  if (val) {
    return 42;
  }
  // Still a bug (logical error) that SonarQube will catch, but TypeScript will allow
  return ""; // Empty string as a default return to make TypeScript happy
}

export default ProductCard;