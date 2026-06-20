/**
 * @fileoverview Vercel Serverless API endpoint for AI content generation.
 * Securely proxies requests to the Google Gemini API, keeping the API key
 * hidden from the client-side bundle.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Maximum allowed prompt length in characters to prevent abuse. */
const MAX_PROMPT_LENGTH = 2000;

/** Gemini API model identifier. */
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

/** Base URL for the Google Generative Language API. */
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Handles POST requests to generate AI-personalized future self notes.
 * Validates input, forwards the prompt to Google Gemini, and returns the response.
 */
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { prompt } = request.body;

  if (!prompt || typeof prompt !== 'string') {
    response.status(400).json({ error: 'A valid prompt string is required.' });
    return;
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    response.status(400).json({ error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters.` });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    response.status(500).json({ error: 'API key is not configured in Vercel Environment Variables.' });
    return;
  }

  try {
    const res = await fetch(`${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!res.ok) {
      const errData = await res.text();
      throw new Error(`Google API error: ${res.status} ${errData}`);
    }

    const data = await res.json();
    response.status(200).json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating content:', message);
    response.status(500).json({ error: 'Failed to generate content.' });
  }
}
