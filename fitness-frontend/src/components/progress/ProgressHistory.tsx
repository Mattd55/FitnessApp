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
      {progressHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(178, 190, 195, 0.3)' }}>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'left', position: 'sticky', left: 0, backgroundColor: 'var(--color-surface)' }} className="text-body-sm text-light font-semibold">Date</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Weight</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Body Fat</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Muscle</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">BMI</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Waist</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Chest</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Arm</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Thigh</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'right' }} className="text-body-sm text-light font-semibold">Hip</th>
                <th style={{ padding: 'var(--space-lg) var(--space-md)', textAlign: 'left' }} className="text-body-sm text-light font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {progressHistory.map((entry, index) => (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: index < progressHistory.length - 1 ? '1px solid rgba(178, 190, 195, 0.1)' : 'none',
                    backgroundColor: index % 2 === 0 ? 'rgba(178, 190, 195, 0.03)' : 'transparent'
                  }}
                  className="hover:bg-opacity-10 hover:bg-white transition-colors"
                >
                  <td style={{ padding: 'var(--space-md)', textAlign: 'left', position: 'sticky', left: 0, backgroundColor: index % 2 === 0 ? 'rgba(178, 190, 195, 0.03)' : 'var(--color-surface)' }} className="text-body text-white font-medium">
                    {formatDate(entry.measurementDate)}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.weightKg ? `${entry.weightKg} kg` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.bodyFatPercentage ? `${entry.bodyFatPercentage}%` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.muscleMassKg ? `${entry.muscleMassKg} kg` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.weightKg && entry.heightCm ? (entry.weightKg / Math.pow(entry.heightCm / 100, 2)).toFixed(1) : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.waistCm ? `${entry.waistCm} cm` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.chestCm ? `${entry.chestCm} cm` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.armCm ? `${entry.armCm} cm` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.thighCm ? `${entry.thighCm} cm` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'right' }} className="text-body text-white">
                    {entry.hipCm ? `${entry.hipCm} cm` : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-md)', textAlign: 'left', maxWidth: '200px' }} className="text-body-sm text-light italic">
                    {entry.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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