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