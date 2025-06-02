# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2024-03-19

### Added
- SEO-friendly URLs for product detail pages (`/tours/[title]-[id]`)
- View Details button in admin product list
- Improved product list UI with status indicators
- Enhanced error handling for product operations

### Changed
- Updated product view links to use SEO-friendly format
- Improved button styling in admin interface
- Enhanced product list layout and responsiveness

### Fixed
- Product view links now correctly point to `/tours/` instead of `/product/`
- Improved error handling in product deletion
- Fixed status display in product list

## [1.1.0] - 2024-03-18

### Added
- Multi-step product creation form (15 steps)
- Product management (CRUD operations)
- Admin dashboard with product list
- Neon Postgres integration
- Modern UI with Tailwind CSS

### Changed
- Switched product ID to date-based string format (YYMMDD01)
- Made reference code optional and editable
- Updated product creation API to generate IDs automatically

### Fixed
- SQL compatibility for LIKE operator on referencecode
- Standardized lowercase referencecode across components
- Fixed product edit page with multi-step sidebar stepper

## [1.0.0] - 2024-03-17

### Added
- Initial release
- Basic product management
- Database integration
- Admin interface
- Product creation workflow

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

## [1.2.0] - 2024-06-02
- Home page product grid and dynamic product detail page with SEO-friendly URLs.
- Product options display on detail page.
- Admin product edit stepper form for editing all fields.
- Consistent use of lowercase `referencecode` in backend and frontend.
- SQL fixes for `LIKE` operator compatibility.
- PATCH handler for product updates by ID.
- Continuous GitHub updates and deployment troubleshooting.

## [Earlier]
- Initial project setup with Next.js, Neon Postgres, and admin dashboard.

## [Unreleased]
### Changed
- Product ID is now a string in the format YYMMDD01 (date-based, unique, not editable) and used as the primary key for new products.
- Reference code is now optional, editable, and not unique.
- Added migration to change the id column type in the Product table.
- Product creation API now generates the new ID format automatically. 
- All product database fields are now lowercase (e.g. shortdesc, fulldesc, meetingpoint, importantinfo) for SQL and code consistency.
- Product creation and edit APIs now properly parse and stringify JSON fields (highlights, locations, keywords, options).
- Product creation API now retries with the next counter if a duplicate product ID is detected, ensuring unique IDs even with concurrent creation.
- Fixed: `.slice is not a function` and other errors caused by type mismatches in product creation.
- Fixed: PATCH and POST handlers now use lowercase and correct field names everywhere.
- Improved: ChatGPT autofill in the new product form now fills all possible fields and steps, not just a subset.
- Fixed: Build errors related to const/let and import paths.
- General bugfixes and codebase cleanup for full lowercase SQL and robust product management.

### Added
- Redesigned public product detail page to match OTA style:
  - Hero section with large main image and vertical gallery
  - Sticky sidebar with price, date/participant selector, and booking button
  - Info cards for highlights, description, includes/excludes, meeting point, important info, and not available for
  - Modern icons, improved typography, and responsive layout
  - Placeholder for itinerary/map and related products 