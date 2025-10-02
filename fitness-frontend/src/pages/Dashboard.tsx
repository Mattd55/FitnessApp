import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { workoutApi, userApi } from '../services/api';
import { Workout, UserProgress } from '../types/api';
import {
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  Target,
  Flame,
  Trophy,
  ArrowUp,
  PlayCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [latestProgress, setLatestProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [workoutsResponse, progressResponse] = await Promise.allSettled([
        workoutApi.getWorkouts(0, 5),
        userApi.getLatestProgress(),
      ]);

      if (workoutsResponse.status === 'fulfilled') {
        setRecentWorkouts(workoutsResponse.value.content);
      }

      if (progressResponse.status === 'fulfilled') {
        setLatestProgress(progressResponse.value);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PLANNED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        {/* Welcome Header */}
        <div className="card card-elevated hover-lift">
          <div className="header-section-horizontal">
            <div className="flex-1">
              <h1 className="text-h1 text-primary">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-body-lg text-secondary">
                Ready to crush your fitness goals today?
              </p>
              <div className="flex items-center justify-center gap-md mt-6">
                <button className="btn btn-primary hover-glow" style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Workout
                </button>
                <button className="btn btn-outline hover-lift" style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}>
                  <Target className="h-5 w-5 mr-2" />
                  Set Goals
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-4 stagger-in">
          <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
            <h3 className="text-caption text-light mb-4">
              Total Workouts
            </h3>
            <p className="text-h2 text-white" style={{ marginTop: 'auto' }}>
              {recentWorkouts.filter(w => w.status === 'COMPLETED').length}
            </p>
          </div>

          <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
            <h3 className="text-caption text-light mb-4">
              This Week
            </h3>
            <p className="text-h2 text-white" style={{ marginTop: 'auto' }}>
              {recentWorkouts.filter(w => {
                const workoutDate = new Date(w.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return workoutDate > weekAgo && w.status === 'COMPLETED';
              }).length}
            </p>
          </div>

          <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
            <h3 className="text-caption text-light mb-4">
              Current Weight
            </h3>
            <p className="text-h2 text-white" style={{ marginTop: 'auto' }}>
              {latestProgress?.weightKg ? `${latestProgress.weightKg} kg` : 'N/A'}
            </p>
          </div>

          <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
            <h3 className="text-caption text-light mb-4">
              Active Plans
            </h3>
            <p className="text-h2 text-white" style={{ marginTop: 'auto' }}>
              {recentWorkouts.filter(w => w.status === 'PLANNED').length}
            </p>
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="card slide-in-right">
          <div className="header-section">
            <div>
              <h3 className="text-h3 text-white">
                Recent Workouts
              </h3>
              <p className="text-body-sm text-light">
                Your latest training sessions
              </p>
            </div>
          </div>

          {recentWorkouts.length === 0 ? (
            <div className="flex-col-center py-12 fade-in">
              <div className="bg-primary p-4 rounded-2xl w-16 h-16 mb-4 flex-center">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-h4 text-primary">No workouts yet</h3>
              <p className="text-body text-secondary">
                Get started by creating your first workout!
              </p>
              <div className="mt-4">
                <button className="btn btn-primary hover-glow">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Create Workout
                </button>
              </div>
            </div>
          ) : (
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
                <div className="flex items-start gap-md">
                  {/* Status Icon */}
                  <div className={`p-3 rounded-xl ${
                    workout.status === 'COMPLETED' ? 'bg-success' :
                    workout.status === 'IN_PROGRESS' ? 'bg-info' :
                    'bg-warning'
                  }`}>
                    {workout.status === 'COMPLETED' ? (
                      <Trophy className="h-5 w-5 text-white" />
                    ) : workout.status === 'IN_PROGRESS' ? (
                      <Activity className="h-5 w-5 text-white" />
                    ) : (
                      <Target className="h-5 w-5 text-white" />
                    )}
                  </div>

                  {/* Workout Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-h4 text-white">{workout.name}</h4>
                        {workout.description && (
                          <p className="text-body-sm text-secondary mt-1">{workout.description}</p>
                        )}
                      </div>
                      <span className={`badge ${
                        workout.status === 'COMPLETED' ? 'badge-success' :
                        workout.status === 'IN_PROGRESS' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {workout.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-lg mt-3">
                      <span className="text-body-sm text-light">
                        {formatDate(workout.createdAt)}
                      </span>
                      {workout.durationMinutes && (
                        <span className="text-body-sm text-light">
                          {workout.durationMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Summary */}
        {latestProgress && (
          <div className="card slide-in-left">
            <div className="header-section">
              <div>
                <h3 className="text-h3 text-white">
                  Latest Progress Entry
                </h3>
                <p className="text-body-sm text-light">
                  Track your fitness journey
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-md">
              {latestProgress.weightKg && (
                <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                  <div className="text-h2 text-white">
                    {latestProgress.weightKg}
                  </div>
                  <div className="text-caption text-light">Weight (kg)</div>
                </div>
              )}
              {latestProgress.bodyFatPercentage && (
                <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                  <div className="text-h2 text-white">
                    {latestProgress.bodyFatPercentage}%
                  </div>
                  <div className="text-caption text-light">Body Fat</div>
                </div>
              )}
              {latestProgress.muscleMassKg && (
                <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                  <div className="text-h2 text-white">
                    {latestProgress.muscleMassKg}
                  </div>
                  <div className="text-caption text-light">Muscle Mass (kg)</div>
                </div>
              )}
              <div className="card card-compact flex-col-center hover-scale" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
                <div className="text-h4 text-white">
                  {formatDate(latestProgress.measurementDate)}
                </div>
                <div className="text-caption text-light">Last Updated</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;