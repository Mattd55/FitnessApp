-- Create exercises table
CREATE TABLE exercises (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    equipment VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id)
);

-- Create exercise muscle groups tables
CREATE TABLE exercise_muscle_groups (
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    primary_muscles VARCHAR(50) NOT NULL,
    PRIMARY KEY (exercise_id, primary_muscles)
);

CREATE TABLE exercise_secondary_muscles (
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    secondary_muscles VARCHAR(50) NOT NULL,
    PRIMARY KEY (exercise_id, secondary_muscles)
);

-- Create indexes for performance
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_equipment ON exercises(equipment);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_active ON exercises(is_active);
CREATE INDEX idx_exercises_created_by ON exercises(created_by);