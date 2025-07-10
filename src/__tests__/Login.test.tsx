import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Auth/Login';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Login Component', () => {
  const mockLoginSuccess = vi.fn();
  
  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login onLoginSuccess={mockLoginSuccess} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Login to Product Management/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
  
  it('shows validation errors when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login onLoginSuccess={mockLoginSuccess} />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    
    // Fill in username but leave password empty
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
  
  it('shows error message for invalid credentials', async () => {
    render(
      <MemoryRouter>
        <Login onLoginSuccess={mockLoginSuccess} />
      </MemoryRouter>
    );
    
    // Fill in invalid credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Wait for the simulated API call to complete
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
    
    expect(mockLoginSuccess).not.toHaveBeenCalled();
    expect(localStorageMock.getItem('isAuthenticated')).toBeNull();
  });
  
  it('successfully logs in with correct credentials', async () => {
    render(
      <MemoryRouter>
        <Login onLoginSuccess={mockLoginSuccess} />
      </MemoryRouter>
    );
    
    // Fill in correct credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'P@ssw0rd' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Wait for the simulated API call to complete
    await waitFor(() => {
      expect(mockLoginSuccess).toHaveBeenCalledTimes(1);
    });
    
    expect(localStorageMock.getItem('isAuthenticated')).toBe('true');
  });
  
  it('shows loading state while submitting', async () => {
    render(
      <MemoryRouter>
        <Login onLoginSuccess={mockLoginSuccess} />
      </MemoryRouter>
    );
    
    // Fill in correct credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'P@ssw0rd' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Button should show loading state
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    
    // Wait for the simulated API call to complete
    await waitFor(() => {
      expect(mockLoginSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
