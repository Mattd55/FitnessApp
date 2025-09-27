import React, { useState, useEffect } from 'react';
import { exerciseApi, workoutApi } from '../../services/api';
import { Exercise, PageResponse } from '../../types/api';

interface AddExerciseModalProps {
  workoutId: number;
  onClose: () => void;
  onExerciseAdded: () => void;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ workoutId, onClose, onExerciseAdded }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addingExercise, setAddingExercise] = useState<number | null>(null);

  // Form data for exercise parameters
  const [exerciseParams, setExerciseParams] = useState({
    orderIndex: 1,
    plannedSets: 3,
    plannedReps: 10,
    plannedWeight: undefined as number | undefined,
    restTimeSeconds: 60,
    notes: '',
  });

  const loadExercises = async () => {
    try {
      setLoading(true);
      const params = {
        page: 0,
        size: 50,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      };

      const response: PageResponse<Exercise> = await exerciseApi.getExercises(params);
      setExercises(response.content);
    } catch (err) {
      setError('Failed to load exercises');
      console.error('Error loading exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, [searchTerm, selectedCategory]);

  const handleAddExercise = async (exerciseId: number) => {
    setAddingExercise(exerciseId);
    setError(null);

    try {
      await workoutApi.addExerciseToWorkout(workoutId, exerciseId, exerciseParams);
      onExerciseAdded();
      onClose();
    } catch (err: any) {
      console.error('Error adding exercise to workout:', err);
      setError(err.response?.data?.message || 'Failed to add exercise to workout');
    } finally {
      setAddingExercise(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleParamChange = (field: string, value: string | number) => {
    setExerciseParams(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

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
          maxWidth: '800px',
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
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Add Exercise to Workout</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            ×
          </button>
        </div>

        {/* Exercise Parameters */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Exercise Parameters</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Sets
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={exerciseParams.plannedSets}
                onChange={(e) => handleParamChange('plannedSets', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Reps
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={exerciseParams.plannedReps}
                onChange={(e) => handleParamChange('plannedReps', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={exerciseParams.plannedWeight || ''}
                onChange={(e) => handleParamChange('plannedWeight', e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Rest Time (seconds)
              </label>
              <input
                type="number"
                min="0"
                step="15"
                value={exerciseParams.restTimeSeconds}
                onChange={(e) => handleParamChange('restTimeSeconds', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Notes
              </label>
              <input
                type="text"
                value={exerciseParams.notes}
                onChange={(e) => handleParamChange('notes', e.target.value)}
                placeholder="Optional notes for this exercise"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ padding: '24px 24px 16px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <option value="">All Categories</option>
              <option value="STRENGTH">Strength</option>
              <option value="CARDIO">Cardio</option>
              <option value="FLEXIBILITY">Flexibility</option>
              <option value="SPORTS">Sports</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            margin: '0 24px 16px 24px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
          }}>
            {error}
          </div>
        )}

        {/* Exercise List */}
        <div style={{ padding: '0 24px 24px 24px', maxHeight: '400px', overflow: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #4f46e5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
              <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading exercises...</p>
            </div>
          ) : exercises.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <p>No exercises found matching your criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: addingExercise === exercise.id ? '#f3f4f6' : 'white',
                  }}
                  onClick={() => !addingExercise && handleAddExercise(exercise.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                        {exercise.name}
                      </h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
                        {exercise.description}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                        <span>Category: {exercise.category}</span>
                        <span>Equipment: {exercise.equipment}</span>
                        <span>Difficulty: {exercise.difficulty}</span>
                      </div>
                    </div>

                    <button
                      disabled={addingExercise !== null}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: addingExercise === exercise.id ? '#9ca3af' : '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: addingExercise ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        marginLeft: '16px',
                        opacity: addingExercise && addingExercise !== exercise.id ? 0.5 : 1,
                      }}
                    >
                      {addingExercise === exercise.id ? 'Adding...' : 'Add Exercise'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExerciseModal;