import React, { useState, useEffect } from 'react';
import { workoutApi } from '../services/api';
import { Workout, PageResponse } from '../types/api';
import WorkoutCard from '../components/workouts/WorkoutCard';
import CreateWorkoutModal from '../components/workouts/CreateWorkoutModal';
import WorkoutDetailModal from '../components/workouts/WorkoutDetailModal';
import { Plus, Activity, Target, Clock, Trophy } from 'lucide-react';

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'planned' | 'in_progress' | 'completed'>('all');

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response: PageResponse<Workout> = await workoutApi.getWorkouts(0, 50);
      setWorkouts(response.content);
    } catch (err) {
      setError('Failed to load workouts. Please try again.');
      console.error('Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
  };

  const handleCreateWorkout = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleWorkoutCreated = (newWorkout: Workout) => {
    setWorkouts(prev => [newWorkout, ...prev]);
    setShowCreateModal(false);
  };

  const handleWorkoutUpdated = (updatedWorkout: Workout) => {
    setWorkouts(prev =>
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
    setSelectedWorkout(updatedWorkout);
  };

  const handleWorkoutDeleted = (workoutId: number) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    setSelectedWorkout(null);
  };

  const getFilteredWorkouts = () => {
    if (activeTab === 'all') return workouts;
    return workouts.filter(workout => {
      switch (activeTab) {
        case 'planned':
          return workout.status === 'PLANNED';
        case 'in_progress':
          return workout.status === 'IN_PROGRESS';
        case 'completed':
          return workout.status === 'COMPLETED';
        default:
          return true;
      }
    });
  };

  const getTabCounts = () => {
    return {
      all: workouts.length,
      planned: workouts.filter(w => w.status === 'PLANNED').length,
      in_progress: workouts.filter(w => w.status === 'IN_PROGRESS').length,
      completed: workouts.filter(w => w.status === 'COMPLETED').length,
    };
  };

  const filteredWorkouts = getFilteredWorkouts();
  const tabCounts = getTabCounts();

  if (loading && workouts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        {/* Header Card */}
        <div className="card card-elevated hover-lift">
          <div className="header-section-horizontal">
            <div className="flex-1">
              <h1 className="text-h1 text-primary">
                My Workouts
              </h1>
              <p className="text-body-lg text-secondary">
                Plan, track, and manage your workouts
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateWorkout}
                  className="btn btn-primary hover-glow"
                  style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Workout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="card">
          <div className="flex gap-md justify-between">
            <button
              onClick={() => setActiveTab('all')}
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'} flex-1`}
            >
              All Workouts ({tabCounts.all})
            </button>
            <button
              onClick={() => setActiveTab('planned')}
              className={`btn ${activeTab === 'planned' ? 'btn-primary' : 'btn-outline'} flex-1`}
            >
              Planned ({tabCounts.planned})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`btn ${activeTab === 'in_progress' ? 'btn-primary' : 'btn-outline'} flex-1`}
            >
              Active ({tabCounts.in_progress})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'} flex-1`}
            >
              Completed ({tabCounts.completed})
            </button>
          </div>
        </div>

        {error && (
          <div className="card border-l-4 border-error bg-red-50">
            <p className="text-error font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Workout Grid */}
        <div className="card" style={{ maxHeight: '800px', overflow: 'hidden', padding: '0' }}>
          <div style={{ maxHeight: '800px', overflowY: 'auto', overflowX: 'hidden' }}>
            {filteredWorkouts.length === 0 ? (
            <div className="flex-col-center py-12 fade-in">
              <h3 className="text-h3 text-white">
                {activeTab === 'all' ? 'No workouts yet' : `No ${activeTab.replace('_', ' ')} workouts`}
              </h3>
              <p className="text-body text-secondary">
                {activeTab === 'all'
                  ? 'Get started by creating your first workout plan!'
                  : `You don't have any ${activeTab.replace('_', ' ')} workouts.`
                }
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={handleCreateWorkout}
                  className="btn btn-primary hover-glow mt-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workout
                </button>
              )}
            </div>
          ) : (
            <div className="grid-auto-fit stagger-in" style={{ padding: 'var(--space-lg)' }}>
              {filteredWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onClick={handleWorkoutClick}
                />
              ))}
            </div>
          )}
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <CreateWorkoutModal
            onClose={handleCloseCreateModal}
            onWorkoutCreated={handleWorkoutCreated}
          />
        )}

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

export default Workouts;