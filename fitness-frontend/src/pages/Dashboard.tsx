import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { workoutApi, userApi } from '../services/api';
import { Workout, UserProgress } from '../types/api';
import WorkoutDetailModal from '../components/workouts/WorkoutDetailModal';
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
  const navigate = useNavigate();
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [latestProgress, setLatestProgress] = useState<UserProgress | null>(null);
  const [personalRecords, setPersonalRecords] = useState<{ exerciseName: string; maxWeight: number; maxReps: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [workoutsResponse, progressResponse, recordsResponse] = await Promise.allSettled([
        workoutApi.getWorkouts(0, 5),
        userApi.getLatestProgress(),
        userApi.getPersonalRecords(),
      ]);

      if (workoutsResponse.status === 'fulfilled') {
        setRecentWorkouts(workoutsResponse.value.content);
      }

      if (progressResponse.status === 'fulfilled') {
        setLatestProgress(progressResponse.value);
      }

      if (recordsResponse.status === 'fulfilled') {
        setPersonalRecords(recordsResponse.value);
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

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
  };

  const handleWorkoutUpdated = (updatedWorkout: Workout) => {
    setRecentWorkouts(prev =>
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
    setSelectedWorkout(updatedWorkout);
  };

  const handleWorkoutDeleted = (workoutId: number) => {
    setRecentWorkouts(prev => prev.filter(w => w.id !== workoutId));
    setSelectedWorkout(null);
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
                <button
                  onClick={() => navigate('/goals')}
                  className="btn btn-outline hover-lift"
                  style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}
                >
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

        {/* Personal Records */}
        <div className="card slide-in-left">
          <div className="header-section">
            <div>
              <h3 className="text-h3 text-white">
                Personal Records
              </h3>
              <p className="text-body-sm text-light">
                Your best lifts across all exercises
              </p>
            </div>
          </div>
          {personalRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalRecords.map((record, index) => (
                <div
                  key={index}
                  className="card card-compact"
                  style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div className="text-body font-semibold text-white">{record.exerciseName}</div>
                    <div className="text-caption text-light">Max Reps: {record.maxReps}</div>
                  </div>
                  <div className="text-h3 text-white">{record.maxWeight}kg</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card card-compact text-center" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
              <Trophy className="h-12 w-12 mx-auto mb-2" style={{ color: 'var(--color-text-light)' }} />
              <p className="text-body text-light">Complete workouts with weights to track your personal records!</p>
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
            <div className="grid-auto-fit stagger-in">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => handleWorkoutClick(workout)}
                  className="card cursor-pointer group"
                  style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', display: 'flex', flexDirection: 'column', minHeight: '200px' }}
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-h4 text-white group-hover:text-primary transition-colors">
                        {workout.name}
                      </h3>
                      <span className={`badge ${
                        workout.status === 'COMPLETED' ? 'badge-success' :
                        workout.status === 'IN_PROGRESS' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {workout.status.charAt(0) + workout.status.slice(1).toLowerCase().replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ minHeight: '40px', textAlign: 'left' }}>
                      {workout.description && (
                        <p className="text-body-sm text-secondary line-clamp-2" style={{ textAlign: 'left' }}>
                          {workout.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-md mb-4" style={{ marginTop: 'auto' }}>
                    {workout.scheduledDate && (
                      <div className="flex items-center gap-xs">
                        <Calendar className="h-4 w-4 text-light" />
                        <span className="text-body-sm text-light">{formatDate(workout.scheduledDate)}</span>
                      </div>
                    )}

                    {workout.durationMinutes && (
                      <div className="flex items-center gap-xs">
                        <Clock className="h-4 w-4 text-light" />
                        <span className="text-body-sm text-light">{workout.durationMinutes}m</span>
                      </div>
                    )}

                    {workout.caloriesBurned && workout.caloriesBurned > 0 && (
                      <div className="flex items-center gap-xs">
                        <Flame className="h-4 w-4 text-light" />
                        <span className="text-body-sm text-light">{workout.caloriesBurned} cal</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(45, 52, 54, 0.1)' }}>
                    <span className="text-body-sm text-light">
                      {workout.status === 'COMPLETED' && workout.completedAt && `Completed ${formatDate(workout.completedAt)}`}
                      {workout.status === 'IN_PROGRESS' && workout.startedAt && `Started ${formatDate(workout.startedAt)}`}
                      {workout.status === 'PLANNED' && !workout.scheduledDate && `Created ${formatDate(workout.createdAt)}`}
                      {workout.status === 'PLANNED' && workout.scheduledDate && 'Scheduled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workout Detail Modal */}
        {selectedWorkout && (
          <WorkoutDetailModal
            workout={selectedWorkout}
            onClose={handleCloseModal}
            onWorkoutUpdated={handleWorkoutUpdated}
            onWorkoutDeleted={handleWorkoutDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;