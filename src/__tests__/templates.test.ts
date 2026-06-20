/**
 * @fileoverview Unit tests for the narrative template generation.
 * Validates that fallback notes match the user's identified archetype.
 */
import { describe, test, expect } from 'vitest';
import { generateFutureNote, LOCAL_NOTES } from '../utils/templates';
import { Archetype } from '../types';

describe('Future Self Note Templates', () => {
  const archetypes: Archetype[] = [
    'Convenience Commuter',
    'Delivery Loop',
    'Cooling Dependent Urbanite',
    'High-Street Shopper',
    'Packaging Accumulator',
    'Quiet Saver',
  ];

  test.each(archetypes)('generateFutureNote returns a non-empty note for archetype: %s', (archetype) => {
    const note = generateFutureNote(archetype);
    expect(note).toBeTruthy();
    expect(note.length).toBeGreaterThan(50);
    expect(note).toContain('2050');
  });

  test('generateFutureNote falls back to Quiet Saver for unknown archetype', () => {
    const note = generateFutureNote('Unknown Archetype' as Archetype);
    expect(note).toBe(LOCAL_NOTES['Quiet Saver']);
  });

  test('LOCAL_NOTES has entries for all defined archetypes', () => {
    archetypes.forEach((archetype) => {
      expect(LOCAL_NOTES[archetype]).toBeDefined();
      expect(typeof LOCAL_NOTES[archetype]).toBe('string');
    });
  });

  test('each note template contains emotional and personalized content', () => {
    archetypes.forEach((archetype) => {
      const note = LOCAL_NOTES[archetype];
      expect(note).toContain('Dear Present Me');
      expect(note).toContain('2050');
    });
  });
});
