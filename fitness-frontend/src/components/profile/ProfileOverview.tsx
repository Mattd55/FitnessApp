import React, { useState, useEffect } from 'react';
import { User, UserProgress, Workout } from '../../types/api';
import { userApi, workoutApi } from '../../services/api';

interface ProfileOverviewProps {
  userProfile: User;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ userProfile }) => {
  const [latestProgress, setLatestProgress] = useState<UserProgress | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    currentStreak: 0
  });

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      // Load latest progress
      const progress = await userApi.getLatestProgress().catch(() => null);
      setLatestProgress(progress);

      // Load recent workouts
      const workoutsResponse = await workoutApi.getWorkouts(0, 10);
      const workouts = workoutsResponse.content;
      setRecentWorkouts(workouts.slice(0, 5)); // Show last 5

      // Calculate stats
      const completedWorkouts = workouts.filter(w => w.status === 'COMPLETED');
      const currentStreak = calculateWorkoutStreak(workouts);

      setStats({
        totalWorkouts: workouts.length,
        completedWorkouts: completedWorkouts.length,
        currentStreak
      });
    } catch (err) {
      console.error('Error loading overview data:', err);
    }
  };

  const calculateWorkoutStreak = (workouts: Workout[]): number => {
    const completed = workouts
      .filter(w => w.status === 'COMPLETED' && w.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    if (completed.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const workout of completed) {
      const workoutDate = new Date(workout.completedAt!);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '#10b981';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'PLANNED': return '#3b82f6';
      case 'CANCELLED': return '#ef4444';
      case 'SKIPPED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'IN_PROGRESS': return '🏃';
      case 'PLANNED': return '📅';
      case 'CANCELLED': return '❌';
      case 'SKIPPED': return '⏭️';
      default: return '📋';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Account Info */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
          Account Information
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Member Since</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              {formatDate(userProfile.createdAt)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Last Updated</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              {formatDate(userProfile.updatedAt)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Account Status</div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✅ Active
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Stats */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
          Fitness Statistics
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
              {stats.totalWorkouts}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Workouts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
              {stats.completedWorkouts}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
              {stats.currentStreak}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Current Streak</div>
          </div>
          {stats.totalWorkouts > 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '4px' }}>
                {Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100)}%
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Completion Rate</div>
            </div>
          )}
        </div>
      </div>

      {/* Latest Progress */}
      {latestProgress && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
            Latest Progress Entry
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                Recorded on {formatDate(latestProgress.measurementDate)}
              </div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {latestProgress.weightKg && (
                  <div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Weight: </span>
                    <span style={{ fontWeight: '600' }}>{latestProgress.weightKg}kg</span>
                  </div>
                )}
                {latestProgress.bodyFatPercentage && (
                  <div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Body Fat: </span>
                    <span style={{ fontWeight: '600' }}>{latestProgress.bodyFatPercentage}%</span>
                  </div>
                )}
                {latestProgress.muscleMassKg && (
                  <div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Muscle Mass: </span>
                    <span style={{ fontWeight: '600' }}>{latestProgress.muscleMassKg}kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Workouts */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
          Recent Workouts
        </h3>
        {recentWorkouts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentWorkouts.map((workout) => (
              <div
                key={workout.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                    {workout.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {workout.scheduledDate && formatDate(workout.scheduledDate)}
                    {workout.durationMinutes && ` • ${workout.durationMinutes} min`}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  backgroundColor: `${getStatusColor(workout.status)}20`,
                  color: getStatusColor(workout.status),
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {getStatusIcon(workout.status)}
                  {workout.status.toLowerCase().replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            padding: '40px 20px',
            fontStyle: 'italic'
          }}>
            No workouts yet. Create your first workout to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;