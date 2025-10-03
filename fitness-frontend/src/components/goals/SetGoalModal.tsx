import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { goalApi } from '../../services/api';
import { Goal, GoalType } from '../../types/api';

interface SetGoalModalProps {
  onClose: () => void;
  onGoalCreated: (goal: Goal) => void;
  editGoal?: Goal | null;
}

const SetGoalModal: React.FC<SetGoalModalProps> = ({ onClose, onGoalCreated, editGoal }) => {
  const [formData, setFormData] = useState({
    title: editGoal?.title || '',
    description: editGoal?.description || '',
    type: editGoal?.type || 'CUSTOM' as GoalType,
    targetValue: editGoal?.targetValue?.toString() || '',
    currentValue: editGoal?.currentValue?.toString() || '',
    unit: editGoal?.unit || '',
    targetDate: editGoal?.targetDate || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goalTypes: { value: GoalType; label: string; icon: string }[] = [
    { value: 'WEIGHT_LOSS', label: 'Weight Loss', icon: '⬇️' },
    { value: 'WEIGHT_GAIN', label: 'Weight Gain', icon: '⬆️' },
    { value: 'MUSCLE_GAIN', label: 'Muscle Gain', icon: '💪' },
    { value: 'BODY_FAT_REDUCTION', label: 'Body Fat Reduction', icon: '📉' },
    { value: 'STRENGTH', label: 'Strength', icon: '🏋️' },
    { value: 'ENDURANCE', label: 'Endurance', icon: '🏃' },
    { value: 'FLEXIBILITY', label: 'Flexibility', icon: '🧘' },
    { value: 'WORKOUT_FREQUENCY', label: 'Workout Frequency', icon: '📅' },
    { value: 'PERSONAL_RECORD', label: 'Personal Record', icon: '🏆' },
    { value: 'CUSTOM', label: 'Custom Goal', icon: '🎯' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'user'> = {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        status: editGoal?.status || 'ACTIVE',
        targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        unit: formData.unit || undefined,
        targetDate: formData.targetDate || undefined,
        startedDate: editGoal?.startedDate,
        completedDate: editGoal?.completedDate,
      };

      const newGoal = editGoal
        ? await goalApi.updateGoal(editGoal.id, goalData)
        : await goalApi.createGoal(goalData);

      onGoalCreated(newGoal);
    } catch (err: any) {
      console.error('Error creating/updating goal:', err);
      setError(err.response?.data?.message || 'Failed to save goal. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const modalContent = (
    <>
      <style>
        {`
          .date-input-white-icon::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
          }
        `}
      </style>
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
            backgroundColor: 'var(--color-background-elevated)',
            borderRadius: '8px',
            maxWidth: '700px',
            width: '90%',
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
              {editGoal ? 'Edit Goal' : 'Set New Goal'}
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

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            {/* Goal Type */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Goal Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
              >
                {goalTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Goal Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
                placeholder="e.g., Lose 10 kg in 3 months"
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
                placeholder="What do you want to achieve and why?"
              />
            </div>

            {/* Target Values */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '0 0 16px 0' }}>
                Target Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Target Value
                  </label>
                  <input
                    type="number"
                    name="targetValue"
                    value={formData.targetValue}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid rgba(178, 190, 195, 0.5)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'var(--color-background-card)',
                      color: 'var(--color-text-white)',
                    }}
                    placeholder="e.g., 70"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Current Value
                  </label>
                  <input
                    type="number"
                    name="currentValue"
                    value={formData.currentValue}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid rgba(178, 190, 195, 0.5)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'var(--color-background-card)',
                      color: 'var(--color-text-white)',
                    }}
                    placeholder="e.g., 80"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    maxLength={20}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid rgba(178, 190, 195, 0.5)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'var(--color-background-card)',
                      color: 'var(--color-text-white)',
                    }}
                    placeholder="e.g., kg"
                  />
                </div>
              </div>
            </div>

            {/* Target Date */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Target Date
              </label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleInputChange}
                className="date-input-white-icon"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1.5px solid #FF6B6B',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: '#FF6B6B',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#FF6B6B',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Saving...' : editGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default SetGoalModal;
