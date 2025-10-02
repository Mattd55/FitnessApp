import React, { useState, useEffect } from 'react';
import { userApi, workoutApi } from '../services/api';
import { UserProgress, Workout, WorkoutExercise, ExerciseSet } from '../types/api';
import AddProgressModal from '../components/progress/AddProgressModal';
import ProgressCharts from '../components/progress/ProgressCharts';
import ProgressSummary from '../components/progress/ProgressSummary';
import ProgressHistory from '../components/progress/ProgressHistory';
import WorkoutAnalytics from '../components/progress/WorkoutAnalytics';
import PersonalRecords from '../components/progress/PersonalRecords';
import { Plus, TrendingUp, Target, Calculator, BarChart3, Award } from 'lucide-react';

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
          <p style={{ color: 'var(--color-text-light)' }}>Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        {/* Header Card */}
        <div className="card card-elevated hover-lift">
          <div className="header-section-horizontal">
            <div className="flex-1">
              <h1 className="text-h1 text-primary">
                Progress Tracking
              </h1>
              <p className="text-body-lg text-secondary">
                Track your fitness journey with detailed measurements and analytics
              </p>
              <div className="flex items-center justify-center gap-md mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary hover-glow"
                  style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Progress Entry
                </button>
                <div className="flex items-center gap-xl">
                  <span className="text-body font-medium text-light">
                    {progressHistory.length} Entries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="card border-l-4 border-error bg-red-50">
            <p className="text-error font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid-2 stagger-in">
          {/* Progress Summary */}
          <ProgressSummary latestProgress={latestProgress} />

          {/* Quick Stats Card */}
          <div className="card hover-lift">
            <div className="header-section">
              <h3 className="text-h3 text-white">
                Quick Stats
              </h3>
            </div>
            {latestProgress ? (
              <div className="grid grid-cols-2 gap-md">
                {latestProgress.weightKg && (
                  <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-xl) var(--space-lg)' }}>
                    <div className="text-caption text-light">
                      BMI
                    </div>
                    <div className="text-h2 text-white">
                      {latestProgress.heightCm && latestProgress.weightKg ?
                        (latestProgress.weightKg / Math.pow(latestProgress.heightCm / 100, 2)).toFixed(1) : 'N/A'}
                    </div>
                  </div>
                )}
                {latestProgress.bodyFatPercentage && (
                  <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-xl) var(--space-lg)' }}>
                    <div className="text-caption text-light">
                      Body Fat
                    </div>
                    <div className="text-h2 text-white">
                      {latestProgress.bodyFatPercentage}%
                    </div>
                  </div>
                )}
                {latestProgress.waistCm && latestProgress.hipCm && (
                  <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-xl) var(--space-lg)' }}>
                    <div className="text-caption text-light">
                      W/H Ratio
                    </div>
                    <div className="text-h2 text-white">
                      {(latestProgress.waistCm / latestProgress.hipCm).toFixed(2)}
                    </div>
                  </div>
                )}
                <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-xl) var(--space-lg)' }}>
                  <div className="text-caption text-light">
                    Entries
                  </div>
                  <div className="text-h2 text-white">
                    {progressHistory.length}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-col-center py-8 fade-in">
                <div className="bg-primary p-3 rounded-xl w-12 h-12 mb-3 flex-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <p className="text-body text-secondary">
                  No progress data yet. Add your first entry to get started!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {progressHistory.length > 0 && (
          <div className="card slide-in-right">
            <div className="header-section">
              <h3 className="text-h3 text-white">
                Progress Charts
              </h3>
            </div>
            <ProgressCharts progressHistory={progressHistory} />
          </div>
        )}

        {/* Workout Analytics */}
        <div className="card slide-in-left">
          <div className="header-section">
            <h3 className="text-h3 text-white">
              Workout Analytics
            </h3>
          </div>
          <WorkoutAnalytics
            workouts={workouts}
            workoutExercises={workoutExercises}
            exerciseSets={exerciseSets}
          />
        </div>

        {/* Personal Records */}
        <div className="card slide-in-right">
          <div className="header-section">
            <h3 className="text-h3 text-white">
              Personal Records
            </h3>
          </div>
          <PersonalRecords
            workouts={workouts}
            workoutExercises={workoutExercises}
            exerciseSets={exerciseSets}
          />
        </div>

        {/* Progress History */}
        <div className="card slide-in-left">
          <div className="header-section">
            <h3 className="text-h3 text-white">
              Progress History
            </h3>
          </div>
          <ProgressHistory progressHistory={progressHistory} />
        </div>

        {/* Add Progress Modal */}
        {showAddModal && (
          <AddProgressModal
            onClose={() => setShowAddModal(false)}
            onProgressAdded={handleProgressAdded}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressPage;