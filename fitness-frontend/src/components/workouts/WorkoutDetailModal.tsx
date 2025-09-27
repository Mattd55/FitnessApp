import React, { useState, useEffect } from 'react';
import { workoutApi } from '../../services/api';
import { Workout, WorkoutExercise, ExerciseSet } from '../../types/api';
import AddExerciseModal from './AddExerciseModal';
import SetTrackerModal from './SetTrackerModal';

interface WorkoutDetailModalProps {
  workout: Workout;
  onClose: () => void;
  onWorkoutUpdated: (workout: Workout) => void;
  onWorkoutDeleted: (workoutId: number) => void;
}

const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  workout,
  onClose,
  onWorkoutUpdated,
  onWorkoutDeleted
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);
  const [showSetTrackerModal, setShowSetTrackerModal] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<WorkoutExercise>>({});

  const loadWorkoutExercises = async () => {
    try {
      setExercisesLoading(true);
      const workoutExercises = await workoutApi.getWorkoutExercises(workout.id);
      setExercises(workoutExercises);
    } catch (err) {
      console.error('Error loading workout exercises:', err);
      setError('Failed to load workout exercises');
    } finally {
      setExercisesLoading(false);
    }
  };

  useEffect(() => {
    loadWorkoutExercises();
  }, [workout.id]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddExercise = () => {
    setShowAddExerciseModal(true);
  };

  const handleCloseAddExerciseModal = () => {
    setShowAddExerciseModal(false);
  };

  const handleExerciseAdded = () => {
    loadWorkoutExercises(); // Reload exercises after adding
    setShowAddExerciseModal(false);
  };

  const handleStartExercise = async (exerciseId: number) => {
    try {
      setLoading(true);
      await workoutApi.startExercise(workout.id, exerciseId);
      setActiveExerciseId(exerciseId);
      setShowSetTrackerModal(true);
      loadWorkoutExercises(); // Reload to get updated status
    } catch (err: any) {
      console.error('Error starting exercise:', err);
      setError(err.response?.data?.message || 'Failed to start exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCompleted = (set: ExerciseSet) => {
    // Could add any additional logic here for set completion
    console.log('Set completed:', set);
  };

  const handleExerciseCompleted = () => {
    setActiveExerciseId(null);
    setShowSetTrackerModal(false);
    loadWorkoutExercises(); // Reload to get updated exercise status
  };

  const handleCloseSetTracker = () => {
    setShowSetTrackerModal(false);
  };

  const handleContinueExercise = (exerciseId: number) => {
    setActiveExerciseId(exerciseId);
    setShowSetTrackerModal(true);
  };

  const handleStartEdit = (exercise: WorkoutExercise) => {
    setEditingExerciseId(exercise.id);
    setEditFormData({
      plannedSets: exercise.plannedSets,
      plannedReps: exercise.plannedReps,
      plannedWeight: exercise.plannedWeight,
      restTimeSeconds: exercise.restTimeSeconds,
      notes: exercise.notes,
      orderIndex: exercise.orderIndex,
    });
  };

  const handleCancelEdit = () => {
    setEditingExerciseId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    if (!editingExerciseId) return;

    setLoading(true);
    setError(null);

    try {
      const updatedExercise = await workoutApi.updateWorkoutExercise(
        workout.id,
        editingExerciseId,
        editFormData as Omit<WorkoutExercise, 'id' | 'createdAt' | 'updatedAt' | 'exercise' | 'workout' | 'status'>
      );

      // Update the exercises list with the updated exercise
      setExercises(prevExercises =>
        prevExercises.map(ex => ex.id === editingExerciseId ? updatedExercise : ex)
      );

      setEditingExerciseId(null);
      setEditFormData({});
    } catch (err: any) {
      console.error('Error updating exercise:', err);
      setError(err.response?.data?.message || 'Failed to update exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (field: keyof WorkoutExercise, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartWorkout = async () => {
    if (workout.status !== 'PLANNED') return;

    setLoading(true);
    setError(null);

    try {
      const updatedWorkout = await workoutApi.startWorkout(workout.id);
      onWorkoutUpdated(updatedWorkout);
    } catch (err: any) {
      console.error('Error starting workout:', err);
      setError(err.response?.data?.message || 'Failed to start workout');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWorkout = async () => {
    if (workout.status !== 'IN_PROGRESS') return;

    setLoading(true);
    setError(null);

    try {
      const updatedWorkout = await workoutApi.completeWorkout(workout.id);
      onWorkoutUpdated(updatedWorkout);
    } catch (err: any) {
      console.error('Error completing workout:', err);
      setError(err.response?.data?.message || 'Failed to complete workout');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async () => {
    if (!window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await workoutApi.deleteWorkout(workout.id);
      onWorkoutDeleted(workout.id);
    } catch (err: any) {
      console.error('Error deleting workout:', err);
      setError(err.response?.data?.message || 'Failed to delete workout');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return 'Not recorded';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PLANNED': return '#3b82f6';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'COMPLETED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      case 'SKIPPED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  React.useEffect(() => {
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
  }, []);

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
        zIndex: 9999,
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{workout.name}</h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: `${getStatusColor(workout.status)}20`,
                  color: getStatusColor(workout.status),
                }}
              >
                {workout.status.charAt(0) + workout.status.slice(1).toLowerCase().replace('_', ' ')}
              </span>
            </div>
            {workout.description && (
              <p style={{ color: '#6b7280', margin: 0 }}>{workout.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              marginLeft: '16px',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
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

          {/* Workout Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Scheduled</h4>
              <p style={{ margin: 0, fontWeight: '500' }}>{formatDate(workout.scheduledDate)}</p>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Duration</h4>
              <p style={{ margin: 0, fontWeight: '500' }}>{formatDuration(workout.durationMinutes)}</p>
            </div>

            {workout.startedAt && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Started</h4>
                <p style={{ margin: 0, fontWeight: '500' }}>{formatDate(workout.startedAt)}</p>
              </div>
            )}

            {workout.completedAt && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Completed</h4>
                <p style={{ margin: 0, fontWeight: '500' }}>{formatDate(workout.completedAt)}</p>
              </div>
            )}

            {workout.caloriesBurned && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Calories Burned</h4>
                <p style={{ margin: 0, fontWeight: '500' }}>{workout.caloriesBurned} cal</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {workout.notes && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>Notes</h4>
              <p style={{
                margin: 0,
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                whiteSpace: 'pre-wrap'
              }}>
                {workout.notes}
              </p>
            </div>
          )}

          {/* Exercises Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>
                Exercises ({exercises.length})
              </h4>
              {workout.status === 'PLANNED' && (
                <button
                  onClick={handleAddExercise}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  + Add Exercise
                </button>
              )}
            </div>

            {exercisesLoading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                Loading exercises...
              </div>
            ) : exercises.length === 0 ? (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '2px dashed #d1d5db'
              }}>
                <p style={{ margin: 0, color: '#6b7280' }}>No exercises added yet</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                  Click "Add Exercise" to build your workout
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exercises.map((exercise, index) => (
                  <div key={exercise.id}>
                    {/* Regular exercise card */}
                    <div
                      style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#4f46e5',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}>
                                {index + 1}
                              </span>
                              <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                {exercise.exercise.name}
                              </h5>
                              <span style={{
                                padding: '2px 8px',
                                backgroundColor: exercise.status === 'COMPLETED' ? '#dcfce7' :
                                                exercise.status === 'IN_PROGRESS' ? '#fef3c7' : '#f3f4f6',
                                color: exercise.status === 'COMPLETED' ? '#166534' :
                                       exercise.status === 'IN_PROGRESS' ? '#92400e' : '#374151',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: '500',
                              }}>
                                {exercise.status.charAt(0) + exercise.status.slice(1).toLowerCase().replace('_', ' ')}
                              </span>
                            </div>

                            {editingExerciseId === exercise.id ? (
                              // Edit form
                              <div style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                                      Sets:
                                    </label>
                                    <input
                                      type="number"
                                      value={editFormData.plannedSets || ''}
                                      onChange={(e) => handleEditFormChange('plannedSets', parseInt(e.target.value) || 0)}
                                      min="1"
                                      style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                                      Reps:
                                    </label>
                                    <input
                                      type="number"
                                      value={editFormData.plannedReps || ''}
                                      onChange={(e) => handleEditFormChange('plannedReps', parseInt(e.target.value) || 0)}
                                      min="1"
                                      style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                                      Weight (kg):
                                    </label>
                                    <input
                                      type="number"
                                      value={editFormData.plannedWeight || ''}
                                      onChange={(e) => handleEditFormChange('plannedWeight', parseFloat(e.target.value) || null)}
                                      min="0"
                                      step="0.5"
                                      style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                                      Rest (seconds):
                                    </label>
                                    <input
                                      type="number"
                                      value={editFormData.restTimeSeconds || ''}
                                      onChange={(e) => handleEditFormChange('restTimeSeconds', parseInt(e.target.value) || 0)}
                                      min="0"
                                      step="30"
                                      style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                      }}
                                    />
                                  </div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                                    Notes:
                                  </label>
                                  <textarea
                                    value={editFormData.notes || ''}
                                    onChange={(e) => handleEditFormChange('notes', e.target.value)}
                                    rows={2}
                                    style={{
                                      width: '100%',
                                      padding: '6px 8px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      resize: 'vertical',
                                    }}
                                    placeholder="Optional notes..."
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    onClick={handleSaveEdit}
                                    disabled={loading}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: loading ? '#9ca3af' : '#10b981',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: loading ? 'not-allowed' : 'pointer',
                                      fontSize: '12px',
                                    }}
                                  >
                                    {loading ? 'Saving...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#f3f4f6',
                                      color: '#374151',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Display view
                              <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '8px' }}>
                                  <div>
                                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Sets:</span>
                                    <span style={{ marginLeft: '4px', fontWeight: '600' }}>{exercise.plannedSets}</span>
                                  </div>
                                  <div>
                                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Reps:</span>
                                    <span style={{ marginLeft: '4px', fontWeight: '600' }}>{exercise.plannedReps}</span>
                                  </div>
                                  {exercise.plannedWeight && (
                                    <div>
                                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Weight:</span>
                                      <span style={{ marginLeft: '4px', fontWeight: '600' }}>{exercise.plannedWeight}kg</span>
                                    </div>
                                  )}
                                  <div>
                                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Rest:</span>
                                    <span style={{ marginLeft: '4px', fontWeight: '600' }}>
                                      {exercise.restTimeSeconds ? `${Math.floor(exercise.restTimeSeconds / 60)}:${(exercise.restTimeSeconds % 60).toString().padStart(2, '0')}` : '0:00'}
                                    </span>
                                  </div>
                                </div>

                                {exercise.notes && (
                                  <p style={{ margin: '0', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                                    {exercise.notes}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          {workout.status === 'IN_PROGRESS' && exercise.status === 'PENDING' && (
                            <button
                              onClick={() => handleStartExercise(exercise.id)}
                              disabled={loading}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: loading ? '#9ca3af' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                marginLeft: '12px',
                                opacity: loading ? 0.5 : 1
                              }}
                            >
                              {loading ? 'Starting...' : 'Start Exercise'}
                            </button>
                          )}

                          {workout.status === 'IN_PROGRESS' && exercise.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => handleContinueExercise(exercise.id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginLeft: '12px',
                              }}
                            >
                              Continue Exercise
                            </button>
                          )}

                          {/* Edit button - show for all statuses except when editing */}
                          {exercise.status === 'PENDING' && editingExerciseId !== exercise.id && (
                            <button
                              onClick={() => handleStartEdit(exercise)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginLeft: '12px',
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handleDeleteWorkout}
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: loading ? 0.5 : 1,
              }}
            >
              Delete Workout
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Close
              </button>

              {workout.status === 'PLANNED' && (
                <button
                  onClick={handleStartWorkout}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: loading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {loading ? 'Starting...' : 'Start Workout'}
                </button>
              )}

              {workout.status === 'IN_PROGRESS' && (
                <button
                  onClick={handleCompleteWorkout}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: loading ? '#9ca3af' : '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {loading ? 'Completing...' : 'Complete Workout'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddExerciseModal && (
        <AddExerciseModal
          workoutId={workout.id}
          onClose={handleCloseAddExerciseModal}
          onExerciseAdded={handleExerciseAdded}
        />
      )}

      {/* Set Tracker Modal */}
      {showSetTrackerModal && activeExerciseId && (
        <SetTrackerModal
          workoutExercise={exercises.find(ex => ex.id === activeExerciseId)!}
          onSetCompleted={handleSetCompleted}
          onExerciseCompleted={handleExerciseCompleted}
          onClose={handleCloseSetTracker}
        />
      )}
    </div>
  );
};

export default WorkoutDetailModal;