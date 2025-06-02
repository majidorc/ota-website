# OTA Website

A modern travel experiences marketplace inspired by GetYourGuide, built with Next.js, Neon Postgres, and Tailwind CSS.

## Features
- Customer dashboard: view, edit, and manage bookings, edit profile
- Supplier dashboard: manage products, view bookings, add new products
- Admin dashboard: manage suppliers, approve/reject/edit/delete products
- Modern responsive UI with Tailwind CSS
- SEO-friendly URLs for product and tour pages
- Reusable header with SVG icons and quick actions
- Robust API for products, bookings, and activities

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/majidorc/ota-website.git
   cd ota-website
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your database and API keys.
4. **Run the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```
5. **Visit the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/` — Next.js app directory (pages, layouts, API routes)
- `app/customer/` — Customer dashboard and profile
- `app/supplier/` — Supplier dashboard and product management
- `app/admin/` — Admin dashboard for managing suppliers and products
- `app/components/` — Shared React components (Navbar, forms, etc.)
- `app/api/` — API routes for products, bookings, activities

## Recent Updates
- Customer dashboard and profile edit page
- Supplier dashboard with real product count
- Admin dashboard for supplier/product management
- Header refactored with reusable button component and SVG icons
- Bookings API improved for demo/testing
- All branding updated to "OTA"

## License
MIT 

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of all major changes. 