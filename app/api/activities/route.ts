import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/activities - Get all activities
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const location = searchParams.get('location');

    // Build dynamic WHERE clause
    let whereClauses = [`status = 'PUBLISHED'`];
    let values: any[] = [];
    let idx = 1;
    if (category) {
      whereClauses.push(`category = $${idx++}`);
      values.push(category);
    }
    if (difficulty) {
      whereClauses.push(`difficulty = $${idx++}`);
      values.push(difficulty);
    }
    if (location) {
      whereClauses.push(`$${idx++} = ANY(locations)`);
      values.push(location);
    }
    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Fetch activities with images and schedules
    const activitiesRes = await pool.query(
      `SELECT * FROM "Activity" ${where} ORDER BY "createdAt" DESC`,
      values
    );
    const activities = activitiesRes.rows;

    // Fetch images and schedules for all activities
    const activityIds = activities.map((a: any) => a.id);
    let images: any[] = [];
    let schedules: any[] = [];
    if (activityIds.length) {
      const imagesRes = await pool.query(
        `SELECT * FROM "Image" WHERE "activityId" = ANY($1)`,
        [activityIds]
      );
      images = imagesRes.rows;
      const now = new Date();
      const schedulesRes = await pool.query(
        `SELECT * FROM "Schedule" WHERE "activityId" = ANY($1) AND "startTime" >= $2`,
        [activityIds, now]
      );
      schedules = schedulesRes.rows;
    }
    // Attach images and schedules to activities
    const activitiesWithDetails = activities.map((activity: any) => ({
      ...activity,
      images: images.filter(img => img.activityId === activity.id),
      schedules: schedules.filter(sch => sch.activityId === activity.id),
    }));
    return NextResponse.json(activitiesWithDetails);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/activities - Create new activity
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Insert new activity
    const insertRes = await pool.query(
      `INSERT INTO "Activity" (
        title, "shortDescription", "fullDescription", highlights, inclusions, exclusions, locations, keywords, price, duration, "maxGroupSize", "minAge", difficulty, category, status, "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'DRAFT', NOW(), NOW()
      ) RETURNING *`,
      [
        data.title,
        data.shortDescription,
        data.fullDescription,
        data.highlights,
        data.inclusions,
        data.exclusions,
        data.locations,
        data.keywords,
        data.price,
        data.duration,
        data.maxGroupSize,
        data.minAge,
        data.difficulty,
        data.category
      ]
    );
    const activity = insertRes.rows[0];
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
} 