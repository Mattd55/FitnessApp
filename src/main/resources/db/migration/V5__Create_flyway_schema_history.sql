-- Create Flyway schema history table if it doesn't exist
-- This migration ensures we have proper Flyway tracking

-- Insert initial data if needed (this will be handled by data seeding service)

-- Add any additional constraints or triggers
ALTER TABLE users ADD CONSTRAINT chk_users_role
    CHECK (role IN ('USER', 'TRAINER', 'ADMIN'));

ALTER TABLE exercises ADD CONSTRAINT chk_exercises_category
    CHECK (category IN ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE', 'SPORTS'));

ALTER TABLE exercises ADD CONSTRAINT chk_exercises_equipment
    CHECK (equipment IN ('NONE', 'DUMBBELL', 'BARBELL', 'MACHINE', 'CABLES', 'RESISTANCE_BAND', 'KETTLEBELL', 'BODYWEIGHT'));

ALTER TABLE exercises ADD CONSTRAINT chk_exercises_difficulty
    CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'));

ALTER TABLE workouts ADD CONSTRAINT chk_workouts_status
    CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'SKIPPED'));

-- Ensure workout completion logic
ALTER TABLE workouts ADD CONSTRAINT chk_workouts_completion
    CHECK ((status = 'COMPLETED' AND completed_at IS NOT NULL) OR status != 'COMPLETED');