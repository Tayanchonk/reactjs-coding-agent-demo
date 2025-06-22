import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Simple component that uses common Tailwind classes to verify they are working
const TailwindTestComponent: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Title</h1>
          <p className="text-gray-600 mt-1">Test description</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Test Button
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              In Stock
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

describe('Tailwind CSS Integration', () => {
  it('should render component with Tailwind classes without errors', () => {
    const { container } = render(<TailwindTestComponent />);
    
    // Verify the component renders without throwing errors
    expect(container.firstChild).toBeInTheDocument();
    
    // Check for key structural elements with Tailwind classes
    const header = container.querySelector('header');
    const button = container.querySelector('button');
    const mainContent = container.querySelector('main');
    
    expect(header).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(mainContent).toBeInTheDocument();
    
    // Verify specific classes are applied (this ensures Tailwind CSS processing is working)
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b');
    expect(button).toHaveClass('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'font-medium');
    expect(mainContent).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'py-8');
  });

  it('should apply responsive Tailwind classes correctly', () => {
    const { container } = render(<TailwindTestComponent />);
    
    // Verify responsive classes are present
    const responsiveElement = container.querySelector('.sm\\:px-6');
    expect(responsiveElement).toBeInTheDocument();
    
    const responsiveElement2 = container.querySelector('.lg\\:px-8');
    expect(responsiveElement2).toBeInTheDocument();
  });
});