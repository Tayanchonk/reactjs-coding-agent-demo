// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

// Get unique categories from products
export const getUniqueCategories = (products: any[]): string[] => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)].sort();
};

// Validate product data
export interface ValidationErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
}

export const validateProduct = (data: {
  name: string;
  description: string;
  price: number;
  category: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Product name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (isNaN(data.price) || data.price <= 0) {
    errors.price = 'Price must be a positive number';
  }

  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }

  return errors;
};