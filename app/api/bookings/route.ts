import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        activity: {
          include: {
            images: true,
          },
        },
        schedule: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
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
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

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
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { price: true },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Calculate total price
    const totalPrice = activity.price * participants;

    // Create booking and update schedule in a transaction
    const booking = await prisma.$transaction([
      prisma.booking.create({
        data: {
          userId,
          activityId,
          scheduleId,
          participants,
          totalPrice,
          status: 'PENDING',
        },
      }),
      prisma.schedule.update({
        where: { id: scheduleId },
        data: {
          currentBookings: {
            increment: participants,
          },
        },
      }),
    ]);

    return NextResponse.json(booking[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 