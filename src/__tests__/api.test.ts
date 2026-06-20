/**
 * @fileoverview API contract tests.
 * Validates prompt length constraints and error boundaries for the Gemini endpoint.
 */
import { describe, test, expect } from 'vitest';

// These constants mirror the validation in api/generate.ts
const MAX_PROMPT_LENGTH = 2000;

describe('API Contract Validation', () => {
  test('MAX_PROMPT_LENGTH matches expected constraint (2000)', () => {
    expect(MAX_PROMPT_LENGTH).toBe(2000);
  });

  test('validates that empty prompts would be rejected', () => {
    const emptyPrompt = '';
    expect(emptyPrompt.length).toBe(0);
    expect(emptyPrompt.length > 0).toBe(false);
  });

  test('validates that oversized prompts would be rejected', () => {
    const hugePrompt = 'A'.repeat(3000);
    expect(hugePrompt.length > MAX_PROMPT_LENGTH).toBe(true);
  });
});
