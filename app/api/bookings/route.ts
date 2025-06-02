import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Define types for database rows
interface Booking {
  id: string;
  userId: string;
  activityId: string;
  scheduleId: string;
  participants: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  activity?: Activity;
  schedule?: Schedule;
}

interface Activity {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  locations: string[];
  keywords: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  minAge: number | null;
  difficulty: string;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  images?: Image[];
}

interface Image {
  id: string;
  url: string;
  alt: string | null;
  activityId: string;
  createdAt: Date;
}

interface Schedule {
  id: string;
  activityId: string;
  startTime: Date;
  endTime: Date;
  maxCapacity: number;
  currentBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/bookings - Get user's bookings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    // Fallback for demo/testing: if userId is 'demo-user', return empty array
    if (userId === 'demo-user') {
      return NextResponse.json([]);
    }
    // Fetch bookings with activity (with images) and schedule
    const bookingsRes = await pool.query<Booking & Activity & Schedule>(
      `SELECT b.*, a.*, s.*, b.id as bookingId FROM "Booking" b
        JOIN "Activity" a ON b."activityId" = a.id
        JOIN "Schedule" s ON b."scheduleId" = s.id
        WHERE b."userId" = $1
        ORDER BY b."createdAt" DESC`,
      [userId]
    );
    const bookings = bookingsRes.rows;
    // Fetch images for all activities
    const activityIds = bookings.map((b: Booking) => b.activityId);
    let images: Image[] = [];
    if (activityIds.length) {
      const imagesRes = await pool.query<Image>(
        `SELECT * FROM "Image" WHERE "activityId" = ANY($1)`,
        [activityIds]
      );
      images = imagesRes.rows;
    }
    // Attach images to each booking's activity
    const bookingsWithDetails = bookings.map((booking: Booking & Activity & Schedule) => ({
      ...booking,
      activity: {
        ...booking,
        images: images.filter(img => img.activityId === booking.activityId),
      },
      schedule: {
        id: booking.scheduleId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        maxCapacity: booking.maxCapacity,
        currentBookings: booking.currentBookings,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    }));
    return NextResponse.json(bookingsWithDetails);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, activityId, scheduleId, participants } = data;
    // Check if schedule is available
    const scheduleRes = await pool.query<Schedule>(
      `SELECT * FROM "Schedule" WHERE id = $1`,
      [scheduleId]
    );
    const schedule = scheduleRes.rows[0];
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    if (schedule.currentBookings + participants > schedule.maxCapacity) {
      return NextResponse.json(
        { error: 'Not enough spots available' },
        { status: 400 }
      );
    }
    // Get activity price
    const activityRes = await pool.query<Activity>(
      `SELECT price FROM "Activity" WHERE id = $1`,
      [activityId]
    );
    const activity = activityRes.rows[0];
    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }
    // Calculate total price
    const totalPrice = activity.price * participants;
    // Create booking and update schedule in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const bookingRes = await client.query<Booking>(
        `INSERT INTO "Booking" ("userId", "activityId", "scheduleId", participants, "totalPrice", status, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, 'PENDING', NOW(), NOW()) RETURNING *`,
        [userId, activityId, scheduleId, participants, totalPrice]
      );
      await client.query(
        `UPDATE "Schedule" SET "currentBookings" = "currentBookings" + $1 WHERE id = $2`,
        [participants, scheduleId]
      );
      await client.query('COMMIT');
      return NextResponse.json(bookingRes.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 