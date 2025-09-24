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
  Zap
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Ready to crush your fitness goals today?
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Workouts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {recentWorkouts.filter(w => w.status === 'COMPLETED').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Week
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {recentWorkouts.filter(w => {
                      const workoutDate = new Date(w.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return workoutDate > weekAgo && w.status === 'COMPLETED';
                    }).length} workouts
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current Weight
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {latestProgress?.weightKg ? `${latestProgress.weightKg} kg` : 'Not recorded'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Plans
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {recentWorkouts.filter(w => w.status === 'PLANNED').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Workouts
            </h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          {recentWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first workout!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{workout.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(workout.createdAt)}
                        {workout.durationMinutes && ` • ${workout.durationMinutes} minutes`}
                      </p>
                      {workout.description && (
                        <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(workout.status)}`}>
                        {workout.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      {latestProgress && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Latest Progress Entry
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestProgress.weightKg && (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {latestProgress.weightKg}
                  </div>
                  <div className="text-sm text-gray-500">Weight (kg)</div>
                </div>
              )}
              {latestProgress.bodyFatPercentage && (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {latestProgress.bodyFatPercentage}%
                  </div>
                  <div className="text-sm text-gray-500">Body Fat</div>
                </div>
              )}
              {latestProgress.muscleMassKg && (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {latestProgress.muscleMassKg}
                  </div>
                  <div className="text-sm text-gray-500">Muscle Mass (kg)</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(latestProgress.measurementDate)}
                </div>
                <div className="text-sm text-gray-500">Last Updated</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;