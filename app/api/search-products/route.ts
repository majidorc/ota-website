import { NextRequest, NextResponse } from 'next/server';

// Mock function to fetch local products (replace with real DB call)
async function fetchLocalProducts(query: string) {
  // TODO: Replace with real database query
  return [
    {
      id: 'local-1',
      title: 'Local Island Tour',
      description: 'A unique local experience.',
      price: 100,
      image: '/images/local1.jpg',
      // ...other fields
    },
    // ...more local products
  ];
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
      // ...other fields
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