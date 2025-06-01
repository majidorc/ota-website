import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/cities?query=bang
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  try {
    console.log('Searching cities with query:', query);
    const dbRes = await pool.query(
      'SELECT id, name, country FROM cities WHERE LOWER(name) LIKE $1 ORDER BY name LIMIT 10',
      [`%${query.toLowerCase()}%`]
    );
    console.log('Found cities:', dbRes.rows);
    return NextResponse.json(dbRes.rows);
  } catch (err) {
    console.error('Error searching cities:', err);
    return NextResponse.json({ error: 'Database error', details: err }, { status: 500 });
  }
}

// POST /api/cities { name, country }
export async function POST(req: NextRequest) {
  try {
    const { name, country } = await req.json();
    console.log('Adding city:', { name, country });
    
    if (!name || typeof name !== 'string') {
      console.error('Invalid city name:', name);
      return NextResponse.json({ error: 'City name required' }, { status: 400 });
    }

    // Check if city exists
    const exists = await pool.query('SELECT id FROM cities WHERE LOWER(name) = $1', [name.toLowerCase()]);
    if (exists.rows.length > 0) {
      console.log('City already exists:', exists.rows[0]);
      return NextResponse.json({ id: exists.rows[0].id, name, country });
    }

    // Insert new city
    const insert = await pool.query(
      'INSERT INTO cities (name, country) VALUES ($1, $2) RETURNING id, name, country',
      [name, country || null]
    );
    console.log('Added new city:', insert.rows[0]);
    return NextResponse.json(insert.rows[0]);
  } catch (err) {
    console.error('Error adding city:', err);
    return NextResponse.json({ error: 'Database error', details: err }, { status: 500 });
  }
} 