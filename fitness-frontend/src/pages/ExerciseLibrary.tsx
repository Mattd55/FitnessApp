import React, { useState, useEffect, useCallback } from 'react';
import { exerciseApi } from '../services/api';
import { Exercise, PageResponse } from '../types/api';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ExerciseDetailSimple from '../components/exercises/ExerciseDetailSimple';
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

  const loadExercises = useCallback(async (page: number = 0) => {
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
  }, [searchTerm, selectedCategory, selectedEquipment, selectedDifficulty]);

  useEffect(() => {
    loadExercises(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedEquipment, selectedDifficulty]);

  const handlePageChange = (page: number) => {
    loadExercises(page);
  };

  const handleFilterChange = useCallback((filters: {
    search: string;
    category: string;
    equipment: string;
    difficulty: string;
  }) => {
    setSearchTerm(filters.search);
    setSelectedCategory(filters.category);
    setSelectedEquipment(filters.equipment);
    setSelectedDifficulty(filters.difficulty);
  }, []);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Library</h1>
        <p className="text-gray-600">
          Discover exercises to build your perfect workout routine
        </p>
      </div>

      <FilterBar
        initialFilters={{
          search: searchTerm,
          category: selectedCategory,
          equipment: selectedEquipment,
          difficulty: selectedDifficulty,
        }}
        onFilterChange={handleFilterChange}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {exercises.length} of {totalElements} exercises
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onClick={handleExerciseClick}
          />
        ))}
      </div>

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

      {selectedExercise && (
        <ExerciseDetailSimple
          exercise={selectedExercise}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ExerciseLibrary;