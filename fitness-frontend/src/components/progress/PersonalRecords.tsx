import React from 'react';
import { Workout, WorkoutExercise, ExerciseSet } from '../../types/api';

interface PersonalRecordsProps {
  workouts: Workout[];
  workoutExercises: { [workoutId: number]: WorkoutExercise[] };
  exerciseSets: { [workoutExerciseId: number]: ExerciseSet[] };
}

interface PersonalRecord {
  exerciseId: number;
  exerciseName: string;
  category: string;
  maxWeight: {
    weight: number;
    reps: number;
    date: Date;
    workoutName: string;
  } | null;
  maxReps: {
    reps: number;
    weight: number;
    date: Date;
    workoutName: string;
  } | null;
  maxVolume: {
    volume: number;
    date: Date;
    workoutName: string;
  } | null;
  oneRepMax: {
    estimatedMax: number;
    weight: number;
    reps: number;
    date: Date;
    workoutName: string;
  } | null;
}

const PersonalRecords: React.FC<PersonalRecordsProps> = ({
  workouts,
  workoutExercises,
  exerciseSets
}) => {
  // Calculate estimated 1RM using Epley formula: weight × (1 + reps/30)
  const calculateOneRepMax = (weight: number, reps: number): number => {
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
  };

  // Calculate personal records for all exercises
  const calculatePersonalRecords = (): PersonalRecord[] => {
    const recordsMap = new Map<number, PersonalRecord>();

    // Filter completed workouts
    const completedWorkouts = workouts.filter(w => w.status === 'COMPLETED' && w.completedAt);

    completedWorkouts.forEach(workout => {
      const exercises = workoutExercises[workout.id] || [];

      exercises.forEach(workoutExercise => {
        const sets = exerciseSets[workoutExercise.id] || [];
        const completedSets = sets.filter(set => set.status === 'COMPLETED' && set.actualWeight && set.actualReps);

        if (completedSets.length === 0) return;

        const exerciseId = workoutExercise.exercise.id;
        const exerciseName = workoutExercise.exercise.name;
        const category = workoutExercise.exercise.category;
        const workoutDate = new Date(workout.completedAt!);

        // Initialize record if doesn't exist
        if (!recordsMap.has(exerciseId)) {
          recordsMap.set(exerciseId, {
            exerciseId,
            exerciseName,
            category,
            maxWeight: null,
            maxReps: null,
            maxVolume: null,
            oneRepMax: null
          });
        }

        const record = recordsMap.get(exerciseId)!;

        // Calculate total volume for this session
        const sessionVolume = completedSets.reduce((total, set) => {
          return total + (set.actualWeight! * set.actualReps!);
        }, 0);

        // Check for new records
        completedSets.forEach(set => {
          const weight = set.actualWeight!;
          const reps = set.actualReps!;
          const estimatedMax = calculateOneRepMax(weight, reps);

          // Max weight record
          if (!record.maxWeight || weight > record.maxWeight.weight) {
            record.maxWeight = {
              weight,
              reps,
              date: workoutDate,
              workoutName: workout.name
            };
          }

          // Max reps record (for same or higher weight)
          if (!record.maxReps ||
              reps > record.maxReps.reps ||
              (reps === record.maxReps.reps && weight > record.maxReps.weight)) {
            record.maxReps = {
              reps,
              weight,
              date: workoutDate,
              workoutName: workout.name
            };
          }

          // One rep max record
          if (!record.oneRepMax || estimatedMax > record.oneRepMax.estimatedMax) {
            record.oneRepMax = {
              estimatedMax,
              weight,
              reps,
              date: workoutDate,
              workoutName: workout.name
            };
          }
        });

        // Max volume record
        if (!record.maxVolume || sessionVolume > record.maxVolume.volume) {
          record.maxVolume = {
            volume: sessionVolume,
            date: workoutDate,
            workoutName: workout.name
          };
        }
      });
    });

    return Array.from(recordsMap.values()).sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));
  };

  const personalRecords = calculatePersonalRecords();

  // Filter records that have at least one record set
  const recordsWithData = personalRecords.filter(record =>
    record.maxWeight || record.maxReps || record.maxVolume || record.oneRepMax
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'strength': return '💪';
      case 'cardio': return '🏃';
      case 'flexibility': return '🤸';
      case 'powerlifting': return '🏋️';
      case 'bodybuilding': return '💪';
      case 'olympic': return '🥇';
      default: return '🏃';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'strength': return '#ef4444';
      case 'cardio': return '#10b981';
      case 'flexibility': return '#8b5cf6';
      case 'powerlifting': return '#f59e0b';
      case 'bodybuilding': return '#3b82f6';
      case 'olympic': return '#f97316';
      default: return '#6b7280';
    }
  };

  if (recordsWithData.length === 0) {
    return (
      <div className="flex-col-center py-12 fade-in">
        <p className="text-body-sm text-light text-center">
          Complete some workouts with weights and reps to see your personal records!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-lg)' }}>
          <div className="text-h1 text-white mb-1">
            {recordsWithData.length}
          </div>
          <div className="text-caption text-light">Exercises Tracked</div>
        </div>

        <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-lg)' }}>
          <div className="text-h1 text-white mb-1">
            {recordsWithData.filter(r => r.oneRepMax).length}
          </div>
          <div className="text-caption text-light">1RM Records</div>
        </div>

        <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-lg)' }}>
          <div className="text-h1 text-white mb-1">
            {Math.max(...recordsWithData.map(r => r.oneRepMax?.estimatedMax || 0)).toFixed(0)}
          </div>
          <div className="text-caption text-light">Highest 1RM (kg)</div>
        </div>
      </div>

      {/* Records by Category */}
      <div className="space-y-4">
        {Array.from(new Set(recordsWithData.map(r => r.category))).map(category => {
          const categoryRecords = recordsWithData.filter(r => r.category === category);

          return (
            <div key={category} className="card" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
              {/* Category Header */}
              <div className="mb-4">
                <h4 className="text-h4 text-white" style={{ textTransform: 'capitalize' }}>
                  {category} ({categoryRecords.length})
                </h4>
              </div>

              {/* Records List */}
              <div className="space-y-4">
                {categoryRecords.map((record) => (
                  <div
                    key={record.exerciseId}
                    className="card card-compact"
                    style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}
                  >
                    <h5 className="text-body-lg font-semibold text-white mb-3">
                      {record.exerciseName}
                    </h5>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 'var(--space-md)'
                    }}>
                      {/* Max Weight */}
                      {record.maxWeight && (
                        <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                          <div className="text-caption text-light mb-1">
                            Max Weight
                          </div>
                          <div className="text-h3 text-white mb-1">
                            {record.maxWeight.weight}kg × {record.maxWeight.reps}
                          </div>
                          <div className="text-caption text-light">
                            {formatDate(record.maxWeight.date)}
                          </div>
                        </div>
                      )}

                      {/* Max Reps */}
                      {record.maxReps && (
                        <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                          <div className="text-caption text-light mb-1">
                            Max Reps
                          </div>
                          <div className="text-h3 text-white mb-1">
                            {record.maxReps.reps} reps @ {record.maxReps.weight}kg
                          </div>
                          <div className="text-caption text-light">
                            {formatDate(record.maxReps.date)}
                          </div>
                        </div>
                      )}

                      {/* One Rep Max */}
                      {record.oneRepMax && (
                        <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                          <div className="text-caption text-light mb-1">
                            Estimated 1RM
                          </div>
                          <div className="text-h3 text-white mb-1">
                            {record.oneRepMax.estimatedMax.toFixed(1)}kg
                          </div>
                          <div className="text-caption text-light">
                            From {record.oneRepMax.weight}kg × {record.oneRepMax.reps}
                          </div>
                        </div>
                      )}

                      {/* Max Volume */}
                      {record.maxVolume && (
                        <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                          <div className="text-caption text-light mb-1">
                            Max Session Volume
                          </div>
                          <div className="text-h3 text-white mb-1">
                            {record.maxVolume.volume.toFixed(0)}kg
                          </div>
                          <div className="text-caption text-light">
                            {formatDate(record.maxVolume.date)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalRecords;