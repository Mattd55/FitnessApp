import React, { useState, useEffect } from 'react';
import { userApi, workoutApi } from '../services/api';
import { UserProgress, Workout, WorkoutExercise, ExerciseSet } from '../types/api';
import AddProgressModal from '../components/progress/AddProgressModal';
import ProgressCharts from '../components/progress/ProgressCharts';
import ProgressSummary from '../components/progress/ProgressSummary';
import ProgressHistory from '../components/progress/ProgressHistory';
import WorkoutAnalytics from '../components/progress/WorkoutAnalytics';
import PersonalRecords from '../components/progress/PersonalRecords';

const ProgressPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestProgress, setLatestProgress] = useState<UserProgress | null>(null);
  const [progressHistory, setProgressHistory] = useState<UserProgress[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Workout analytics state
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<{ [workoutId: number]: WorkoutExercise[] }>({});
  const [exerciseSets, setExerciseSets] = useState<{ [workoutExerciseId: number]: ExerciseSet[] }>({});

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load latest progress and history in parallel
      const [latest, history, workoutsResponse] = await Promise.all([
        userApi.getLatestProgress().catch(() => null), // Don't fail if no progress exists
        userApi.getProgress(0, 50), // Get recent 50 entries
        workoutApi.getWorkouts(0, 100).catch(() => ({ content: [] })) // Get recent 100 workouts for analytics
      ]);

      setLatestProgress(latest);
      setProgressHistory(history.content);
      setWorkouts(workoutsResponse.content);

      // Load workout exercises and sets for analytics
      const workoutExercisesMap: { [workoutId: number]: WorkoutExercise[] } = {};
      const exerciseSetsMap: { [workoutExerciseId: number]: ExerciseSet[] } = {};

      // Load exercises for completed workouts
      const completedWorkouts = workoutsResponse.content.filter(w => w.status === 'COMPLETED');

      for (const workout of completedWorkouts) {
        try {
          const exercises = await workoutApi.getWorkoutExercises(workout.id);
          workoutExercisesMap[workout.id] = exercises;

          // Load sets for each exercise
          for (const exercise of exercises) {
            try {
              const sets = await workoutApi.getExerciseSets(exercise.id);
              exerciseSetsMap[exercise.id] = sets;
            } catch (setsErr) {
              console.warn(`Failed to load sets for exercise ${exercise.id}:`, setsErr);
              exerciseSetsMap[exercise.id] = [];
            }
          }
        } catch (exercisesErr) {
          console.warn(`Failed to load exercises for workout ${workout.id}:`, exercisesErr);
          workoutExercisesMap[workout.id] = [];
        }
      }

      setWorkoutExercises(workoutExercisesMap);
      setExerciseSets(exerciseSetsMap);
    } catch (err: any) {
      console.error('Error loading progress data:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const handleProgressAdded = (newProgress: UserProgress) => {
    setLatestProgress(newProgress);
    setProgressHistory(prev => [newProgress, ...prev]);
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div>Loading progress data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
            Progress Tracking
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
            Track your fitness journey with detailed measurements and analytics
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          Add Progress Entry
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Progress Summary */}
        <ProgressSummary latestProgress={latestProgress} />

        {/* Quick Stats */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
            Quick Stats
          </h3>
          {latestProgress ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {latestProgress.weightKg && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>BMI</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {latestProgress.heightCm && latestProgress.weightKg ?
                      (latestProgress.weightKg / Math.pow(latestProgress.heightCm / 100, 2)).toFixed(1) : 'N/A'}
                  </div>
                </div>
              )}
              {latestProgress.bodyFatPercentage && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Body Fat</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {latestProgress.bodyFatPercentage}%
                  </div>
                </div>
              )}
              {latestProgress.waistCm && latestProgress.hipCm && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Waist/Hip Ratio</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {(latestProgress.waistCm / latestProgress.hipCm).toFixed(2)}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Entries</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {progressHistory.length}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
              No progress data yet. Add your first entry to get started!
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      {progressHistory.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <ProgressCharts progressHistory={progressHistory} />
        </div>
      )}

      {/* Workout Analytics */}
      <div style={{ marginBottom: '32px' }}>
        <WorkoutAnalytics
          workouts={workouts}
          workoutExercises={workoutExercises}
          exerciseSets={exerciseSets}
        />
      </div>

      {/* Personal Records */}
      <div style={{ marginBottom: '32px' }}>
        <PersonalRecords
          workouts={workouts}
          workoutExercises={workoutExercises}
          exerciseSets={exerciseSets}
        />
      </div>

      {/* Progress History */}
      <ProgressHistory progressHistory={progressHistory} />

      {/* Add Progress Modal */}
      {showAddModal && (
        <AddProgressModal
          onClose={() => setShowAddModal(false)}
          onProgressAdded={handleProgressAdded}
        />
      )}
    </div>
  );
};

export default ProgressPage;