import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { workoutApi } from '../../services/api';
import { Workout } from '../../types/api';

interface CreateWorkoutModalProps {
  onClose: () => void;
  onWorkoutCreated: (workout: Workout) => void;
}

const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ onClose, onWorkoutCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scheduledDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validate datetime-local input only when complete
    if (name === 'scheduledDate' && value) {
      // Only validate if the datetime string is complete (has the full format)
      const dateTimeRegex = /^(\d{4})-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (dateTimeRegex.test(value)) {
        const year = parseInt(value.substring(0, 4));
        if (year < 1900 || year > 2099) {
          return; // Don't update if year is out of valid range
        }
      }
      // If it's not a complete datetime string yet, allow it (user is still typing)
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Workout name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const workoutData = {
        name: formData.name.trim(),
        status: 'PLANNED' as const,
        description: formData.description.trim() || undefined,
        scheduledDate: formData.scheduledDate || undefined,
        notes: formData.notes.trim() || undefined,
      };

      const newWorkout = await workoutApi.createWorkout(workoutData);
      onWorkoutCreated(newWorkout);
    } catch (err: any) {
      console.error('Error creating workout:', err);
      setError(err.response?.data?.message || 'Failed to create workout. Please try again.');
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
  }, []);

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
        zIndex: 9999,
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-elevated)',
          borderRadius: '8px',
          maxWidth: '500px',
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
          padding: '20px',
          borderBottom: '1.5px solid rgba(178, 190, 195, 0.3)',
          position: 'relative'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#000000' }}>Create New Workout</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--color-text-light)',
              position: 'absolute',
              right: '20px'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
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

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                marginBottom: '4px'
              }}
            >
              Workout Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1.5px solid rgba(178, 190, 195, 0.5)',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)'
              }}
              placeholder="e.g., Upper Body Strength, Cardio Session"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="description"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                marginBottom: '4px'
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1.5px solid rgba(178, 190, 195, 0.5)',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)'
              }}
              placeholder="Optional description of your workout..."
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="scheduledDate"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                marginBottom: '4px'
              }}
            >
              Scheduled Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              min="1900-01-01T00:00"
              max="2099-12-31T23:59"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1.5px solid rgba(178, 190, 195, 0.5)',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)',
                colorScheme: 'dark'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="notes"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                marginBottom: '4px'
              }}
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1.5px solid rgba(178, 190, 195, 0.5)',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)'
              }}
              placeholder="Any additional notes or goals..."
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: 'var(--color-primary)',
                border: '2px solid var(--color-primary)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: loading ? '#9ca3af' : 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Creating...' : 'Create Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default CreateWorkoutModal;
