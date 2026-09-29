-- Migration: Add new fields to tenders table and create suppliers table
-- Date: 2026-09-28

-- Step 1: Add new columns to tenders table
ALTER TABLE tenders 
ADD COLUMN imageUrl VARCHAR(500) NULL,
ADD COLUMN slug VARCHAR(255) NULL UNIQUE,
ADD COLUMN metaDescription TEXT NULL,
ADD COLUMN metaKeywords VARCHAR(500) NULL,
ADD COLUMN isFeatured BOOLEAN DEFAULT FALSE;

-- Step 2: Create index on slug for performance
CREATE INDEX idx_tenders_slug ON tenders(slug);

-- Step 3: Create suppliers table
CREATE TABLE suppliers (
  id VARCHAR(36) PRIMARY KEY,
  companyName VARCHAR(255) NOT NULL,
  contactName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NULL,
  website VARCHAR(500) NULL,
  category ENUM('construction', 'fournitures', 'services', 'transport', 'consulting', 'autre') DEFAULT 'autre',
  specialties TEXT NULL,
  taxId VARCHAR(100) NULL,
  registrationNumber VARCHAR(100) NULL,
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT NULL,
  tenderId VARCHAR(36) NULL,
  manualEntry BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenderId) REFERENCES tenders(id) ON DELETE SET NULL,
  INDEX idx_suppliers_category (category),
  INDEX idx_suppliers_status (status),
  INDEX idx_suppliers_tenderId (tenderId)
);

-- Step 4: Generate slugs for existing tenders (optional - can be done manually via admin)
-- This will be handled by the admin interface when generating slugs
