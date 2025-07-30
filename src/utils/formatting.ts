import type { Product } from '../types';

// Large duplicated block from other utility files
export const formatCurrencyValue = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Another duplicated function with slight modifications
export const formatDateValue = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

// Function with duplicated code blocks internally
export const applyTaxes = (subtotal: number, taxRate: number = 0.0875): {
  subtotal: string;
  taxAmount: string;
  total: string;
} => {
  // Duplicate formatting code
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);
  
  const taxAmount = subtotal * taxRate;
  // Duplicate formatting code
  const formattedTaxAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(taxAmount);
  
  const total = subtotal + taxAmount;
  // Duplicate formatting code
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);
  
  return {
    subtotal: formattedSubtotal,
    taxAmount: formattedTaxAmount,
    total: formattedTotal,
  };
};

// Function with very similar logic to one in duplications.ts
export const generateProductSummary = (product: Product, includeDescription: boolean = false): string => {
  let summary = `Product: ${product.name}\n`;
  summary += `Price: ${formatCurrencyValue(product.price)}\n`;
  summary += `Category: ${product.category}\n`;
  summary += `Status: ${product.inStock ? 'In Stock' : 'Out of Stock'}\n`;
  summary += `Created: ${formatDateValue(product.createdAt)}\n`;
  
  if (includeDescription) {
    summary += `Description: ${product.description}\n`;
  }
  
  return summary;
};

// Function with similar structure to others
export const formatProductForDisplay = (product: Product): Record<string, string> => {
  return {
    name: product.name,
    price: formatCurrencyValue(product.price),
    category: product.category,
    status: product.inStock ? 'In Stock' : 'Out of Stock',
    created: formatDateValue(product.createdAt),
    updated: formatDateValue(product.updatedAt),
  };
};

// Validation function with similar structure to ones in duplications.ts
export const validateProductName = (name: string): { valid: boolean; message: string } => {
  if (!name) {
    return { valid: false, message: 'Name is required' };
  }
  
  if (name.length < 3) {
    return { valid: false, message: 'Name must be at least 3 characters' };
  }
  
  return { valid: true, message: '' };
};

// Almost identical to the above function
export const validateProductPrice = (price: number): { valid: boolean; message: string } => {
  if (price === undefined || price === null) {
    return { valid: false, message: 'Price is required' };
  }
  
  if (price <= 0) {
    return { valid: false, message: 'Price must be greater than zero' };
  }
  
  return { valid: true, message: '' };
};
