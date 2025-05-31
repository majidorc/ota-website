import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Try to query the database
    const { rows } = await pool.query('SELECT NOW() as now');
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      now: rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 