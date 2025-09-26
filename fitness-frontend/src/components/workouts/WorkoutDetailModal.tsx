import React, { useState } from 'react';
import { workoutApi } from '../../services/api';
import { Workout } from '../../types/api';

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

          {/* Exercises Section - Placeholder */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>Exercises</h4>
            <div style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              border: '2px dashed #d1d5db'
            }}>
              <p style={{ margin: 0, color: '#6b7280' }}>Exercise management coming soon...</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                You'll be able to add and track exercises here
              </p>
            </div>
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
    </div>
  );
};

export default WorkoutDetailModal;