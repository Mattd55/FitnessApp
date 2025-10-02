import React from 'react';
import { UserProgress } from '../../types/api';
import { TrendingUp } from 'lucide-react';

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
    <div className="card hover-lift">
      <div className="header-section" style={{ marginBottom: 'var(--space-md)' }}>
        <h3 className="text-h3 text-white">
          Latest Measurements
        </h3>
        {latestProgress && (
          <p className="text-body-sm text-light" style={{ marginTop: '2px' }}>
            Recorded on {formatDate(latestProgress.measurementDate)}
          </p>
        )}
      </div>

      {latestProgress ? (
        <>

          {/* Primary Metrics */}
          <div className="card card-compact mb-4" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              {latestProgress.weightKg && (
                <div>
                  <div className="text-caption text-light mb-1">
                    Weight
                  </div>
                  <div className="text-h2 text-white">
                    {latestProgress.weightKg} kg
                  </div>
                </div>
              )}

              {/* Height */}
              {latestProgress.heightCm && (
                <div>
                  <div className="text-caption text-light mb-1">
                    Height
                  </div>
                  <div className="text-h2 text-white">
                    {latestProgress.heightCm} cm
                  </div>
                </div>
              )}

              {/* Body Fat */}
              {latestProgress.bodyFatPercentage && (
                <div>
                  <div className="text-caption text-light mb-1">
                    Body Fat
                  </div>
                  <div className="text-h2 text-white">
                    {latestProgress.bodyFatPercentage}%
                  </div>
                </div>
              )}

              {/* Muscle Mass */}
              {latestProgress.muscleMassKg && (
                <div>
                  <div className="text-caption text-light mb-1">
                    Muscle Mass
                  </div>
                  <div className="text-h2 text-white">
                    {latestProgress.muscleMassKg} kg
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Body Measurements */}
          {(latestProgress.waistCm || latestProgress.chestCm || latestProgress.armCm || latestProgress.thighCm || latestProgress.hipCm) && (
            <div className="card card-compact mb-4" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
              <div className="text-body font-semibold mb-3 text-secondary text-center">
                Body Measurements
              </div>
              <div className="grid grid-cols-2 gap-3">
                {latestProgress.waistCm && (
                  <div className="text-body flex items-center justify-center">
                    <span className="text-light" style={{ minWidth: '60px', textAlign: 'right', marginRight: '8px' }}>Waist:</span>
                    <span className="text-white font-semibold" style={{ minWidth: '60px', textAlign: 'left' }}>{latestProgress.waistCm} cm</span>
                  </div>
                )}
                {latestProgress.hipCm && (
                  <div className="text-body flex items-center justify-center">
                    <span className="text-light" style={{ minWidth: '60px', textAlign: 'right', marginRight: '8px' }}>Hip:</span>
                    <span className="text-white font-semibold" style={{ minWidth: '60px', textAlign: 'left' }}>{latestProgress.hipCm} cm</span>
                  </div>
                )}
                {latestProgress.chestCm && (
                  <div className="text-body flex items-center justify-center">
                    <span className="text-light" style={{ minWidth: '60px', textAlign: 'right', marginRight: '8px' }}>Chest:</span>
                    <span className="text-white font-semibold" style={{ minWidth: '60px', textAlign: 'left' }}>{latestProgress.chestCm} cm</span>
                  </div>
                )}
                {latestProgress.armCm && (
                  <div className="text-body flex items-center justify-center">
                    <span className="text-light" style={{ minWidth: '60px', textAlign: 'right', marginRight: '8px' }}>Arm:</span>
                    <span className="text-white font-semibold" style={{ minWidth: '60px', textAlign: 'left' }}>{latestProgress.armCm} cm</span>
                  </div>
                )}
                {latestProgress.thighCm && (
                  <div className="text-body flex items-center justify-center">
                    <span className="text-light" style={{ minWidth: '60px', textAlign: 'right', marginRight: '8px' }}>Thigh:</span>
                    <span className="text-white font-semibold" style={{ minWidth: '60px', textAlign: 'left' }}>{latestProgress.thighCm} cm</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health Metrics */}
          {(latestProgress.restingHeartRate || latestProgress.bloodPressureSystolic) && (
            <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
              <div className="text-body font-semibold mb-3 text-secondary">
                Health Metrics
              </div>
              <div className="grid grid-cols-2 gap-3">
                {latestProgress.restingHeartRate && (
                  <div className="text-body">
                    <span className="text-light">Resting HR: </span>
                    <span className="text-white font-semibold">{latestProgress.restingHeartRate} bpm</span>
                  </div>
                )}
                {latestProgress.bloodPressureSystolic && latestProgress.bloodPressureDiastolic && (
                  <div className="text-body">
                    <span className="text-light">Blood Pressure: </span>
                    <span className="text-white font-semibold">
                      {latestProgress.bloodPressureSystolic}/{latestProgress.bloodPressureDiastolic}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex-col-center py-12 fade-in">
          <div className="bg-primary p-4 rounded-2xl w-16 h-16 mb-4 flex-center">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <p className="text-body text-secondary text-center">
            No progress measurements recorded yet.
            <br />
            Click "Add Progress Entry" to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressSummary;
