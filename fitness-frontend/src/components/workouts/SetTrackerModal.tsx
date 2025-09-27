import React, { useState, useEffect } from 'react';
import { workoutApi } from '../../services/api';
import { WorkoutExercise, ExerciseSet } from '../../types/api';

interface SetTrackerModalProps {
  workoutExercise: WorkoutExercise;
  onSetCompleted: (set: ExerciseSet) => void;
  onExerciseCompleted: () => void;
  onClose: () => void;
}

const SetTrackerModal: React.FC<SetTrackerModalProps> = ({
  workoutExercise,
  onSetCompleted,
  onExerciseCompleted,
  onClose
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
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleLogSet = async () => {
    // Prevent logging more sets than planned
    if (sets.length >= workoutExercise.plannedSets) {
      setError('Cannot log more sets than planned for this exercise');
      return;
    }

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

      // Auto-close when all sets are logged (but exercise isn't complete until sets are marked as completed)
      if (sets.length + 1 >= workoutExercise.plannedSets) {
        // Don't auto-complete exercise here - user still needs to mark sets as complete
        // onClose(); // Keep modal open so user can complete the sets
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
      setSets(prev => {
        const updatedSets = prev.map(set =>
          set.id === setId ? completedSet : set
        );

        // Check if this was the last set needed to complete the exercise
        const completedSetsCount = updatedSets.filter(set => set.status === 'COMPLETED').length;
        if (completedSetsCount >= workoutExercise.plannedSets) {
          // Exercise should be auto-completed by backend, notify parent component immediately
          setExerciseCompleted(true);
          onExerciseCompleted();
          // Close modal after a brief moment to let users see the completion message
          setTimeout(() => {
            onClose();
          }, 1500);
        }

        return updatedSets;
      });
    } catch (err: any) {
      console.error('Error completing set:', err);
      setError(err.response?.data?.message || 'Failed to complete set');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatRestTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedSets = sets.filter(set => set.status === 'COMPLETED').length;
  const isExerciseComplete = exerciseCompleted || completedSets >= workoutExercise.plannedSets;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000, // Higher than WorkoutDetailModal
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700', color: '#111827' }}>
              {workoutExercise.exercise.name}
            </h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
              <span>Target: {workoutExercise.plannedSets} sets × {workoutExercise.plannedReps} reps</span>
              {workoutExercise.plannedWeight && (
                <span>@ {workoutExercise.plannedWeight}kg</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Progress: {completedSets}/{workoutExercise.plannedSets} sets
              </span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {Math.round((completedSets / workoutExercise.plannedSets) * 100)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(completedSets / workoutExercise.plannedSets) * 100}%`,
                height: '100%',
                backgroundColor: '#10b981',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Rest Timer */}
          {isResting && (
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fcd34d',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#d97706', marginBottom: '8px' }}>
                {formatRestTime(restTimer)}
              </div>
              <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}>
                Rest time remaining
              </div>
              <button
                onClick={() => {
                  setIsResting(false);
                  setRestTimer(0);
                }}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Skip Rest
              </button>
            </div>
          )}

          {/* Completed Sets */}
          {sets.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                Completed Sets
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sets.map((set) => (
                  <div
                    key={set.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: set.status === 'COMPLETED' ? '#f0fdf4' : '#f9fafb',
                      border: '1px solid ' + (set.status === 'COMPLETED' ? '#bbf7d0' : '#e5e7eb'),
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{
                        fontWeight: '700',
                        color: '#374151',
                        minWidth: '40px'
                      }}>
                        Set {set.setNumber}
                      </span>
                      <span style={{ color: '#6b7280' }}>{set.actualReps} reps</span>
                      {set.actualWeight && <span style={{ color: '#6b7280' }}>{set.actualWeight}kg</span>}
                      {set.rpeScore && (
                        <span style={{
                          color: '#6b7280',
                          fontSize: '12px',
                          padding: '2px 6px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '4px'
                        }}>
                          RPE {set.rpeScore}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        backgroundColor: set.status === 'COMPLETED' ? '#dcfce7' : '#f3f4f6',
                        color: set.status === 'COMPLETED' ? '#166534' : '#374151',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {set.status === 'COMPLETED' ? '✓' : '○'}
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
                            fontSize: '11px',
                            fontWeight: '500',
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
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                Log Set {sets.length + 1}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Reps
                  </label>
                  <input
                    type="number"
                    value={currentSet.actualReps || ''}
                    onChange={(e) => setCurrentSet(prev => ({ ...prev, actualReps: parseInt(e.target.value) || 0 }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    min="0"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={currentSet.actualWeight || ''}
                    onChange={(e) => setCurrentSet(prev => ({ ...prev, actualWeight: parseFloat(e.target.value) || 0 }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  RPE (Rate of Perceived Exertion) - {currentSet.rpeScore}/10
                </label>
                <input
                  type="range"
                  value={currentSet.rpeScore || 5}
                  onChange={(e) => setCurrentSet(prev => ({ ...prev, rpeScore: parseInt(e.target.value) }))}
                  min="1"
                  max="10"
                  style={{
                    width: '100%',
                    height: '6px',
                    marginBottom: '8px'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280' }}>
                  <span>Very Easy</span>
                  <span>Moderate</span>
                  <span>Very Hard</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Notes (optional)
                </label>
                <textarea
                  value={currentSet.notes || ''}
                  onChange={(e) => setCurrentSet(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How did this set feel? Any observations..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
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
                  padding: '14px',
                  backgroundColor: loading || !currentSet.actualReps ? '#9ca3af' : '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading || !currentSet.actualReps ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Logging Set...' : `Log Set ${sets.length + 1}`}
              </button>
            </div>
          )}

          {/* Exercise Complete */}
          {isExerciseComplete && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>
                Exercise Complete! 🎉
              </div>
              <div style={{ fontSize: '14px', color: '#16a34a', marginBottom: '16px' }}>
                You completed all {workoutExercise.plannedSets} sets
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Continue Workout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetTrackerModal;