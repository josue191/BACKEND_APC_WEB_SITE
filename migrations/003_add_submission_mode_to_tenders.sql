-- Migration: Add submissionMode column to tenders table
-- Date: 2026-10-04

-- Add submissionMode column to tenders table
ALTER TABLE tenders
ADD COLUMN submissionMode VARCHAR(20) DEFAULT 'standard';

-- Add check constraint to ensure only valid values
ALTER TABLE tenders
ADD CONSTRAINT chk_submission_mode CHECK (submissionMode IN ('standard', 'single'));
