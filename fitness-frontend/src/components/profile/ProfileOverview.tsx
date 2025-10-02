import React, { useState, useEffect } from 'react';
import { User, UserProgress, Workout } from '../../types/api';
import { userApi, workoutApi } from '../../services/api';
import { Calendar, Trophy, Activity, Target } from 'lucide-react';

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
      const progress = await userApi.getLatestProgress().catch(() => null);
      setLatestProgress(progress);

      const workoutsResponse = await workoutApi.getWorkouts(0, 10);
      const workouts = workoutsResponse.content;
      setRecentWorkouts(workouts.slice(0, 5));

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

  return (
    <div className="space-y-6">
      {/* Fitness Stats */}
      <div className="card card-compact hover-lift">
        <h3 className="text-h4 text-white mb-4">Fitness Statistics</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.totalWorkouts}
            </div>
            <div className="text-caption text-light">Total Workouts</div>
          </div>
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.completedWorkouts}
            </div>
            <div className="text-caption text-light">Completed</div>
          </div>
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-caption text-light">Current Streak</div>
          </div>
          {stats.totalWorkouts > 0 && (
            <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
              <div className="text-h1 text-white mb-1">
                {Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100)}%
              </div>
              <div className="text-caption text-light">Completion Rate</div>
            </div>
          )}
        </div>
      </div>

      {/* Latest Progress */}
      {latestProgress && (
        <div className="card card-compact hover-lift">
          <h3 className="text-h4 text-white mb-4">Latest Progress Entry</h3>
          <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-body-sm text-light mb-4">
              Recorded on {formatDate(latestProgress.measurementDate)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {latestProgress.weightKg && (
                <div>
                  <div className="text-caption text-light mb-1">Weight</div>
                  <div className="text-h3 text-white">{latestProgress.weightKg}kg</div>
                </div>
              )}
              {latestProgress.bodyFatPercentage && (
                <div>
                  <div className="text-caption text-light mb-1">Body Fat</div>
                  <div className="text-h3 text-white">{latestProgress.bodyFatPercentage}%</div>
                </div>
              )}
              {latestProgress.muscleMassKg && (
                <div>
                  <div className="text-caption text-light mb-1">Muscle Mass</div>
                  <div className="text-h3 text-white">{latestProgress.muscleMassKg}kg</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Workouts */}
      <div className="card card-compact hover-lift">
        <h3 className="text-h4 text-white mb-4">Recent Workouts</h3>
        {recentWorkouts.length > 0 ? (
          <div className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <div
                key={workout.id}
                className="card hover-lift"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animation: 'fadeIn 0.5s forwards',
                  border: '1.5px solid rgba(178, 190, 195, 0.3)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-h4 text-white">{workout.name}</h4>
                    <div className="flex items-center gap-md mt-2">
                      {workout.scheduledDate && (
                        <span className="text-body-sm text-light">
                          {formatDate(workout.scheduledDate)}
                        </span>
                      )}
                      {workout.durationMinutes && (
                        <span className="text-body-sm text-light">
                          {workout.durationMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`badge ${
                    workout.status === 'COMPLETED' ? 'badge-success' :
                    workout.status === 'IN_PROGRESS' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {workout.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-col-center py-12 fade-in">
            <div className="bg-primary p-4 rounded-2xl w-16 h-16 mb-4 flex-center">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <p className="text-body text-secondary text-center">
              No workouts yet. Create your first workout to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;
