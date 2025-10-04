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
  PlayCircle,
  ArrowRight
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
                <button
                  onClick={() => navigate('/workouts')}
                  className="btn btn-primary hover-glow"
                  style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}
                >
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
            <div className="flex-col-center fade-in" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <h3 className="text-h4 text-primary">No workouts yet</h3>
              <p className="text-body text-secondary">
                Get started by creating your first workout!
              </p>
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => navigate('/workouts')}
                  className="btn btn-primary hover-glow"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Create Workout
                </button>
              </div>
            </div>
          ) : (
            <div className="grid-auto-fit stagger-in">
              {recentWorkouts.map((workout) => {
                const formatDuration = (minutes?: number): string => {
                  if (minutes === undefined || minutes === null) return '';
                  const hours = Math.floor(minutes / 60);
                  const mins = minutes % 60;
                  if (hours > 0) {
                    return `${hours}h ${mins}m`;
                  }
                  return `${mins}m`;
                };

                const formatStatus = (status: string): string => {
                  return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
                };

                return (
                  <div
                    key={workout.id}
                    onClick={() => handleWorkoutClick(workout)}
                    className="card cursor-pointer group"
                    style={{
                      border: '1.5px solid rgba(178, 190, 195, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 'var(--space-md)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1" style={{ paddingRight: '12px' }}>
                        <h3 className="text-h4 text-white group-hover:text-primary transition-colors" style={{
                          textAlign: 'left',
                          marginBottom: '8px',
                          lineHeight: '1.3'
                        }}>
                          {workout.name}
                        </h3>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span className="text-caption" style={{
                          color: workout.status === 'COMPLETED' ? '#10b981' :
                                 workout.status === 'IN_PROGRESS' ? '#3b82f6' :
                                 workout.status === 'PLANNED' ? '#f59e0b' : '#6b7280',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontSize: '0.7rem'
                        }}>
                          {formatStatus(workout.status)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {workout.description && (
                      <p className="text-body-sm" style={{
                        textAlign: 'left',
                        color: '#CBD5E0',
                        marginBottom: '16px',
                        lineHeight: '1.5'
                      }}>
                        {workout.description}
                      </p>
                    )}

                    {/* Spacer */}
                    <div style={{ flex: 1, minHeight: '12px' }}></div>

                    {/* Stats Section */}
                    <div style={{
                      paddingTop: '12px',
                      marginBottom: '16px',
                      borderTop: '1px solid rgba(178, 190, 195, 0.15)'
                    }}>
                      {((workout.status === 'COMPLETED' && workout.durationMinutes !== undefined) || (workout.durationMinutes && workout.durationMinutes > 0) || (workout.caloriesBurned && workout.caloriesBurned > 0)) && (
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {((workout.status === 'COMPLETED' && workout.durationMinutes !== undefined) || (workout.durationMinutes && workout.durationMinutes > 0)) && (
                            <div className="flex items-center gap-xs">
                              <Clock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                              <span className="text-body-sm" style={{ color: '#9CA3AF' }}>{formatDuration(workout.durationMinutes)}</span>
                            </div>
                          )}

                          {workout.caloriesBurned && workout.caloriesBurned > 0 && (
                            <div className="flex items-center gap-xs">
                              <Flame className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                              <span className="text-body-sm" style={{ color: '#9CA3AF' }}>{workout.caloriesBurned} cal</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(178, 190, 195, 0.2)' }}>
                      <span className="text-body-sm" style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                        {workout.status === 'COMPLETED' && workout.completedAt && `Completed ${formatDate(workout.completedAt)}`}
                        {workout.status === 'IN_PROGRESS' && workout.startedAt && `Started ${formatDate(workout.startedAt)}`}
                        {workout.status === 'PLANNED' && workout.scheduledDate && `Scheduled for ${formatDate(workout.scheduledDate)}`}
                        {workout.status === 'PLANNED' && !workout.scheduledDate && `Created ${formatDate(workout.createdAt)}`}
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:text-primary group-hover:translate-x-1 transition-all" style={{ color: '#9CA3AF' }} />
                    </div>
                  </div>
                );
              })}
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