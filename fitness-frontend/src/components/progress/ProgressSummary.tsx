import React from 'react';
import { UserProgress } from '../../types/api';

interface ProgressSummaryProps {
  latestProgress: UserProgress | null;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ latestProgress }) => {
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
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
        Latest Measurements
      </h3>

      {latestProgress ? (
        <>
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            Recorded on {formatDate(latestProgress.measurementDate)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {/* Weight */}
            {latestProgress.weightKg && (
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Weight
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {latestProgress.weightKg} kg
                </div>
              </div>
            )}

            {/* Height */}
            {latestProgress.heightCm && (
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Height
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {latestProgress.heightCm} cm
                </div>
              </div>
            )}

            {/* Body Fat */}
            {latestProgress.bodyFatPercentage && (
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Body Fat
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {latestProgress.bodyFatPercentage}%
                </div>
              </div>
            )}

            {/* Muscle Mass */}
            {latestProgress.muscleMassKg && (
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Muscle Mass
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {latestProgress.muscleMassKg} kg
                </div>
              </div>
            )}
          </div>

          {/* Body Measurements */}
          {(latestProgress.waistCm || latestProgress.chestCm || latestProgress.armCm || latestProgress.thighCm) && (
            <>
              <div style={{
                borderTop: '1px solid #e5e7eb',
                marginTop: '16px',
                paddingTop: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                  Body Measurements
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {latestProgress.waistCm && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Waist: </span>
                      <span style={{ fontWeight: '600' }}>{latestProgress.waistCm} cm</span>
                    </div>
                  )}
                  {latestProgress.chestCm && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Chest: </span>
                      <span style={{ fontWeight: '600' }}>{latestProgress.chestCm} cm</span>
                    </div>
                  )}
                  {latestProgress.armCm && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Arm: </span>
                      <span style={{ fontWeight: '600' }}>{latestProgress.armCm} cm</span>
                    </div>
                  )}
                  {latestProgress.thighCm && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Thigh: </span>
                      <span style={{ fontWeight: '600' }}>{latestProgress.thighCm} cm</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Health Metrics */}
          {(latestProgress.restingHeartRate || latestProgress.bloodPressureSystolic) && (
            <>
              <div style={{
                borderTop: '1px solid #e5e7eb',
                marginTop: '16px',
                paddingTop: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                  Health Metrics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {latestProgress.restingHeartRate && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Resting HR: </span>
                      <span style={{ fontWeight: '600' }}>{latestProgress.restingHeartRate} bpm</span>
                    </div>
                  )}
                  {latestProgress.bloodPressureSystolic && latestProgress.bloodPressureDiastolic && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Blood Pressure: </span>
                      <span style={{ fontWeight: '600' }}>
                        {latestProgress.bloodPressureSystolic}/{latestProgress.bloodPressureDiastolic}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          padding: '40px 20px',
          fontStyle: 'italic'
        }}>
          No progress measurements recorded yet.
          <br />
          Click "Add Progress Entry" to get started!
        </div>
      )}
    </div>
  );
};

export default ProgressSummary;