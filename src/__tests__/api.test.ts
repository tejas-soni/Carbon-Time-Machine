import { afterEach, describe, expect, test, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../../api/generate';

interface MockResponse {
  headers: Record<string, string>;
  statusCode: number;
  jsonPayload: unknown;
  setHeader: ReturnType<typeof vi.fn>;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
}

function createMockResponse(): VercelResponse & MockResponse {
  const response = {
    headers: {},
    statusCode: 200,
    jsonPayload: undefined,
  } as unknown as VercelResponse & MockResponse;

  response.setHeader = vi.fn((key: string, value: string) => {
    response.headers[key] = value;
    return response;
  });
  response.status = vi.fn((code: number) => {
    response.statusCode = code;
    return response;
  });
  response.json = vi.fn((payload: unknown) => {
    response.jsonPayload = payload;
    return response;
  });

  return response;
}

describe('API generate handler', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('rejects unsupported methods', async () => {
    const response = createMockResponse();
    await handler({ method: 'GET', body: {} } as VercelRequest, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(response.jsonPayload).toEqual({ error: 'Method Not Allowed' });
    expect(response.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(response.headers['X-Frame-Options']).toBe('DENY');
  });

  test('rejects missing or invalid prompts', async () => {
    const response = createMockResponse();
    await handler({ method: 'POST', body: { prompt: 42 } } as unknown as VercelRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.jsonPayload).toEqual({ error: 'A valid prompt string is required.' });
  });

  test('rejects oversized prompts', async () => {
    const response = createMockResponse();
    await handler(
      { method: 'POST', body: { prompt: 'a'.repeat(2001) } } as VercelRequest,
      response,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.jsonPayload).toEqual({
      error: 'Prompt exceeds maximum length of 2000 characters.',
    });
  });

  test('returns a server error when the API key is missing', async () => {
    const response = createMockResponse();
    await handler({ method: 'POST', body: { prompt: 'hello' } } as VercelRequest, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.jsonPayload).toEqual({
      error: 'API key is not configured in Vercel Environment Variables.',
    });
  });

  test('returns generated content when Gemini responds successfully', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = createMockResponse();
    await handler({ method: 'POST', body: { prompt: 'hello' } } as VercelRequest, response);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('gemini-3.1-flash-lite:generateContent?key=test-key'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.jsonPayload).toEqual({
      candidates: [{ content: { parts: [{ text: 'ok' }] } }],
    });
  });

  test('maps upstream API failures to a generic server error', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        text: async () => 'upstream unavailable',
      }),
    );

    const response = createMockResponse();
    await handler({ method: 'POST', body: { prompt: 'hello' } } as VercelRequest, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.jsonPayload).toEqual({ error: 'Failed to generate content.' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
