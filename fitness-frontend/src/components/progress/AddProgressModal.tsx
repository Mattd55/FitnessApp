import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { userApi } from '../../services/api';
import { UserProgress } from '../../types/api';

interface AddProgressModalProps {
  onClose: () => void;
  onProgressAdded: (progress: UserProgress) => void;
}

const AddProgressModal: React.FC<AddProgressModalProps> = ({ onClose, onProgressAdded }) => {
  const [formData, setFormData] = useState({
    measurementDate: new Date().toISOString().split('T')[0], // Today's date
    weightKg: '',
    heightCm: '',
    bodyFatPercentage: '',
    muscleMassKg: '',
    waistCm: '',
    chestCm: '',
    armCm: '',
    thighCm: '',
    hipCm: '',
    neckCm: '',
    restingHeartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Convert form data to API format
      const progressData: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt' | 'user'> = {
        measurementDate: formData.measurementDate,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined,
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : undefined,
        bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : undefined,
        muscleMassKg: formData.muscleMassKg ? parseFloat(formData.muscleMassKg) : undefined,
        waistCm: formData.waistCm ? parseFloat(formData.waistCm) : undefined,
        chestCm: formData.chestCm ? parseFloat(formData.chestCm) : undefined,
        armCm: formData.armCm ? parseFloat(formData.armCm) : undefined,
        thighCm: formData.thighCm ? parseFloat(formData.thighCm) : undefined,
        hipCm: formData.hipCm ? parseFloat(formData.hipCm) : undefined,
        neckCm: formData.neckCm ? parseFloat(formData.neckCm) : undefined,
        restingHeartRate: formData.restingHeartRate ? parseInt(formData.restingHeartRate) : undefined,
        bloodPressureSystolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : undefined,
        bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : undefined,
        notes: formData.notes.trim() || undefined,
      };

      const newProgress = await userApi.createProgress(progressData);
      onProgressAdded(newProgress);
    } catch (err: any) {
      console.error('Error creating progress entry:', err);
      setError(err.response?.data?.message || 'Failed to save progress entry. Please try again.');
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
          maxWidth: '800px',
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
            Add Progress Entry
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

          {/* Date */}
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
              Measurement Date *
            </label>
            <input
              type="date"
              name="measurementDate"
              value={formData.measurementDate}
              onChange={handleInputChange}
              required
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

          {/* Basic Measurements */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '0 0 16px 0' }}>
              Basic Measurements
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
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
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
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
                  placeholder="e.g., 70.5"
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
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
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
                  placeholder="e.g., 175"
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
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  name="bodyFatPercentage"
                  value={formData.bodyFatPercentage}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1.5px solid rgba(178, 190, 195, 0.5)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'var(--color-background-card)',
                    color: 'var(--color-text-white)',
                  }}
                  placeholder="e.g., 15.2"
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
                  Muscle Mass (kg)
                </label>
                <input
                  type="number"
                  name="muscleMassKg"
                  value={formData.muscleMassKg}
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
                  placeholder="e.g., 35.8"
                />
              </div>
            </div>
          </div>

          {/* Body Measurements */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '0 0 16px 0' }}>
              Body Measurements (cm)
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
                  Waist
                </label>
                <input
                  type="number"
                  name="waistCm"
                  value={formData.waistCm}
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
                  Chest
                </label>
                <input
                  type="number"
                  name="chestCm"
                  value={formData.chestCm}
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
                  Arm
                </label>
                <input
                  type="number"
                  name="armCm"
                  value={formData.armCm}
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
                  Thigh
                </label>
                <input
                  type="number"
                  name="thighCm"
                  value={formData.thighCm}
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
                  Hip
                </label>
                <input
                  type="number"
                  name="hipCm"
                  value={formData.hipCm}
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
                  Neck
                </label>
                <input
                  type="number"
                  name="neckCm"
                  value={formData.neckCm}
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
                />
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '0 0 16px 0' }}>
              Health Metrics
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
                  Resting Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="restingHeartRate"
                  value={formData.restingHeartRate}
                  onChange={handleInputChange}
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
                  placeholder="e.g., 60"
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
                  Systolic BP (mmHg)
                </label>
                <input
                  type="number"
                  name="bloodPressureSystolic"
                  value={formData.bloodPressureSystolic}
                  onChange={handleInputChange}
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
                  placeholder="e.g., 120"
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
                  Diastolic BP (mmHg)
                </label>
                <input
                  type="number"
                  name="bloodPressureDiastolic"
                  value={formData.bloodPressureDiastolic}
                  onChange={handleInputChange}
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
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '4px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1.5px solid rgba(178, 190, 195, 0.5)',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)',
              }}
              placeholder="Any additional notes about your progress..."
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
              {loading ? 'Saving...' : 'Save Progress'}
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

export default AddProgressModal;