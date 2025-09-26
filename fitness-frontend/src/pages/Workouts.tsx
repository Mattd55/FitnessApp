import React, { useState, useEffect } from 'react';
import { workoutApi } from '../services/api';
import { Workout, PageResponse } from '../types/api';
import WorkoutCard from '../components/workouts/WorkoutCard';
import CreateWorkoutModal from '../components/workouts/CreateWorkoutModal';
import WorkoutDetailModal from '../components/workouts/WorkoutDetailModal';

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'planned' | 'in_progress' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 12;

  const loadWorkouts = async (page: number = 0) => {
    try {
      setLoading(true);
      const response: PageResponse<Workout> = await workoutApi.getWorkouts(page, pageSize);
      setWorkouts(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load workouts. Please try again.');
      console.error('Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts(0);
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

  const handlePageChange = (page: number) => {
    loadWorkouts(page);
  };

  const filteredWorkouts = getFilteredWorkouts();
  const tabCounts = getTabCounts();

  if (loading && workouts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">My Workouts</h1>
          <button
            onClick={handleCreateWorkout}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Workout
          </button>
        </div>
        <p className="text-gray-600">
          Plan, track, and manage your fitness workouts
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'all', label: 'All Workouts', count: tabCounts.all },
            { id: 'planned', label: 'Planned', count: tabCounts.planned },
            { id: 'in_progress', label: 'In Progress', count: tabCounts.in_progress },
            { id: 'completed', label: 'Completed', count: tabCounts.completed },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Workout Grid */}
      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'all' ? 'No workouts yet' : `No ${activeTab.replace('_', ' ')} workouts`}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'all'
              ? 'Get started by creating your first workout plan!'
              : `You don't have any ${activeTab.replace('_', ' ')} workouts.`
            }
          </p>
          {activeTab === 'all' && (
            <button
              onClick={handleCreateWorkout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Your First Workout
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={handleWorkoutClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === i
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      )}

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
  );
};

export default Workouts;