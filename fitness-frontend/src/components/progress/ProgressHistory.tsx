import React from 'react';
import { UserProgress } from '../../types/api';

interface ProgressHistoryProps {
  progressHistory: UserProgress[];
}

const ProgressHistory: React.FC<ProgressHistoryProps> = ({ progressHistory }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Progress History
        </h3>
        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
          {progressHistory.length} entries recorded
        </p>
      </div>

      {progressHistory.length > 0 ? (
        <div style={{ padding: '0' }}>
          {progressHistory.map((entry, index) => (
            <div
              key={entry.id}
              style={{
                padding: '20px 24px',
                borderBottom: index < progressHistory.length - 1 ? '1px solid #f3f4f6' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {/* Date and Notes */}
              <div style={{ flex: '0 0 auto', marginRight: '24px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  {formatDate(entry.measurementDate)}
                </div>
                {entry.notes && (
                  <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                    {entry.notes}
                  </div>
                )}
              </div>

              {/* Measurements Grid */}
              <div style={{
                flex: '1 1 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px',
                alignItems: 'start'
              }}>
                {entry.weightKg && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Weight</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.weightKg} kg</div>
                  </div>
                )}

                {entry.bodyFatPercentage && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Body Fat</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.bodyFatPercentage}%</div>
                  </div>
                )}

                {entry.muscleMassKg && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Muscle Mass</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.muscleMassKg} kg</div>
                  </div>
                )}

                {entry.waistCm && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Waist</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.waistCm} cm</div>
                  </div>
                )}

                {entry.chestCm && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Chest</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.chestCm} cm</div>
                  </div>
                )}

                {entry.armCm && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Arm</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.armCm} cm</div>
                  </div>
                )}

                {entry.thighCm && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Thigh</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.thighCm} cm</div>
                  </div>
                )}

                {entry.restingHeartRate && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Resting HR</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{entry.restingHeartRate} bpm</div>
                  </div>
                )}

                {entry.bloodPressureSystolic && entry.bloodPressureDiastolic && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Blood Pressure</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {entry.bloodPressureSystolic}/{entry.bloodPressureDiastolic}
                    </div>
                  </div>
                )}

                {/* BMI Calculation */}
                {entry.weightKg && entry.heightCm && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>BMI</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {(entry.weightKg / Math.pow(entry.heightCm / 100, 2)).toFixed(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '40px 24px',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          No progress entries yet. Add your first measurement to start tracking your progress!
        </div>
      )}
    </div>
  );
};

export default ProgressHistory;