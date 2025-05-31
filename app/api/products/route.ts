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
  referencecode?: string;
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
    // Extract all form fields (all lowercase)
    const language = formData.get('language') as string;
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    let referencecode = formData.get('referencecode') as string;
    if (!referencecode) {
      // Generate reference code: YYMMDD01, YYMMDD02, etc.
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const prefix = `${yy}${mm}${dd}`;
      // Find the max counter for today
      const { rows } = await pool.query(
        `SELECT referencecode FROM product WHERE referencecode LIKE $1 ORDER BY referencecode DESC LIMIT 1`,
        [`${prefix}%`]
      );
      let counter = 1;
      if (rows.length > 0 && typeof rows[0].referencecode === 'string') {
        const lastCode = rows[0].referencecode;
        const lastCounter = parseInt(lastCode.slice(-2), 10);
        counter = isNaN(lastCounter) ? 1 : lastCounter + 1;
      }
      referencecode = `${prefix}${String(counter).padStart(2, '0')}`;
    }
    const shortdesc = formData.get('shortdesc') as string;
    const fulldesc = formData.get('fulldesc') as string;
    // Parse JSON fields
    const highlights = formData.get('highlights') ? JSON.parse(formData.get('highlights') as string) : [];
    const locations = formData.get('locations') ? JSON.parse(formData.get('locations') as string) : [];
    const keywords = formData.get('keywords') ? JSON.parse(formData.get('keywords') as string) : [];
    const inclusions = formData.get('inclusions') as string;
    const exclusions = formData.get('exclusions') as string;
    const options = formData.get('options') ? JSON.parse(formData.get('options') as string) : [];
    const price = parseFloat(formData.get('price') as string);
    const currency = formData.get('currency') as string;
    const availability = formData.get('availability') as string;
    const meetingpoint = formData.get('meetingpoint') as string;
    const importantinfo = formData.get('importantinfo') as string;
    // Handle photo uploads
    const photoUrls: string[] = [];
    for (let i = 0; formData.has(`photo${i}`); i++) {
      const photo = formData.get(`photo${i}`) as File;
      if (photo) {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${photo.name}`;
        const path = join(process.cwd(), 'public', 'uploads', filename);
        await writeFile(path, buffer);
        photoUrls.push(`/uploads/${filename}`);
      }
    }
    // Generate product id: YYMMDD01, YYMMDD02, etc.
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const prefix = `${yy}${mm}${dd}`;
    const { rows: idRows } = await pool.query(
      `SELECT id FROM product WHERE id::text LIKE $1 ORDER BY id DESC LIMIT 1`,
      [`${prefix}%`]
    );
    let idCounter = 1;
    if (idRows.length > 0 && typeof idRows[0].id === 'string') {
      const lastId = idRows[0].id;
      const lastCounter = parseInt(lastId.slice(-2), 10);
      idCounter = isNaN(lastCounter) ? 1 : lastCounter + 1;
    }
    const id = `${prefix}${String(idCounter).padStart(2, '0')}`;
    // Insert into database (all lowercase fields)
    let insertSuccess = false;
    let result;
    let maxAttempts = 10;
    let attempt = 0;
    while (!insertSuccess && attempt < maxAttempts) {
      try {
        result = await pool.query(
          `INSERT INTO product (
            id, language, category, title, referencecode, shortdesc,
            fulldesc, highlights, locations, keywords, inclusions,
            exclusions, options, price, currency, availability,
            meetingpoint, importantinfo, photos, createdat, updatedat
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())
          RETURNING id`,
          [
            id, language, category, title, referencecode, shortdesc,
            fulldesc,
            JSON.stringify(highlights),
            JSON.stringify(locations),
            JSON.stringify(keywords),
            inclusions,
            exclusions,
            JSON.stringify(options),
            price, currency, availability,
            meetingpoint, importantinfo,
            JSON.stringify(photoUrls)
          ]
        );
        insertSuccess = true;
      } catch (error) {
        // If duplicate key error, increment counter and try again
        if (error && error.code === '23505' && String(error.detail).includes('Key (id)=')) {
          idCounter++;
          id = `${prefix}${String(idCounter).padStart(2, '0')}`;
          attempt++;
        } else {
          throw error;
        }
      }
    }
    if (!insertSuccess) {
      throw new Error('Failed to generate unique product ID after multiple attempts');
    }
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