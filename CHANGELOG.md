# Changelog

## [1.0.0] - 2024-05-31
- First stable release with all admin features and product management.
- Refactor: Removed duplicate New Product forms. Only the form accessible via Admin → Create → New Product remains.
- Feature: 15-step multi-step product creation flow with sidebar navigation.
- Fix: Product creation now saves all fields to the database.
- Chore: Updated migrations for full product schema.
- Chore: Updated README for new setup and workflow.
- Added: New Product form now appears in the main content area of `/admin`, replacing the product list until closed or submitted, without changing the route.

## [Earlier]
- Initial project setup with Next.js, Neon Postgres, and admin dashboard. 