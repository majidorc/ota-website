import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/products - List all products
export async function GET() {
  try {
    const res = await pool.query<Product>('SELECT * FROM "Product" ORDER BY "createdAt" DESC');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const res = await pool.query<Product>(
      `INSERT INTO "Product" (name, description, price, image, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [data.name, data.description, data.price, data.image]
    );
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PATCH /api/products - Update a product
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key of ['name', 'description', 'price', 'image']) {
      if (data[key] !== undefined) {
        fields.push(`"${key}" = $${idx++}`);
        values.push(data[key]);
      }
    }
    values.push(data.id);
    const res = await pool.query<Product>(
      `UPDATE "Product" SET ${fields.join(', ')}, "updatedAt" = NOW() WHERE id = $${idx} RETURNING *`,
      values
    );
    if (!res.rows[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products - Delete a product
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    await pool.query('DELETE FROM "Product" WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 