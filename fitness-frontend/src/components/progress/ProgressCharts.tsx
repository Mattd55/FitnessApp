import React from 'react';
import { UserProgress } from '../../types/api';

interface ProgressChartsProps {
  progressHistory: UserProgress[];
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ progressHistory }) => {
  // Sort by date (oldest first for trend calculation)
  const sortedHistory = [...progressHistory].sort(
    (a, b) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()
  );

  const calculateTrend = (data: (number | undefined)[]) => {
    const validData = data.filter((val): val is number => val !== undefined);
    if (validData.length < 2) return { trend: 'stable', change: 0 };

    const first = validData[0];
    const last = validData[validData.length - 1];
    const change = last - first;
    const percentChange = (change / first) * 100;

    if (Math.abs(percentChange) < 1) return { trend: 'stable', change };
    return { trend: change > 0 ? 'up' : 'down', change };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatChange = (value: number, unit: string = '') => {
    const absValue = Math.abs(value);
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${absValue.toFixed(1)}${unit}`;
  };

  // Extract data series
  const weightData = sortedHistory.map(entry => entry.weightKg);
  const bodyFatData = sortedHistory.map(entry => entry.bodyFatPercentage);
  const muscleMassData = sortedHistory.map(entry => entry.muscleMassKg);
  const waistData = sortedHistory.map(entry => entry.waistCm);

  // Calculate trends
  const weightTrend = calculateTrend(weightData);
  const bodyFatTrend = calculateTrend(bodyFatData);
  const muscleMassTrend = calculateTrend(muscleMassData);
  const waistTrend = calculateTrend(waistData);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Simple line chart component
  const SimpleLineChart: React.FC<{
    data: (number | undefined)[],
    label: string,
    unit: string,
    color: string
  }> = ({ data, label, unit, color }) => {
    const validData = data.filter((val): val is number => val !== undefined);
    if (validData.length === 0) return null;

    const min = Math.min(...validData);
    const max = Math.max(...validData);
    const range = max - min || 1;

    return (
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
          {label}
        </h4>

        {/* Chart area */}
        <div style={{
          height: '120px',
          position: 'relative',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          padding: '12px',
          overflow: 'hidden'
        }}>
          {/* Y-axis labels */}
          <div style={{
            position: 'absolute',
            left: '4px',
            top: '12px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {max.toFixed(1)}{unit}
          </div>
          <div style={{
            position: 'absolute',
            left: '4px',
            bottom: '12px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {min.toFixed(1)}{unit}
          </div>

          {/* Data points */}
          <div style={{
            display: 'flex',
            height: '100%',
            alignItems: 'end',
            justifyContent: 'space-between',
            paddingLeft: '40px',
            paddingRight: '8px'
          }}>
            {sortedHistory.map((entry, index) => {
              const value = data[index];
              if (value === undefined) return null;

              const height = ((value - min) / range) * 80 + 10;
              return (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: `${height}px`,
                    backgroundColor: color,
                    borderRadius: '2px',
                    position: 'relative',
                    opacity: 0.8
                  }}
                  title={`${formatDate(entry.measurementDate)}: ${value}${unit}`}
                />
              );
            })}
          </div>
        </div>

        {/* Latest value and trend */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px'
        }}>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
              {validData[validData.length - 1]?.toFixed(1)}{unit}
            </span>
            <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>
              latest
            </span>
          </div>
          {validData.length > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: getTrendColor(weightTrend.trend)
            }}>
              <span style={{ marginRight: '4px' }}>
                {getTrendIcon(weightTrend.trend)}
              </span>
              {formatChange(weightTrend.change, unit)}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (sortedHistory.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#B2BEC3' }}>
        Progress Trends
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
      }}>
        {/* Weight Chart */}
        {weightData.some(val => val !== undefined) && (
          <SimpleLineChart
            data={weightData}
            label="Weight"
            unit="kg"
            color="#3b82f6"
          />
        )}

        {/* Body Fat Chart */}
        {bodyFatData.some(val => val !== undefined) && (
          <SimpleLineChart
            data={bodyFatData}
            label="Body Fat"
            unit="%"
            color="#ef4444"
          />
        )}

        {/* Muscle Mass Chart */}
        {muscleMassData.some(val => val !== undefined) && (
          <SimpleLineChart
            data={muscleMassData}
            label="Muscle Mass"
            unit="kg"
            color="#10b981"
          />
        )}

        {/* Waist Chart */}
        {waistData.some(val => val !== undefined) && (
          <SimpleLineChart
            data={waistData}
            label="Waist"
            unit="cm"
            color="#f59e0b"
          />
        )}
      </div>

      {/* Summary Stats */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginTop: '20px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
          Progress Summary
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {weightTrend.change !== 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px'
            }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>Weight Change</span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: getTrendColor(weightTrend.trend)
              }}>
                {getTrendIcon(weightTrend.trend)} {formatChange(weightTrend.change, 'kg')}
              </span>
            </div>
          )}

          {bodyFatTrend.change !== 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px'
            }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>Body Fat Change</span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: getTrendColor(bodyFatTrend.trend)
              }}>
                {getTrendIcon(bodyFatTrend.trend)} {formatChange(bodyFatTrend.change, '%')}
              </span>
            </div>
          )}

          {muscleMassTrend.change !== 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px'
            }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>Muscle Mass Change</span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: getTrendColor(muscleMassTrend.trend)
              }}>
                {getTrendIcon(muscleMassTrend.trend)} {formatChange(muscleMassTrend.change, 'kg')}
              </span>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '6px'
          }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>Tracking Period</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              {formatDate(sortedHistory[0].measurementDate)} - {formatDate(sortedHistory[sortedHistory.length - 1].measurementDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;