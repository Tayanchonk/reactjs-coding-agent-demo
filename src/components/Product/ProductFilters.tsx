import React, { useState } from 'react';
import type { ProductFilters, ProductSortOptions, Product } from '../../types';
import { getUniqueCategories } from '../../utils/helpers';

interface ProductFiltersProps {
  products: Product[];
  filters: ProductFilters;
  sortOptions: ProductSortOptions;
  onFiltersChange: (filters: ProductFilters) => void;
  onSortChange: (sortOptions: ProductSortOptions) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  filters,
  sortOptions,
  onFiltersChange,
  onSortChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const categories = getUniqueCategories(products);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({ 
      ...filters, 
      category: value === '' ? undefined : value 
    });
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({ 
      ...filters, 
      inStock: value === '' ? undefined : value === 'true' 
    });
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field = e.target.value as keyof Product;
    onSortChange({ ...sortOptions, field });
  };

  const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const direction = e.target.value as 'asc' | 'desc';
    onSortChange({ ...sortOptions, direction });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
    onSortChange({ field: 'name', direction: 'asc' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={handleCategoryChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Status
          </label>
          <select
            id="stock"
            value={filters.inStock === undefined ? '' : String(filters.inStock)}
            onChange={handleStockChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Products</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sortField" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortField"
            value={sortOptions.field}
            onChange={handleSortFieldChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
            <option value="createdAt">Date Created</option>
            <option value="inStock">Stock Status</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-1">
            Direction
          </label>
          <select
            id="sortDirection"
            value={sortOptions.direction}
            onChange={handleSortDirectionChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;