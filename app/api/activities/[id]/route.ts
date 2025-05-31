import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/activities/[id] - Get single activity
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch activity
    const activityRes = await pool.query(
      `SELECT * FROM "Activity" WHERE id = $1`,
      [params.id]
    );
    const activity = activityRes.rows[0];
    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }
    // Fetch images, schedules, reviews (with user name)
    const [imagesRes, schedulesRes, reviewsRes] = await Promise.all([
      pool.query(`SELECT * FROM "Image" WHERE "activityId" = $1`, [params.id]),
      pool.query(`SELECT * FROM "Schedule" WHERE "activityId" = $1 AND "startTime" >= $2`, [params.id, new Date()]),
      pool.query(`SELECT r.*, u.name as userName FROM "Review" r JOIN "User" u ON r."userId" = u.id WHERE r."activityId" = $1`, [params.id])
    ]);
    activity.images = imagesRes.rows;
    activity.schedules = schedulesRes.rows;
    activity.reviews = reviewsRes.rows.map(r => ({
      ...r,
      user: { name: r.username || r.userName }
    }));
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}

// PATCH /api/activities/[id] - Update activity
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    // Build dynamic SET clause
    const setClauses = [];
    const values = [];
    let idx = 1;
    for (const key in data) {
      setClauses.push(`"${key}" = $${idx++}`);
      values.push(data[key]);
    }
    values.push(params.id);
    const updateRes = await pool.query(
      `UPDATE "Activity" SET ${setClauses.join(', ')}, "updatedAt" = NOW() WHERE id = $${idx} RETURNING *`,
      values
    );
    const activity = updateRes.rows[0];
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

// DELETE /api/activities/[id] - Delete activity
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query(`DELETE FROM "Activity" WHERE id = $1`, [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
} 