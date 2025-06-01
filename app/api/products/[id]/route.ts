import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      "SELECT * FROM product WHERE id = $1",
      [params.id]
    );

    if (result.rows.length === 0) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    // Stringify JSON fields if present
    const jsonFields = ["highlights", "locations", "keywords", "options"];
    for (const field of jsonFields) {
      if (field in data && typeof data[field] !== "string") {
        data[field] = JSON.stringify(data[field]);
      }
    }
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in data) {
      fields.push(`"${key}" = $${idx++}`);
      values.push(data[key]);
    }
    values.push(params.id);
    const res = await pool.query(
      `UPDATE product SET ${fields.join(', ')}, updatedat = NOW() WHERE id = $${idx} RETURNING *`,
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const res = await pool.query(
      "DELETE FROM product WHERE id = $1 RETURNING *",
      [params.id]
    );
    if (!res.rows[0]) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
} 