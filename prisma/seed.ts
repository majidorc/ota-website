import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create sample activity
  const activity = await prisma.activity.create({
    data: {
      title: 'Bali Temple Tour',
      shortDescription: 'Explore ancient temples and cultural sites in Bali',
      fullDescription: 'Visit the most beautiful temples in Bali, including Uluwatu Temple, Tanah Lot, and Besakih Temple. Learn about Balinese culture and traditions from our expert guides.',
      highlights: ['Cultural Experience', 'Scenic Views', 'Local Guide'],
      inclusions: ['Transportation', 'Guide', 'Entrance Fees', 'Lunch'],
      exclusions: ['Personal Expenses', 'Tips'],
      locations: ['Bali', 'Uluwatu', 'Tanah Lot'],
      keywords: ['temple', 'culture', 'bali', 'tour', 'heritage'],
      price: 75.00,
      duration: 8,
      maxGroupSize: 12,
      minAge: 12,
      difficulty: 'EASY',
      category: 'CULTURAL',
      status: 'PUBLISHED',
      images: {
        create: [
          {
            url: 'https://example.com/temple1.jpg',
            alt: 'Uluwatu Temple'
          },
          {
            url: 'https://example.com/temple2.jpg',
            alt: 'Tanah Lot Temple'
          }
        ]
      },
      schedules: {
        create: [
          {
            startTime: new Date('2024-04-01T08:00:00Z'),
            endTime: new Date('2024-04-01T16:00:00Z'),
            maxCapacity: 12,
            currentBookings: 0
          },
          {
            startTime: new Date('2024-04-02T08:00:00Z'),
            endTime: new Date('2024-04-02T16:00:00Z'),
            maxCapacity: 12,
            currentBookings: 0
          }
        ]
      }
    }
  })

  console.log({ admin, activity })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 