import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import { formatPrice, calculateDiscount, applyDiscount } from '../../utils/duplications';

interface PriceDisplayProps {
  price: number;
  discountPercent?: number;
  showOriginal?: boolean;
  showDiscount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  discountPercent = 0, 
  showOriginal = true,
  showDiscount = true,
  size = 'medium'
}) => {
  // Duplication - multiple similar blocks of code with slight variations
  // Block 1
  let originalPriceClass = 'font-semibold';
  if (size === 'small') {
    originalPriceClass += ' text-sm';
  } else if (size === 'medium') {
    originalPriceClass += ' text-lg';
  } else if (size === 'large') {
    originalPriceClass += ' text-2xl';
  }
  
  // Block 2 - Duplicated with slight variation
  let discountedPriceClass = 'font-bold text-blue-600';
  if (size === 'small') {
    discountedPriceClass += ' text-base';
  } else if (size === 'medium') {
    discountedPriceClass += ' text-xl';
  } else if (size === 'large') {
    discountedPriceClass += ' text-3xl';
  }
  
  // Block 3 - Duplicated with slight variation
  let savingsClass = 'text-green-600';
  if (size === 'small') {
    savingsClass += ' text-xs';
  } else if (size === 'medium') {
    savingsClass += ' text-sm';
  } else if (size === 'large') {
    savingsClass += ' text-base';
  }
  
  // Duplicate calculation logic - these could be combined
  const discountedPrice = calculateDiscount(price, discountPercent);
  const savings = price - discountedPrice;
  const roundedDiscountedPrice = applyDiscount(price, discountPercent);
  
  return (
    <div className="price-display">
      {/* Display original price if requested */}
      {showOriginal && (
        <div className={originalPriceClass}>
          Original Price: {formatCurrency(price)}
        </div>
      )}
      
      {/* Display discounted price if there is a discount and showDiscount is true */}
      {discountPercent > 0 && showDiscount && (
        <div className={discountedPriceClass}>
          Sale Price: {formatPrice(discountedPrice)}
        </div>
      )}
      
      {/* Display savings amount if there is a discount */}
      {discountPercent > 0 && (
        <div className={savingsClass}>
          You Save: {formatCurrency(savings)} ({discountPercent}%)
        </div>
      )}
      
      {/* Another way to display the discounted price - duplication */}
      {discountPercent > 0 && showDiscount && (
        <div className="text-gray-500 text-sm">
          Rounded: {formatCurrency(roundedDiscountedPrice)}
        </div>
      )}
    </div>
  );
};

// Another component with duplicated structure
export const SimplePriceDisplay: React.FC<{ price: number; discount?: number }> = ({ price, discount = 0 }) => {
  // Duplicate calculation logic from above
  const discountedPrice = price - (price * (discount / 100));
  
  return (
    <div className="simple-price">
      <span className="text-lg font-bold">
        {formatCurrency(discountedPrice)}
      </span>
      {discount > 0 && (
        <span className="text-sm line-through text-gray-400 ml-2">
          {formatCurrency(price)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
