import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Ensure cities table exists
async function ensureCitiesTable() {
  try {
    console.log('Checking if cities table exists...');
    const result = await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS cities_name_idx ON cities (LOWER(name));
    `);
    console.log('Cities table check/creation completed');
    return result;
  } catch (err) {
    console.error('Error ensuring cities table:', err);
    throw err;
  }
}

// GET /api/cities?query=bang
export async function GET(req: NextRequest) {
  const client = await pool.connect();
  try {
    await ensureCitiesTable();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    console.log('Searching cities with query:', query);
    
    const dbRes = await client.query(
      'SELECT id, name, country FROM cities WHERE LOWER(name) LIKE $1 ORDER BY name LIMIT 10',
      [`%${query.toLowerCase()}%`]
    );
    console.log('Found cities:', dbRes.rows);
    return NextResponse.json(dbRes.rows);
  } catch (err) {
    console.error('Error searching cities:', err);
    return NextResponse.json({ error: 'Database error', details: err }, { status: 500 });
  } finally {
    client.release();
  }
}

// POST /api/cities { name, country }
export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    console.log('Starting POST request to /api/cities');
    
    const body = await req.json();
    console.log('Received request body:', body);
    
    const { name, country } = body;
    console.log('Extracted name and country:', { name, country });
    
    if (!name || typeof name !== 'string') {
      console.error('Invalid city name:', name);
      return NextResponse.json({ error: 'City name required' }, { status: 400 });
    }

    // Start transaction
    await client.query('BEGIN');

    // Check if city exists
    console.log('Checking if city exists:', name);
    const exists = await client.query(
      'SELECT id, name, country FROM cities WHERE LOWER(name) = $1',
      [name.toLowerCase()]
    );
    console.log('City exists check result:', exists.rows);
    
    if (exists.rows.length > 0) {
      console.log('City already exists:', exists.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json(exists.rows[0]);
    }

    // Insert new city
    console.log('Attempting to insert new city:', { name, country });
    const insert = await client.query(
      'INSERT INTO cities (name, country) VALUES ($1, $2) RETURNING id, name, country',
      [name, country || null]
    );
    console.log('Successfully inserted city:', insert.rows[0]);

    await client.query('COMMIT');
    return NextResponse.json(insert.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in POST /api/cities:', err);
    return NextResponse.json({ 
      error: 'Database error', 
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  } finally {
    client.release();
  }
} 