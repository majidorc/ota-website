import { NextResponse } from 'next/server';

const destinations = [
  { id: 1, name: 'Paris, France', description: 'Experience the city of love with its iconic landmarks and rich culture.' },
  { id: 2, name: 'Tokyo, Japan', description: 'Discover the perfect blend of traditional culture and modern innovation.' },
  { id: 3, name: 'New York, USA', description: 'Explore the city that never sleeps with its endless possibilities.' },
];

export async function GET() {
  return NextResponse.json(destinations);
} 