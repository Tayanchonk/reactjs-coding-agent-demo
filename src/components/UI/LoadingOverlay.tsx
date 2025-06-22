import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Loading...',
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${className}`}
      role="dialog"
      aria-labelledby="loading-message"
      aria-describedby="loading-description"
    >
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl transform transition-all duration-300 scale-100">
        <LoadingSpinner size="lg" />
        <p id="loading-message" className="text-gray-700 font-medium text-center">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;