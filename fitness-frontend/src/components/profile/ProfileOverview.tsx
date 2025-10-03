import React, { useState, useEffect } from 'react';
import { User, UserProgress, Workout, Goal } from '../../types/api';
import { userApi, workoutApi, goalApi } from '../../services/api';
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
    currentStreak: 0,
    totalTrainingTime: 0,
    activeGoals: 0,
    weekWorkouts: 0,
    avgWorkoutsPerWeek: 0
  });

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      const progress = await userApi.getLatestProgress().catch(() => null);
      setLatestProgress(progress);

      // Load all workouts for calculations
      const workoutsResponse = await workoutApi.getWorkouts(0, 1000);
      const workouts = workoutsResponse.content;
      setRecentWorkouts(workouts.slice(0, 5));

      // Load goals
      const goalsResponse = await goalApi.getGoals(0, 1000).catch(() => ({ content: [] }));
      const activeGoalsCount = goalsResponse.content.filter((g: Goal) => g.status === 'ACTIVE').length;

      const completedWorkouts = workouts.filter(w => w.status === 'COMPLETED');
      const currentStreak = calculateWorkoutStreak(workouts);

      // Calculate total training time (from completed workouts with duration)
      const totalTrainingTime = completedWorkouts.reduce((total, w) =>
        total + (w.durationMinutes || 0), 0
      );

      // Calculate workouts this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);
      const weekWorkouts = completedWorkouts.filter(w => {
        const completedDate = new Date(w.completedAt || w.createdAt);
        return completedDate >= weekStart;
      }).length;

      // Calculate average workouts per week
      const userCreatedDate = new Date(userProfile.createdAt);
      const weeksActive = Math.max(1, Math.ceil((new Date().getTime() - userCreatedDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
      const avgWorkoutsPerWeek = completedWorkouts.length > 0
        ? Math.round((completedWorkouts.length / weeksActive) * 10) / 10
        : 0;

      setStats({
        totalWorkouts: workouts.length,
        completedWorkouts: completedWorkouts.length,
        currentStreak,
        totalTrainingTime,
        activeGoals: activeGoalsCount,
        weekWorkouts,
        avgWorkoutsPerWeek
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

  const formatTrainingTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Workout Stats */}
      <div className="card card-compact hover-lift">
        <h3 className="text-h4 text-white mb-4">Workout Activity</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.completedWorkouts}
            </div>
            <div className="text-caption text-light">Total Completed</div>
          </div>
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.weekWorkouts}
            </div>
            <div className="text-caption text-light">This Week</div>
          </div>
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.avgWorkoutsPerWeek}
            </div>
            <div className="text-caption text-light">Weekly Average</div>
          </div>
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-caption text-light">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="card card-compact hover-lift">
        <h3 className="text-h4 text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {formatTrainingTime(stats.totalTrainingTime)}
            </div>
            <div className="text-caption text-light">Total Time Trained</div>
          </div>
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.activeGoals}
            </div>
            <div className="text-caption text-light">Active Goals</div>
          </div>
          {stats.totalWorkouts > 0 && (
            <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
              <div className="text-h1 text-white mb-1">
                {Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100)}%
              </div>
              <div className="text-caption text-light">Completion Rate</div>
            </div>
          )}
          <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div className="text-h1 text-white mb-1">
              {stats.totalWorkouts - stats.completedWorkouts}
            </div>
            <div className="text-caption text-light">Planned Workouts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
