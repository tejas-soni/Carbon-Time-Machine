import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ThrowingComponent = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  test('renders fallback UI when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
