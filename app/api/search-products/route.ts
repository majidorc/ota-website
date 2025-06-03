import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Fetch real local products from the database matching the query
async function fetchLocalProducts(query: string) {
  if (!query) {
    // Return all products if no query
    const result = await pool.query('SELECT * FROM product ORDER BY createdat DESC LIMIT 20');
    return result.rows.map(row => ({
      id: row.id,
      title: row.title || row.name,
      description: row.shortdesc || row.description || '',
      price: row.price !== null ? Number(row.price) : null,
      image: (row.photos && Array.isArray(row.photos) && row.photos.length > 0) ? row.photos[0] : row.image || '/images/placeholder.jpg',
    }));
  }
  // Search by title, description, or keywords (case-insensitive)
  const result = await pool.query(
    `SELECT * FROM product WHERE 
      LOWER(title) LIKE $1 OR LOWER(shortdesc) LIKE $1 OR LOWER(fulldesc) LIKE $1 OR 
      (keywords IS NOT NULL AND keywords::text ILIKE $1)
      ORDER BY createdat DESC LIMIT 20`,
    [`%${query.toLowerCase()}%`]
  );
  return result.rows.map(row => ({
    id: row.id,
    title: row.title || row.name,
    description: row.shortdesc || row.description || '',
    price: row.price !== null ? Number(row.price) : null,
    image: (row.photos && Array.isArray(row.photos) && row.photos.length > 0) ? row.photos[0] : row.image || '/images/placeholder.jpg',
  }));
}

// Mock function to fetch Viator products (replace with real API call)
async function fetchViatorProducts(query: string) {
  // TODO: Integrate real Viator API
  return [
    {
      id: 'viator-1',
      title: 'Snorkeling Adventure',
      description: 'Explore the reef with a guided tour.',
      price: 120,
      image: '/images/viator1.jpg',
    },
    // ...more viator products
  ];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  // Fetch local and Viator products
  const [localProducts, viatorProducts] = await Promise.all([
    fetchLocalProducts(query),
    fetchViatorProducts(query),
  ]);

  // Merge: local products first
  const products = [...localProducts, ...viatorProducts];

  return NextResponse.json({ products });
} 