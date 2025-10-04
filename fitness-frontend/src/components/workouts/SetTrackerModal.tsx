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
        backgroundColor: 'var(--color-background-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000, // Higher than WorkoutDetailModal
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-card)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-lg)',
          borderBottom: '1.5px solid var(--color-border-medium)'
        }}>
          <div>
            <h3 className="text-h4 text-white" style={{ margin: '0 0 var(--space-xs) 0' }}>
              {workoutExercise.exercise.name}
            </h3>
            <div className="text-body-sm text-light" style={{ display: 'flex', gap: 'var(--space-md)' }}>
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
              color: 'var(--color-text-secondary)',
              padding: 'var(--space-xs)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-lg)' }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <span className="text-body font-semibold text-white">
                Progress: {completedSets}/{workoutExercise.plannedSets} sets
              </span>
              <span className="text-caption text-light">
                {Math.round((completedSets / workoutExercise.plannedSets) * 100)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(completedSets / workoutExercise.plannedSets) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--color-success)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {error && (
            <div className="card card-compact" style={{
              backgroundColor: 'var(--color-error-50)',
              border: '1.5px solid var(--color-error)',
              marginBottom: 'var(--space-md)'
            }}>
              <p className="text-body" style={{ color: 'var(--color-error)' }}>{error}</p>
            </div>
          )}

          {/* Rest Timer */}
          {isResting && (
            <div className="card card-compact" style={{
              backgroundColor: 'var(--color-warning-50)',
              border: '1.5px solid var(--color-warning)',
              marginBottom: 'var(--space-lg)',
              textAlign: 'center'
            }}>
              <div className="text-h2" style={{ color: 'var(--color-warning-dark)', marginBottom: 'var(--space-sm)' }}>
                {formatRestTime(restTimer)}
              </div>
              <div className="text-body" style={{ color: 'var(--color-warning-dark)', marginBottom: 'var(--space-sm)' }}>
                Rest time remaining
              </div>
              <button
                onClick={() => {
                  setIsResting(false);
                  setRestTimer(0);
                }}
                className="btn btn-ghost"
                style={{ minWidth: '120px' }}
              >
                Skip Rest
              </button>
            </div>
          )}

          {/* Completed Sets */}
          {sets.length > 0 && (
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h4 className="text-body-lg font-semibold text-primary" style={{ marginBottom: 'var(--space-md)' }}>
                Completed Sets
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {sets.map((set) => (
                  <div
                    key={set.id}
                    className="card card-compact"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: set.status === 'COMPLETED' ? 'var(--color-success-50)' : 'var(--color-background-elevated)',
                      border: '1.5px solid ' + (set.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-border-medium)')
                    }}
                  >
                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                      <span className={`font-bold ${set.status === 'COMPLETED' ? 'text-white' : 'text-primary'}`} style={{ minWidth: '40px' }}>
                        Set {set.setNumber}
                      </span>
                      <span className="text-body-sm text-secondary">{set.actualReps} reps</span>
                      {set.actualWeight && <span className="text-body-sm text-secondary">{set.actualWeight}kg</span>}
                      {set.rpeScore && (
                        <span className="text-caption" style={{
                          padding: '2px 6px',
                          backgroundColor: 'var(--color-border-light)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          RPE {set.rpeScore}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span style={{
                        padding: '3px 8px',
                        backgroundColor: set.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-border-light)',
                        color: set.status === 'COMPLETED' ? 'var(--color-text-white)' : 'var(--color-text-primary)',
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
                          className="btn btn-primary"
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            minWidth: '80px',
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
            <div className="card" style={{
              backgroundColor: 'var(--color-background-elevated)',
              border: '1.5px solid var(--color-border-medium)'
            }}>
              <h4 className="text-body-lg font-semibold" style={{ marginBottom: 'var(--space-md)', color: 'var(--color-text-primary)' }}>
                Log Set {sets.length + 1}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <label className="text-body-sm font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                    Reps
                  </label>
                  <input
                    type="number"
                    value={currentSet.actualReps || ''}
                    onChange={(e) => setCurrentSet(prev => ({ ...prev, actualReps: parseInt(e.target.value) || 0 }))}
                    className="w-full"
                    style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      border: '1.5px solid var(--color-border-medium)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '500',
                      color: 'var(--color-text-primary)'
                    }}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-body-sm font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={currentSet.actualWeight || ''}
                    onChange={(e) => setCurrentSet(prev => ({ ...prev, actualWeight: parseFloat(e.target.value) || 0 }))}
                    className="w-full"
                    style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      border: '1.5px solid var(--color-border-medium)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '500',
                      color: 'var(--color-text-primary)'
                    }}
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label className="text-body-sm font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
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
                    marginBottom: 'var(--space-sm)'
                  }}
                />
                <div className="text-caption" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Very Easy</span>
                  <span>Moderate</span>
                  <span>Very Hard</span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label className="text-body-sm font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                  Notes (optional)
                </label>
                <textarea
                  value={currentSet.notes || ''}
                  onChange={(e) => setCurrentSet(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How did this set feel? Any observations..."
                  className="w-full"
                  style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '1.5px solid var(--color-border-medium)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    resize: 'vertical',
                    minHeight: '60px',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>

              <button
                onClick={handleLogSet}
                disabled={loading || !currentSet.actualReps}
                className="btn btn-primary w-full"
              >
                {loading ? 'Logging Set...' : `Log Set ${sets.length + 1}`}
              </button>
            </div>
          )}

          {/* Exercise Complete */}
          {isExerciseComplete && (
            <div className="card" style={{
              backgroundColor: 'var(--color-success-50)',
              border: '1.5px solid var(--color-success)',
              textAlign: 'center'
            }}>
              <div className="text-h3" style={{ color: 'var(--color-success-dark)', marginBottom: 'var(--space-sm)' }}>
                Exercise Complete! 🎉
              </div>
              <div className="text-body" style={{ color: 'var(--color-success-dark)', marginBottom: 'var(--space-md)' }}>
                You completed all {workoutExercise.plannedSets} sets
              </div>
              <button
                onClick={onClose}
                className="btn btn-primary"
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