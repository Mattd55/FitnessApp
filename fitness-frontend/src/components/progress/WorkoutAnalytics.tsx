import React from 'react';
import { Workout, WorkoutExercise, ExerciseSet } from '../../types/api';

interface WorkoutAnalyticsProps {
  workouts: Workout[];
  workoutExercises: { [workoutId: number]: WorkoutExercise[] };
  exerciseSets: { [workoutExerciseId: number]: ExerciseSet[] };
}

const WorkoutAnalytics: React.FC<WorkoutAnalyticsProps> = ({
  workouts,
  workoutExercises,
  exerciseSets
}) => {
  // Filter completed workouts for analytics
  const completedWorkouts = workouts.filter(w => w.status === 'COMPLETED' && w.completedAt);

  if (completedWorkouts.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: '#6b7280',
        fontStyle: 'italic'
      }}>
        Complete some workouts to see your performance analytics!
      </div>
    );
  }

  // Sort workouts by completion date
  const sortedWorkouts = [...completedWorkouts].sort(
    (a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime()
  );

  // Calculate workout volume metrics
  const calculateWorkoutVolume = (workout: Workout) => {
    const exercises = workoutExercises[workout.id] || [];
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    exercises.forEach(exercise => {
      const sets = exerciseSets[exercise.id] || [];
      const completedSets = sets.filter(set => set.status === 'COMPLETED');

      completedSets.forEach(set => {
        totalSets++;
        if (set.actualReps) totalReps += set.actualReps;
        if (set.actualWeight && set.actualReps) {
          totalVolume += set.actualWeight * set.actualReps;
        }
      });
    });

    return { totalVolume, totalSets, totalReps };
  };

  // Calculate intensity metrics (average RPE)
  const calculateWorkoutIntensity = (workout: Workout) => {
    const exercises = workoutExercises[workout.id] || [];
    let totalRPE = 0;
    let rpeCount = 0;

    exercises.forEach(exercise => {
      const sets = exerciseSets[exercise.id] || [];
      sets.forEach(set => {
        if (set.rpeScore && set.status === 'COMPLETED') {
          totalRPE += set.rpeScore;
          rpeCount++;
        }
      });
    });

    return rpeCount > 0 ? totalRPE / rpeCount : 0;
  };

  // Calculate analytics for all workouts
  const workoutAnalytics = sortedWorkouts.map(workout => ({
    workout,
    ...calculateWorkoutVolume(workout),
    avgIntensity: calculateWorkoutIntensity(workout),
    date: new Date(workout.completedAt!),
    duration: workout.durationMinutes || 0
  }));

  // Overall statistics
  const totalWorkouts = workoutAnalytics.length;
  const totalVolume = workoutAnalytics.reduce((sum, w) => sum + w.totalVolume, 0);
  const avgDuration = workoutAnalytics.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts;
  const avgIntensity = workoutAnalytics.reduce((sum, w) => sum + w.avgIntensity, 0) / totalWorkouts;

  // Calculate trends (last 4 weeks vs previous 4 weeks)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const recentWorkouts = workoutAnalytics.filter(w => w.date >= fourWeeksAgo);
  const previousWorkouts = workoutAnalytics.filter(w => w.date >= eightWeeksAgo && w.date < fourWeeksAgo);

  const calculateTrend = (recent: number[], previous: number[]) => {
    if (recent.length === 0 || previous.length === 0) return { trend: 'stable', change: 0 };

    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
    const percentChange = ((recentAvg - previousAvg) / previousAvg) * 100;

    if (Math.abs(percentChange) < 5) return { trend: 'stable', change: percentChange };
    return { trend: percentChange > 0 ? 'up' : 'down', change: percentChange };
  };

  const volumeTrend = calculateTrend(
    recentWorkouts.map(w => w.totalVolume),
    previousWorkouts.map(w => w.totalVolume)
  );

  const intensityTrend = calculateTrend(
    recentWorkouts.map(w => w.avgIntensity),
    previousWorkouts.map(w => w.avgIntensity)
  );

  const frequencyTrend = {
    recent: recentWorkouts.length,
    previous: previousWorkouts.length,
    change: recentWorkouts.length - previousWorkouts.length
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Simple volume chart
  const VolumeChart = () => {
    const maxVolume = Math.max(...workoutAnalytics.map(w => w.totalVolume));
    const recentWorkoutsForChart = workoutAnalytics.slice(-8); // Last 8 workouts

    return (
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
          Training Volume Trend
        </h4>

        <div style={{
          height: '120px',
          position: 'relative',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          padding: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            height: '100%',
            alignItems: 'end',
            justifyContent: 'space-between',
            paddingLeft: '40px',
            paddingRight: '8px'
          }}>
            {recentWorkoutsForChart.map((analytics, index) => {
              const height = maxVolume > 0 ? ((analytics.totalVolume / maxVolume) * 80 + 10) : 10;
              return (
                <div
                  key={index}
                  style={{
                    width: '16px',
                    height: `${height}px`,
                    backgroundColor: '#3b82f6',
                    borderRadius: '2px',
                    position: 'relative',
                    opacity: 0.8
                  }}
                  title={`${formatDate(analytics.date)}: ${analytics.totalVolume.toFixed(0)}kg total volume`}
                />
              );
            })}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px'
        }}>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
              {totalVolume.toFixed(0)}kg
            </span>
            <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>
              total volume
            </span>
          </div>
          {volumeTrend.trend !== 'stable' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: getTrendColor(volumeTrend.trend)
            }}>
              <span style={{ marginRight: '4px' }}>
                {getTrendIcon(volumeTrend.trend)}
              </span>
              {Math.abs(volumeTrend.change).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
        Workout Performance Analytics
      </h3>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total Workouts */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
            {totalWorkouts}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Completed Workouts</div>
          {frequencyTrend.change !== 0 && (
            <div style={{
              fontSize: '12px',
              color: frequencyTrend.change > 0 ? '#10b981' : '#ef4444',
              marginTop: '4px'
            }}>
              {frequencyTrend.change > 0 ? '+' : ''}{frequencyTrend.change} vs last 4 weeks
            </div>
          )}
        </div>

        {/* Average Duration */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
            {avgDuration.toFixed(0)}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Avg Duration (min)</div>
        </div>

        {/* Average Intensity */}
        {avgIntensity > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
              {avgIntensity.toFixed(1)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Avg Intensity (RPE)</div>
            {intensityTrend.trend !== 'stable' && (
              <div style={{
                fontSize: '12px',
                color: getTrendColor(intensityTrend.trend),
                marginTop: '4px'
              }}>
                {getTrendIcon(intensityTrend.trend)} {Math.abs(intensityTrend.change).toFixed(1)}%
              </div>
            )}
          </div>
        )}

        {/* Total Volume */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '4px' }}>
            {(totalVolume / 1000).toFixed(1)}T
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Volume (tonnes)</div>
        </div>
      </div>

      {/* Volume Chart */}
      <VolumeChart />

      {/* Recent Performance */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginTop: '20px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
          Recent Workout Performance
        </h4>

        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {sortedWorkouts.slice(-5).reverse().map(workout => {
            const analytics = workoutAnalytics.find(a => a.workout.id === workout.id)!;
            return (
              <div
                key={workout.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>{workout.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formatDate(analytics.date)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '14px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600' }}>{analytics.totalSets}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>sets</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600' }}>{analytics.totalVolume.toFixed(0)}kg</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>volume</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600' }}>{analytics.duration}min</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>duration</div>
                  </div>
                  {analytics.avgIntensity > 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600' }}>{analytics.avgIntensity.toFixed(1)}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>RPE</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutAnalytics;