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
      <div className="flex-col-center py-12 fade-in">
        <p className="text-body text-secondary text-center">
          Complete some workouts to see your performance analytics!
        </p>
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
    <div className="content-section">
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        {/* Total Workouts */}
        <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-lg)' }}>
          <div className="text-h1 text-white mb-1">
            {totalWorkouts}
          </div>
          <div className="text-caption text-light">Completed Workouts</div>
          {frequencyTrend.change !== 0 && (
            <div className={`text-caption mt-1 ${frequencyTrend.change > 0 ? 'text-success' : 'text-error'}`}>
              {frequencyTrend.change > 0 ? '+' : ''}{frequencyTrend.change} vs last 4 weeks
            </div>
          )}
        </div>

        {/* Average Duration */}
        <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-lg)' }}>
          <div className="text-h1 text-white mb-1">
            {avgDuration.toFixed(0)}
          </div>
          <div className="text-caption text-light">Avg Duration (min)</div>
        </div>

        {/* Total Volume */}
        <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-lg)' }}>
          <div className="text-h1 text-white mb-1">
            {(totalVolume / 1000).toFixed(1)}T
          </div>
          <div className="text-caption text-light">Total Volume (tonnes)</div>
        </div>
      </div>

      {/* Volume Chart */}
      <VolumeChart />

      {/* Recent Performance */}
      <div className="mt-6">
        <h4 className="text-h4 text-white mb-4">
          Recent Workout Performance
        </h4>

        <div className="space-y-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {sortedWorkouts.slice(-5).reverse().map(workout => {
            const analytics = workoutAnalytics.find(a => a.workout.id === workout.id)!;
            return (
              <div
                key={workout.id}
                className="card card-compact"
                style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-lg)' }}
              >
                <div className="flex justify-between items-center">
                  <div style={{ textAlign: 'left' }}>
                    <div className="text-body font-semibold text-white" style={{ textAlign: 'left' }}>{workout.name}</div>
                    <div className="text-caption text-light" style={{ textAlign: 'left' }}>
                      {formatDate(analytics.date)}
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="text-center">
                      <div className="text-body font-semibold text-white">{analytics.totalSets}</div>
                      <div className="text-caption text-light">sets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-body font-semibold text-white">{analytics.totalVolume.toFixed(0)}kg</div>
                      <div className="text-caption text-light">volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-body font-semibold text-white">{analytics.duration}min</div>
                      <div className="text-caption text-light">duration</div>
                    </div>
                    {analytics.avgIntensity > 0 && (
                      <div className="text-center">
                        <div className="text-body font-semibold text-white">{analytics.avgIntensity.toFixed(1)}</div>
                        <div className="text-caption text-light">RPE</div>
                      </div>
                    )}
                  </div>
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