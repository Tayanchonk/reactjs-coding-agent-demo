import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingOverlay from '../components/UI/LoadingOverlay';

describe('LoadingOverlay', () => {
  it('should not render when isVisible is false', () => {
    render(<LoadingOverlay isVisible={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isVisible is true', () => {
    render(<LoadingOverlay isVisible={true} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Loading...', { selector: 'p' })).toBeInTheDocument();
  });

  it('should display custom message when provided', () => {
    const customMessage = 'Processing your request...';
    render(<LoadingOverlay isVisible={true} message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingOverlay isVisible={true} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'loading-message');
    expect(dialog).toHaveAttribute('aria-describedby', 'loading-description');
  });

  it('should apply custom className when provided', () => {
    const customClass = 'custom-overlay-class';
    render(<LoadingOverlay isVisible={true} className={customClass} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(customClass);
  });
});