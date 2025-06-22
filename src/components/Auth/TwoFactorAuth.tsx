import React, { useState } from 'react';
import type { TwoFactorVerification, LoginFormErrors } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';

interface TwoFactorAuthProps {
  onSubmit: (verification: TwoFactorVerification) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ 
  onSubmit, 
  onBack, 
  isLoading, 
  error 
}) => {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!code.trim()) {
      newErrors.code = 'Verification code is required';
    } else if (code.length !== 6) {
      newErrors.code = 'Verification code must be 6 digits';
    } else if (!/^\d+$/.test(code)) {
      newErrors.code = 'Verification code must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ code });
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setCode(value);
    
    // Clear errors when user starts typing
    if (errors.code) {
      setErrors(prev => ({
        ...prev,
        code: undefined,
      }));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600">Please enter the 6-digit verification code to complete your login.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={handleCodeChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-center text-lg tracking-widest ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="000000"
            disabled={isLoading}
            maxLength={6}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Verifying...
              </>
            ) : (
              'Verify & Sign In'
            )}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back to Login
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Verification Code:</h3>
        <p className="text-sm text-gray-600">
          <strong>Code:</strong> 864120
        </p>
      </div>
    </div>
  );
};

export default TwoFactorAuth;