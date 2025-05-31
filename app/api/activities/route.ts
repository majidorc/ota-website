import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/activities - Get all activities
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const location = searchParams.get('location');

    const where = {
      status: 'PUBLISHED',
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(location && { locations: { has: location } }),
    };

    const activities = await prisma.activity.findMany({
      where,
      include: {
        images: true,
        schedules: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
        },
      },
    });

    return NextResponse.json(activities);
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
    const activity = await prisma.activity.create({
      data: {
        ...data,
        status: 'DRAFT',
      },
    });
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
} 