import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();

  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });

  Object.defineProperty(window, 'confirm', {
    value: vi.fn(() => true),
    writable: true,
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});
