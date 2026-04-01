import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple test to verify Vitest setup works
describe('Vitest Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should render a simple component', () => {
    const TestComponent = () => <div data-testid="test">Hello Test</div>;
    render(<TestComponent />);
    expect(screen.getByTestId('test')).toHaveTextContent('Hello Test');
  });
});
