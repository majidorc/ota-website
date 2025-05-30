import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  // Gemini API key (should be in env for production)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
  }
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-001:generateContent?key=${GEMINI_API_KEY}`;

  // Prompt for Gemini
  const prompt = `Extract the following from the provided activity description:
- Title (max 60 chars)
- Short description (2-3 sentences, max 200 chars)
- Full description (detailed, max 1000 chars)
- Highlights (3-5 bullet points, each max 80 chars)
- Inclusions (list, one per line)
- Exclusions (list, one per line)
- Locations (list, one per line, if possible)
- Keywords (list, comma separated, if possible)

Return as JSON with keys: title, shortDescription, fullDescription, highlights, inclusions, exclusions, locations, keywords.

Activity description:
"""
${content}
"""`;

  const geminiRes = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: content }
          ]
        }
      ]
    })
  });

  if (!geminiRes.ok) {
    const error = await geminiRes.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  const geminiData = await geminiRes.json();
  // Try to parse the model's response as JSON
  let suggestions = {};
  try {
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    suggestions = JSON.parse(text);
  } catch (e) {
    suggestions = { error: 'Failed to parse Gemini response', raw: geminiData };
  }

  return NextResponse.json(suggestions);
} 