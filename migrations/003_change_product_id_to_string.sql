-- Change id column from UUID to VARCHAR and make it the primary key
ALTER TABLE "Product"
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE VARCHAR(20) USING id::text; 