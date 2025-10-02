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
    <div className="content-section">
      <p className="text-body-sm text-light mb-4">
        {progressHistory.length} entries recorded
      </p>

      {progressHistory.length > 0 ? (
        <div className="space-y-4">
          {progressHistory.map((entry, index) => (
            <div
              key={entry.id}
              className="card card-compact"
              style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}
            >
              <div className="flex justify-between items-start gap-6">
                {/* Date and Notes */}
                <div className="flex-shrink-0">
                  <div className="text-body font-semibold text-white mb-1">
                    {formatDate(entry.measurementDate)}
                  </div>
                  {entry.notes && (
                    <div className="text-body-sm text-light italic">
                      {entry.notes}
                    </div>
                  )}
                </div>

                {/* Measurements Grid */}
                <div className="flex-1 grid grid-cols-4 gap-4">
                  {entry.weightKg && (
                    <div>
                      <div className="text-caption text-light">Weight</div>
                      <div className="text-body font-semibold text-white">{entry.weightKg} kg</div>
                    </div>
                  )}

                  {entry.bodyFatPercentage && (
                    <div>
                      <div className="text-caption text-light">Body Fat</div>
                      <div className="text-body font-semibold text-white">{entry.bodyFatPercentage}%</div>
                    </div>
                  )}

                  {entry.muscleMassKg && (
                    <div>
                      <div className="text-caption text-light">Muscle Mass</div>
                      <div className="text-body font-semibold text-white">{entry.muscleMassKg} kg</div>
                    </div>
                  )}

                  {entry.waistCm && (
                    <div>
                      <div className="text-caption text-light">Waist</div>
                      <div className="text-body font-semibold text-white">{entry.waistCm} cm</div>
                    </div>
                  )}

                  {entry.chestCm && (
                    <div>
                      <div className="text-caption text-light">Chest</div>
                      <div className="text-body font-semibold text-white">{entry.chestCm} cm</div>
                    </div>
                  )}

                  {entry.armCm && (
                    <div>
                      <div className="text-caption text-light">Arm</div>
                      <div className="text-body font-semibold text-white">{entry.armCm} cm</div>
                    </div>
                  )}

                  {entry.thighCm && (
                    <div>
                      <div className="text-caption text-light">Thigh</div>
                      <div className="text-body font-semibold text-white">{entry.thighCm} cm</div>
                    </div>
                  )}

                  {entry.restingHeartRate && (
                    <div>
                      <div className="text-caption text-light">Resting HR</div>
                      <div className="text-body font-semibold text-white">{entry.restingHeartRate} bpm</div>
                    </div>
                  )}

                  {entry.bloodPressureSystolic && entry.bloodPressureDiastolic && (
                    <div>
                      <div className="text-caption text-light">Blood Pressure</div>
                      <div className="text-body font-semibold text-white">
                        {entry.bloodPressureSystolic}/{entry.bloodPressureDiastolic}
                      </div>
                    </div>
                  )}

                  {entry.weightKg && entry.heightCm && (
                    <div>
                      <div className="text-caption text-light">BMI</div>
                      <div className="text-body font-semibold text-white">
                        {(entry.weightKg / Math.pow(entry.heightCm / 100, 2)).toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-col-center py-12 fade-in">
          <p className="text-body text-secondary text-center">
            No progress entries yet. Add your first measurement to start tracking your progress!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressHistory;