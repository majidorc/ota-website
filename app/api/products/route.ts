import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile } from 'fs/promises';
import { join } from 'path';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  referenceCode?: string;
  shortDesc?: string;
  fullDesc?: string;
  highlights?: string[];
  locations?: string[];
  keywords?: string[];
  inclusions?: string;
  exclusions?: string;
  options?: any[];
  currency?: string;
  availability?: string;
  meetingPoint?: string;
  importantInfo?: string;
}

// GET /api/products - List all products
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM product ORDER BY createdAt DESC');
    // Ensure price is always a number
    const products = result.rows.map(row => ({
      ...row,
      price: row.price !== null ? Number(row.price) : null,
    }));
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract all form fields
    const language = formData.get('language') as string;
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const referenceCode = formData.get('referenceCode') as string;
    const shortDesc = formData.get('shortDesc') as string;
    const fullDesc = formData.get('fullDesc') as string;
    const highlights = formData.get('highlights') as string;
    const locations = formData.get('locations') as string;
    const keywords = formData.get('keywords') as string;
    const inclusions = formData.get('inclusions') as string;
    const exclusions = formData.get('exclusions') as string;
    const options = formData.get('options') as string;
    const price = parseFloat(formData.get('price') as string);
    const currency = formData.get('currency') as string;
    const availability = formData.get('availability') as string;
    const meetingPoint = formData.get('meetingPoint') as string;
    const importantInfo = formData.get('importantInfo') as string;

    // Handle photo uploads
    const photoUrls: string[] = [];
    for (let i = 0; formData.has(`photo${i}`); i++) {
      const photo = formData.get(`photo${i}`) as File;
      if (photo) {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a unique filename
        const filename = `${Date.now()}-${photo.name}`;
        const path = join(process.cwd(), 'public', 'uploads', filename);
        
        // Save the file
        await writeFile(path, buffer);
        photoUrls.push(`/uploads/${filename}`);
      }
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO product (
        language, category, title, referenceCode, shortDesc,
        fullDesc, highlights, locations, keywords, inclusions,
        exclusions, options, price, currency, availability,
        meetingPoint, importantInfo, photos, createdAt, updatedAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
      RETURNING id`,
      [
        language, category, title, referenceCode, shortDesc,
        fullDesc,
        highlights ? highlights : '[]',
        locations ? locations : '[]',
        keywords ? keywords : '[]',
        inclusions,
        exclusions,
        options ? options : '[]',
        price, currency, availability,
        meetingPoint, importantInfo,
        JSON.stringify(photoUrls)
      ]
    );

    return NextResponse.json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
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