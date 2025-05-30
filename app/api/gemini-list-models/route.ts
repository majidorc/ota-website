import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || req.nextUrl.searchParams.get('key');
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 400 });
  }
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
} 