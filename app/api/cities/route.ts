import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Ensure cities table exists
async function ensureCitiesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS cities_name_idx ON cities (LOWER(name));
    `);
  } catch (err) {
    console.error('Error ensuring cities table:', err);
    throw err;
  }
}

// GET /api/cities?query=bang
export async function GET(req: NextRequest) {
  try {
    await ensureCitiesTable();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
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
    await ensureCitiesTable();
    const { name, country } = await req.json();
    console.log('Adding city:', { name, country });
    
    if (!name || typeof name !== 'string') {
      console.error('Invalid city name:', name);
      return NextResponse.json({ error: 'City name required' }, { status: 400 });
    }

    // Check if city exists
    const exists = await pool.query('SELECT id FROM cities WHERE LOWER(name) = $1', [name.toLowerCase()]);
    console.log('City exists check result:', exists.rows);
    
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
    return NextResponse.json({ 
      error: 'Database error', 
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
} 