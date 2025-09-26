import React from 'react';
import { Exercise } from '../../types/api';

interface ExerciseDetailProps {
  exercise: Exercise;
  onClose: () => void;
}

const ExerciseDetailSimple: React.FC<ExerciseDetailProps> = ({ exercise, onClose }) => {
  console.log('Simple modal rendering for:', exercise.name);
  console.log('Exercise data:', exercise);

  React.useEffect(() => {
    console.log('useEffect running for:', exercise.name);
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      console.log('useEffect cleanup for:', exercise.name);
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{exercise.name}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        <p style={{ marginBottom: '16px' }}>Test modal is working!</p>

        <div style={{ marginBottom: '16px' }}>
          <p><strong>Category:</strong> {exercise.category || 'N/A'}</p>
          <p><strong>Equipment:</strong> {exercise.equipment || 'N/A'}</p>
          <p><strong>Difficulty:</strong> {exercise.difficulty || 'N/A'}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailSimple;