# OTA Website ![version](https://img.shields.io/badge/version-v1.2.0-blue)

A modern Next.js application for managing tours and activities, built with a focus on user experience and performance.

## Features

- **Product Management**
  - Multi-step product creation (15 steps)
  - SEO-friendly URLs (`/tours/[title]-[id]`)
  - Product status tracking (Bookable, Deactivated, Not yet submitted)
  - Reference code system

- **Admin Dashboard**
  - Product CRUD operations
  - Status management
  - Search and filtering
  - Modern UI with responsive design

- **Database**
  - Neon Postgres integration
  - Automatic table creation
  - Transaction support
  - Efficient querying

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Neon)
- **Authentication:** NextAuth.js
- **Deployment:** Vercel

## Quick Start

1. Clone the repository:
   ```sh
   git clone https://github.com/majidorc/ota-website.git
   cd ota-website
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```

3. Set up environment:
   ```sh
   # Create .env file with:
   DATABASE_URL=your_neon_postgres_url
   ```

4. Run the development server:
   ```sh
   yarn dev
   ```

## API Endpoints

- `/api/products` - Product CRUD operations
- `/api/bookings` - Booking management
- `/api/activities` - Activity management

## Product ID Format

- Format: `YYMMDD01` (e.g., 24060101)
- Unique and non-editable
- Used as primary key
- Reference code is optional and editable

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of all major changes. 