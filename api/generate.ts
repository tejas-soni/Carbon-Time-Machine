import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = request.body;

  if (!prompt) {
    return response.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured in Vercel Environment Variables' });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    if (!res.ok) {
       const errData = await res.text();
       throw new Error(`Google API error: ${res.status} ${errData}`);
    }

    const data = await res.json();
    return response.status(200).json(data);
  } catch (error: any) {
    console.error('Error generating content:', error);
    return response.status(500).json({ error: 'Failed to generate content' });
  }
}
