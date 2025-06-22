import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import TwoFactorAuth from '../components/Auth/TwoFactorAuth';

describe('TwoFactorAuth', () => {
  const mockOnSubmit = jest.fn();
  const mockOnBack = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    onBack: mockOnBack,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render two-factor auth form with required elements', () => {
    render(<TwoFactorAuth {...defaultProps} />);
    
    expect(screen.getByText(/two-factor authentication/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify & sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
    expect(screen.getByText(/demo verification code/i)).toBeInTheDocument();
  });

  it('should show validation error for empty code', async () => {
    render(<TwoFactorAuth {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /verify & sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/verification code is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for incorrect length', async () => {
    render(<TwoFactorAuth {...defaultProps} />);
    
    const codeInput = screen.getByLabelText(/verification code/i);
    fireEvent.change(codeInput, { target: { value: '123' } });
    
    const submitButton = screen.getByRole('button', { name: /verify & sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/verification code must be 6 digits/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should only allow numeric input and limit to 6 digits', () => {
    render(<TwoFactorAuth {...defaultProps} />);
    
    const codeInput = screen.getByLabelText(/verification code/i) as HTMLInputElement;
    
    // Should filter out non-numeric characters
    fireEvent.change(codeInput, { target: { value: 'abc123def456' } });
    expect(codeInput.value).toBe('123456');
    
    // Should limit to 6 digits
    fireEvent.change(codeInput, { target: { value: '1234567890' } });
    expect(codeInput.value).toBe('123456');
  });

  it('should show loading state when isLoading is true', () => {
    render(<TwoFactorAuth {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText(/verifying/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verifying/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /back to login/i })).toBeDisabled();
  });

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'Invalid verification code';
    render(<TwoFactorAuth {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should clear validation errors when user starts typing', async () => {
    render(<TwoFactorAuth {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /verify & sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/verification code is required/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByLabelText(/verification code/i);
    fireEvent.change(codeInput, { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.queryByText(/verification code is required/i)).not.toBeInTheDocument();
    });
  });
});