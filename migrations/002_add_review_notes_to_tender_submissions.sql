-- Migration: Add reviewNotes column to tender_submissions table
-- Date: 2026-09-29

-- Add reviewNotes column to tender_submissions table
ALTER TABLE tender_submissions 
ADD COLUMN reviewNotes TEXT NULL;

-- Add status column if it doesn't exist
ALTER TABLE tender_submissions 
ADD COLUMN status ENUM('pending', 'reviewing', 'accepted', 'rejected') DEFAULT 'pending';
