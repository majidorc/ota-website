# OTA Website ![version](https://img.shields.io/badge/version-v1.0.0-blue)

This is a Next.js application for managing products, bookings, and more, using a Neon Postgres database.

## Version

Current version: **v1.0.0**

See [CHANGELOG.md](./CHANGELOG.md) for all major changes.

## Features
- Multi-step product creation form (15 steps)
- Product management (CRUD)
- Neon Postgres integration (via `pg`)
- Admin dashboard
- Modern UI/UX

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-3.5
- **Deployment**: Vercel

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/majidorc/ota-website.git
cd ota-website
```

### 2. Install dependencies
```sh
yarn install
```

### 3. Set up environment variables
Create a `.env` file with your Neon Postgres connection string:
```
DATABASE_URL=your_neon_postgres_url
```

### 4. Run migrations
- Run the SQL files in the `migrations/` directory on your Neon database (via the Neon dashboard or `psql`).
- Example:
  - `migrations/001_create_product_table.sql` (creates the Product table)
  - `migrations/002_alter_product_table.sql` (adds all product fields)

### 5. Start the development server
```sh
yarn dev
```

## Product Creation Flow
- Go to **Admin → Create → New Product**
- Fill out the 15-step multi-step form
- All product details are saved to the database
- Only one product creation form is active (no duplicates)

## API
- Product CRUD: `/api/products`
- Bookings: `/api/bookings`
- Activities: `/api/activities`

## Deployment
- Deploys automatically to Vercel on push to `main`
- Make sure to run migrations on Neon when you change the database schema

## License
MIT 

## Admin Dashboard Product Creation Workflow

- When you are on `/admin`, clicking **New Product** in the admin menu will replace the product list with the full multi-step product creation form.
- The form is fully embedded in the main content area (not a modal, not a new route, not an iframe).
- When you close or submit the form, the product list reappears in the same place.
- This provides a seamless single-page app experience for product management. 