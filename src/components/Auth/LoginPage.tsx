import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { validateCredentials, verifyTwoFactor, resetLoginStep } from '../../store/authSlice';
import type { LoginCredentials, TwoFactorVerification } from '../../types';
import LoginForm from './LoginForm';
import TwoFactorAuth from './TwoFactorAuth';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loginStep, isLoading, error } = useAppSelector(state => state.auth);

  const handleCredentialsSubmit = (credentials: LoginCredentials) => {
    dispatch(validateCredentials(credentials));
  };

  const handleTwoFactorSubmit = (verification: TwoFactorVerification) => {
    dispatch(verifyTwoFactor(verification));
  };

  const handleBackToLogin = () => {
    dispatch(resetLoginStep());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Secure access to your inventory system</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          {loginStep === 'credentials' && (
            <LoginForm
              onSubmit={handleCredentialsSubmit}
              isLoading={isLoading}
              error={error}
            />
          )}

          {loginStep === 'twoFactor' && (
            <TwoFactorAuth
              onSubmit={handleTwoFactorSubmit}
              onBack={handleBackToLogin}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Secure login with two-factor authentication</p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default LoginPage;