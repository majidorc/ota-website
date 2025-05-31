# Changelog

## [1.0.0] - 2024-05-31
- First stable release with all admin features and product management.
- Refactor: Removed duplicate New Product forms. Only the form accessible via Admin → Create → New Product remains.
- Feature: 15-step multi-step product creation flow with sidebar navigation.
- Fix: Product creation now saves all fields to the database.
- Chore: Updated migrations for full product schema.
- Chore: Updated README for new setup and workflow.
- Added: New Product form now appears in the main content area of `/admin`, replacing the product list until closed or submitted, without changing the route.
- Docs: Added troubleshooting section to README for Neon/Postgres connection and table existence.

## [1.1.0] - 2024-06-01
- Product edit page now uses a multi-step sidebar stepper, allowing editing of all fields.
- Product detail pages use SEO-friendly URLs: `/tours/[title-of-product]-[id]`.
- PATCH handler added to `/api/products/[id]` for editing products.
- Fixed: referencecode column type is now VARCHAR to support LIKE queries.
- Standardized: All references to reference code now use lowercase `referencecode` for consistency across components and API endpoints.

## [Earlier]
- Initial project setup with Next.js, Neon Postgres, and admin dashboard.

## [Unreleased]
### Changed
- Product ID is now a string in the format YYMMDD01 (date-based, unique, not editable) and used as the primary key for new products.
- Reference code is now optional, editable, and not unique.
- Added migration to change the id column type in the Product table.
- Product creation API now generates the new ID format automatically. 