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
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: '#6b7280',
        fontStyle: 'italic'
      }}>
        Complete some workouts with weights and reps to see your personal records!
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
        Personal Records
      </h3>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
            {recordsWithData.length}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Exercises Tracked</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
            {recordsWithData.filter(r => r.oneRepMax).length}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>1RM Records</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
            {Math.max(...recordsWithData.map(r => r.oneRepMax?.estimatedMax || 0)).toFixed(0)}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Highest 1RM (kg)</div>
        </div>
      </div>

      {/* Records by Category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {Array.from(new Set(recordsWithData.map(r => r.category))).map(category => {
          const categoryRecords = recordsWithData.filter(r => r.category === category);

          return (
            <div key={category} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              {/* Category Header */}
              <div style={{
                padding: '20px',
                backgroundColor: getCategoryColor(category),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>{getCategoryIcon(category)}</span>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'capitalize' }}>
                  {category} ({categoryRecords.length})
                </h4>
              </div>

              {/* Records List */}
              <div style={{ padding: '0' }}>
                {categoryRecords.map((record, index) => (
                  <div
                    key={record.exerciseId}
                    style={{
                      padding: '20px',
                      borderBottom: index < categoryRecords.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    <h5 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {record.exerciseName}
                    </h5>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px'
                    }}>
                      {/* Max Weight */}
                      {record.maxWeight && (
                        <div style={{
                          padding: '12px',
                          backgroundColor: '#fef2f2',
                          borderRadius: '6px',
                          border: '1px solid #fecaca'
                        }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Max Weight
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', marginBottom: '2px' }}>
                            {record.maxWeight.weight}kg × {record.maxWeight.reps}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {formatDate(record.maxWeight.date)} • {record.maxWeight.workoutName}
                          </div>
                        </div>
                      )}

                      {/* Max Reps */}
                      {record.maxReps && (
                        <div style={{
                          padding: '12px',
                          backgroundColor: '#f0f9ff',
                          borderRadius: '6px',
                          border: '1px solid #bae6fd'
                        }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Max Reps
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0284c7', marginBottom: '2px' }}>
                            {record.maxReps.reps} reps @ {record.maxReps.weight}kg
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {formatDate(record.maxReps.date)} • {record.maxReps.workoutName}
                          </div>
                        </div>
                      )}

                      {/* One Rep Max */}
                      {record.oneRepMax && (
                        <div style={{
                          padding: '12px',
                          backgroundColor: '#f0fdf4',
                          borderRadius: '6px',
                          border: '1px solid #bbf7d0'
                        }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Estimated 1RM
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', marginBottom: '2px' }}>
                            {record.oneRepMax.estimatedMax.toFixed(1)}kg
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            From {record.oneRepMax.weight}kg × {record.oneRepMax.reps} • {formatDate(record.oneRepMax.date)}
                          </div>
                        </div>
                      )}

                      {/* Max Volume */}
                      {record.maxVolume && (
                        <div style={{
                          padding: '12px',
                          backgroundColor: '#fefce8',
                          borderRadius: '6px',
                          border: '1px solid #fde68a'
                        }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Max Session Volume
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ca8a04', marginBottom: '2px' }}>
                            {record.maxVolume.volume.toFixed(0)}kg
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {formatDate(record.maxVolume.date)} • {record.maxVolume.workoutName}
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