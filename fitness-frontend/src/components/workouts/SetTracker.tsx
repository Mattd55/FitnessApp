import React, { useState, useEffect } from 'react';
import { workoutApi } from '../../services/api';
import { WorkoutExercise, ExerciseSet } from '../../types/api';

interface SetTrackerProps {
  workoutExercise: WorkoutExercise;
  onSetCompleted: (set: ExerciseSet) => void;
  onExerciseCompleted: () => void;
}

const SetTracker: React.FC<SetTrackerProps> = ({
  workoutExercise,
  onSetCompleted,
  onExerciseCompleted
}) => {
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSet, setCurrentSet] = useState<Partial<ExerciseSet>>({
    actualReps: workoutExercise.plannedReps,
    actualWeight: workoutExercise.plannedWeight,
    rpeScore: 5,
    notes: ''
  });
  const [restTimer, setRestTimer] = useState<number>(0);
  const [isResting, setIsResting] = useState(false);

  const loadSets = async () => {
    try {
      setLoading(true);
      const exerciseSets = await workoutApi.getExerciseSets(workoutExercise.id);
      setSets(exerciseSets);
    } catch (err) {
      console.error('Error loading sets:', err);
      setError('Failed to load sets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, [workoutExercise.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer]);

  const handleLogSet = async () => {
    try {
      setLoading(true);
      setError(null);

      const setData = {
        setNumber: sets.length + 1,
        actualReps: currentSet.actualReps,
        actualWeight: currentSet.actualWeight,
        rpeScore: currentSet.rpeScore,
        notes: currentSet.notes || undefined
      };

      const loggedSet = await workoutApi.logSet(workoutExercise.id, setData);
      setSets(prev => [...prev, loggedSet]);
      onSetCompleted(loggedSet);

      // Start rest timer if this isn't the last set
      if (sets.length + 1 < workoutExercise.plannedSets && workoutExercise.restTimeSeconds) {
        setRestTimer(workoutExercise.restTimeSeconds);
        setIsResting(true);
      }

      // Reset current set data for next set
      setCurrentSet({
        actualReps: workoutExercise.plannedReps,
        actualWeight: workoutExercise.plannedWeight,
        rpeScore: 5,
        notes: ''
      });

      // Check if all sets are completed
      if (sets.length + 1 >= workoutExercise.plannedSets) {
        onExerciseCompleted();
      }
    } catch (err: any) {
      console.error('Error logging set:', err);
      setError(err.response?.data?.message || 'Failed to log set');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSet = async (setId: number) => {
    try {
      setLoading(true);
      const completedSet = await workoutApi.completeSet(setId);
      setSets(prev => prev.map(set =>
        set.id === setId ? completedSet : set
      ));
    } catch (err: any) {
      console.error('Error completing set:', err);
      setError(err.response?.data?.message || 'Failed to complete set');
    } finally {
      setLoading(false);
    }
  };

  const formatRestTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedSets = sets.filter(set => set.status === 'COMPLETED').length;
  const isExerciseComplete = completedSets >= workoutExercise.plannedSets;

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      marginBottom: '16px'
    }}>
      {/* Exercise Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
          {workoutExercise.exercise.name}
        </h3>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
          <span>Target: {workoutExercise.plannedSets} sets × {workoutExercise.plannedReps} reps</span>
          {workoutExercise.plannedWeight && (
            <span>@ {workoutExercise.plannedWeight}kg</span>
          )}
          <span>Progress: {completedSets}/{workoutExercise.plannedSets}</span>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
        }}>
          {error}
        </div>
      )}

      {/* Rest Timer */}
      {isResting && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          padding: '16px',
          borderRadius: '6px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#92400e' }}>
            Rest Time: {formatRestTime(restTimer)}
          </div>
          <button
            onClick={() => {
              setIsResting(false);
              setRestTimer(0);
            }}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Skip Rest
          </button>
        </div>
      )}

      {/* Completed Sets */}
      {sets.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            Completed Sets
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sets.map((set, index) => (
              <div
                key={set.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: set.status === 'COMPLETED' ? '#f0fdf4' : '#f9fafb',
                  border: '1px solid ' + (set.status === 'COMPLETED' ? '#bbf7d0' : '#e5e7eb'),
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ fontWeight: '600' }}>Set {set.setNumber}</span>
                  <span>{set.actualReps} reps</span>
                  {set.actualWeight && <span>{set.actualWeight}kg</span>}
                  {set.rpeScore && <span>RPE: {set.rpeScore}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: set.status === 'COMPLETED' ? '#dcfce7' : '#f3f4f6',
                    color: set.status === 'COMPLETED' ? '#166534' : '#374151',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '500'
                  }}>
                    {set.status.charAt(0) + set.status.slice(1).toLowerCase()}
                  </span>
                  {set.status === 'PENDING' && (
                    <button
                      onClick={() => handleCompleteSet(set.id)}
                      disabled={loading}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '10px',
                        opacity: loading ? 0.5 : 1
                      }}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Set Input */}
      {!isExerciseComplete && !isResting && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            Set {sets.length + 1}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                Reps
              </label>
              <input
                type="number"
                value={currentSet.actualReps || ''}
                onChange={(e) => setCurrentSet(prev => ({ ...prev, actualReps: parseInt(e.target.value) || 0 }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                min="0"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                value={currentSet.actualWeight || ''}
                onChange={(e) => setCurrentSet(prev => ({ ...prev, actualWeight: parseFloat(e.target.value) || 0 }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              RPE (Rate of Perceived Exertion) - {currentSet.rpeScore}/10
            </label>
            <input
              type="range"
              value={currentSet.rpeScore || 5}
              onChange={(e) => setCurrentSet(prev => ({ ...prev, rpeScore: parseInt(e.target.value) }))}
              min="1"
              max="10"
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af' }}>
              <span>Very Easy</span>
              <span>Moderate</span>
              <span>Very Hard</span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
              Notes (optional)
            </label>
            <textarea
              value={currentSet.notes || ''}
              onChange={(e) => setCurrentSet(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How did this set feel? Any observations..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
                minHeight: '60px'
              }}
            />
          </div>

          <button
            onClick={handleLogSet}
            disabled={loading || !currentSet.actualReps}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading || !currentSet.actualReps ? '#9ca3af' : '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !currentSet.actualReps ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Logging Set...' : `Log Set ${sets.length + 1}`}
          </button>
        </div>
      )}

      {/* Exercise Complete */}
      {isExerciseComplete && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
            Exercise Complete! 🎉
          </div>
          <div style={{ fontSize: '14px', color: '#16a34a' }}>
            You completed all {workoutExercise.plannedSets} sets
          </div>
        </div>
      )}
    </div>
  );
};

export default SetTracker;