import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  // Prompt for OpenAI
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

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  const data = await response.json();
  if (!response.ok) {
    console.error("OpenAI API error:", data);
    return NextResponse.json({ error: data.error?.message || "Failed to generate content" }, { status: response.status });
  }

  const generatedText = data.choices?.[0]?.message?.content || "";

  let suggestions = {};
  try {
    suggestions = JSON.parse(generatedText);
  } catch (e) {
    suggestions = { error: 'Failed to parse OpenAI response', raw: generatedText };
  }

  return NextResponse.json(suggestions);
} 