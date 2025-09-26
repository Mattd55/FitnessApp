-- Create user progress table
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    workout_id BIGINT REFERENCES workouts(id) ON DELETE SET NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'MAX_WEIGHT', 'MAX_REPS', 'BEST_TIME', 'VOLUME'
    metric_value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20), -- 'kg', 'lbs', 'seconds', 'minutes', 'reps'
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_exercise_id ON user_progress(exercise_id);
CREATE INDEX idx_user_progress_workout_id ON user_progress(workout_id);
CREATE INDEX idx_user_progress_metric_type ON user_progress(metric_type);
CREATE INDEX idx_user_progress_recorded_at ON user_progress(recorded_at);

-- Create composite index for user exercise progress tracking
CREATE INDEX idx_user_progress_user_exercise ON user_progress(user_id, exercise_id, recorded_at DESC);