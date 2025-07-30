import { formatCurrency, formatDate } from './helpers';

// Duplicate code from formatCurrency in helpers.ts
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Duplicate code from formatDate in helpers.ts
export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

// Function with duplicated blocks internally
export const calculateTotals = (prices: number[]): { 
  subtotal: string; 
  tax: string; 
  total: string; 
} => {
  // First block of duplicate code
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);
  
  // Duplicate block for tax calculation
  const taxAmount = subtotal * 0.1;
  const formattedTax = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(taxAmount);
  
  // Duplicate block for total calculation
  const totalAmount = subtotal + taxAmount;
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalAmount);
  
  return {
    subtotal: formattedSubtotal,
    tax: formattedTax,
    total: formattedTotal
  };
};

// Function with duplicate parameter validation
export const validateEmail = (email: string): { valid: boolean; message: string } => {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  
  if (!email.includes('@')) {
    return { valid: false, message: 'Email must contain @' };
  }
  
  return { valid: true, message: '' };
};

// Function with almost identical code to validateEmail
export const validateUsername = (username: string): { valid: boolean; message: string } => {
  if (!username) {
    return { valid: false, message: 'Username is required' };
  }
  
  if (username.length < 4) {
    return { valid: false, message: 'Username must be at least 4 characters' };
  }
  
  return { valid: true, message: '' };
};

// Duplicate code block to calculate discounted price
export const calculateDiscount = (price: number, discountPercent: number): number => {
  const discount = price * (discountPercent / 100);
  return price - discount;
};

// Almost identical function to calculateDiscount
export const applyDiscount = (price: number, discountPercent: number): number => {
  const discount = price * (discountPercent / 100);
  return Math.round((price - discount) * 100) / 100;
};

// Helper function with significant duplication
export const generateReport = (products: Array<{ name: string; price: number; date: string }>): string => {
  let report = 'Product Report\n';
  report += '==============\n\n';
  
  products.forEach(product => {
    report += `Product: ${product.name}\n`;
    report += `Price: ${formatPrice(product.price)}\n`;
    report += `Date: ${formatDateTime(product.date)}\n`;
    report += `Discounted Price: ${formatPrice(calculateDiscount(product.price, 10))}\n`;
    report += '----------------------\n';
  });
  
  return report;
};

// Another helper function with significant duplication
export const generateInvoice = (products: Array<{ name: string; price: number; date: string }>): string => {
  let invoice = 'Invoice\n';
  invoice += '==============\n\n';
  
  products.forEach(product => {
    invoice += `Item: ${product.name}\n`;
    invoice += `Price: ${formatPrice(product.price)}\n`;
    invoice += `Date: ${formatDateTime(product.date)}\n`;
    invoice += `Discounted Price: ${formatPrice(applyDiscount(product.price, 10))}\n`;
    invoice += '----------------------\n';
  });
  
  return invoice;
};
