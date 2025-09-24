import React, { useState, useEffect } from 'react';
import { exerciseApi } from '../services/api';
import { Exercise, PageResponse } from '../types/api';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ExerciseDetail from '../components/exercises/ExerciseDetail';
import FilterBar from '../components/exercises/FilterBar';

const ExerciseLibrary: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const pageSize = 12;

  const loadExercises = async (page: number = 0) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedEquipment && { equipment: selectedEquipment }),
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
      };

      const response: PageResponse<Exercise> = await exerciseApi.getExercises(params);
      setExercises(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load exercises. Please try again.');
      console.error('Error loading exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises(0);
  }, [searchTerm, selectedCategory, selectedEquipment, selectedDifficulty]);

  const handlePageChange = (page: number) => {
    loadExercises(page);
  };

  const handleFilterChange = (filters: {
    search: string;
    category: string;
    equipment: string;
    difficulty: string;
  }) => {
    setSearchTerm(filters.search);
    setSelectedCategory(filters.category);
    setSelectedEquipment(filters.equipment);
    setSelectedDifficulty(filters.difficulty);
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
  };

  if (loading && exercises.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Library</h1>
        <p className="text-gray-600">
          Discover exercises to build your perfect workout. Browse by category, equipment, or difficulty level.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        onFilterChange={handleFilterChange}
        initialFilters={{
          search: searchTerm,
          category: selectedCategory,
          equipment: selectedEquipment,
          difficulty: selectedDifficulty,
        }}
      />

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `Showing ${exercises.length} of ${totalElements} exercises`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Exercise Grid */}
      {exercises.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={handleExerciseClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === i
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters to find exercises.
            </p>
          </div>
        )
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ExerciseLibrary;