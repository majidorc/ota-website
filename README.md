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

- **Frontend:** Next.js 14, React, Tailwind CSS, next/image
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **AI:** OpenAI GPT-3.5 (for product autofill)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

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

## Troubleshooting

### Database connection and table existence
- Ensure your `DATABASE_URL` in your `.env` file matches your Neon project, branch, and database name.
- The app requires a table named `product` (all lowercase) in your database.
- To verify, connect to your Neon database and run:
  ```sql
  SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  ```
  You should see `product` in the results.
- If you get errors like `relation "product" does not exist`, double-check your connection string and that the table exists in the correct branch/database.
- For more help, see the project changelog or contact the maintainer. 

## Product ID Format
- Product IDs are now strings in the format YYMMDD01 (e.g., 24060101 for the first product created on June 1, 2024).
- The ID is unique, not editable, and used as the primary key for new products.
- Reference code is optional, editable, and not unique.

## Database Migration
- Run `migrations/003_change_product_id_to_string.sql` manually on your database to apply the new ID format.

## Recent Changes
- Switched product ID to date-based string format as the primary key.
- Reference code is now optional and editable.
- Product creation API updated to generate IDs automatically.
- **Product edit page now uses a multi-step sidebar stepper, allowing editing of all fields.**
- **Product detail pages use SEO-friendly URLs: `/tours/[title-of-product]-[id]`.**
- **PATCH handler added to `/api/products/[id]` for editing products.**
- **Reference code column type fixed to VARCHAR to support LIKE queries.**
- **Standardized use of lowercase `referencecode` across all components and API endpoints.**

### Troubleshooting
- **405 Method Not Allowed on PATCH:** Ensure your `/api/products/[id]` route exports a PATCH handler.
- **SQL error: operator does not exist: integer ~~ unknown:** Make sure your `referencecode` column is VARCHAR, not INTEGER. Run:
  ```sql
  ALTER TABLE "Product" ALTER COLUMN "referencecode" TYPE VARCHAR(50) USING "referencecode"::VARCHAR;
  ```

## Product ID Format
- Product IDs are now strings in the format YYMMDD01 (e.g., 24060101 for the first product created on June 1, 2024).
- The ID is unique, not editable, and used as the primary key for new products.
- Reference code is optional, editable, and not unique.
- All references to reference code in the codebase use lowercase `referencecode` for consistency.

## Database Migration
- Run `migrations/003_change_product_id_to_string.sql` manually on your database to apply the new ID format. 

## Product Detail Page Redesign

The public product detail page (`app/tours/[slug]/page.tsx`) has been redesigned to match the modern GetYourGuide style:

- **Hero section** with a large main image and vertical photo gallery
- **Sticky sidebar** with price, date/participant selector, and prominent booking button
- **Info cards** for highlights, description, includes/excludes, meeting point, important info, and not available for
- **Modern icons** and improved typography
- **Responsive layout** for mobile and desktop
- **Placeholders** for itinerary/map and related products

To customize the layout or add new features, edit `app/tours/[slug]/page.tsx` and adjust the Tailwind CSS classes as needed. 