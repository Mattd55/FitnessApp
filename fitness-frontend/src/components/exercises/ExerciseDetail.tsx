import React from 'react';
import ReactDOM from 'react-dom';
import { Exercise, MuscleGroup } from '../../types/api';

interface ExerciseDetailProps {
  exercise: Exercise;
  onClose: () => void;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise, onClose }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
      case 'INTERMEDIATE':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde047' };
      case 'ADVANCED':
        return { bg: '#fed7aa', text: '#9a3412', border: '#fdba74' };
      case 'EXPERT':
        return { bg: '#fecaca', text: '#991b1b', border: '#f87171' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const formatEquipment = (equipment: string): string => {
    return equipment.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatMuscleGroup = (muscle: MuscleGroup): string => {
    return muscle.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDifficulty = (difficulty: string): string => {
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
  };

  const formatInstructions = (instructions: string): string[] => {
    return instructions
      .split(/\d+\.\s|\n|\.\s/)
      .map(step => step.trim())
      .filter(step => step.length > 10);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
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
  }, [onClose]);

  const instructionSteps = formatInstructions(exercise.instructions);
  const difficultyColors = getDifficultyColor(exercise.difficulty);

  const modalContent = (
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
        padding: '16px',
        zIndex: 9999,
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-elevated)',
          borderRadius: '8px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1.5px solid rgba(178, 190, 195, 0.3)',
          position: 'relative'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#000000' }}>
            {exercise.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              position: 'absolute',
              right: '24px'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Description */}
          {exercise.description && (
            <div style={{
              marginBottom: '20px',
              padding: '12px 16px',
              backgroundColor: 'var(--color-background-card)',
              borderRadius: '6px',
              border: '1.5px solid rgba(178, 190, 195, 0.3)'
            }}>
              <p style={{ color: 'var(--color-text-white)', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                {exercise.description}
              </p>
            </div>
          )}

          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {/* Difficulty */}
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              border: `1.5px solid ${difficultyColors.border}`,
              backgroundColor: difficultyColors.bg,
            }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: difficultyColors.text, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Difficulty
              </h4>
              <p style={{ margin: 0, fontWeight: '600', color: difficultyColors.text, fontSize: '14px' }}>
                {formatDifficulty(exercise.difficulty)}
              </p>
            </div>

            {/* Category */}
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              border: '1.5px solid #93c5fd',
              backgroundColor: '#dbeafe',
            }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Category
              </h4>
              <p style={{ margin: 0, fontWeight: '600', color: '#1e40af', fontSize: '14px' }}>
                {exercise.category}
              </p>
            </div>

            {/* Equipment */}
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              border: '1.5px solid rgba(178, 190, 195, 0.5)',
              backgroundColor: '#f3f4f6',
            }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Equipment
              </h4>
              <p style={{ margin: 0, fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                {formatEquipment(exercise.equipment)}
              </p>
            </div>
          </div>

          {/* Muscle Groups */}
          {((exercise.primaryMuscles && exercise.primaryMuscles.length > 0) ||
            (exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0)) && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#000000', margin: '0 0 12px 0' }}>
                Targeted Muscles
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? 'repeat(2, 1fr)' : '1fr',
                gap: '16px',
              }}>
                {/* Primary Muscles */}
                {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#FF6B6B',
                      }}></span>
                      <h5 style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Primary
                      </h5>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {exercise.primaryMuscles.map((muscle, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            backgroundColor: '#ffe4e6',
                            color: '#be123c',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          {formatMuscleGroup(muscle)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secondary Muscles */}
                {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#9ca3af',
                      }}></span>
                      <h5 style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Secondary
                      </h5>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {exercise.secondaryMuscles.map((muscle, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          {formatMuscleGroup(muscle)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#000000', margin: '0 0 12px 0' }}>
              How to Perform
            </h4>

            {instructionSteps.length > 1 ? (
              <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {instructionSteps.map((step, index) => (
                  <li key={index} style={{ display: 'flex', gap: '12px' }}>
                    <span style={{
                      flexShrink: 0,
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {index + 1}
                    </span>
                    <p style={{ margin: 0, color: '#000000', fontSize: '14px', lineHeight: '1.5', flex: 1 }}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--color-background-card)',
                border: '1.5px solid rgba(178, 190, 195, 0.5)',
                borderRadius: '6px',
              }}>
                <p style={{ margin: 0, color: 'var(--color-text-white)', fontSize: '14px', lineHeight: '1.5' }}>
                  {exercise.instructions}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: '#FF6B6B',
                border: '2px solid #FF6B6B',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default ExerciseDetail;
