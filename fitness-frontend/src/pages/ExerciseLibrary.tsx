import React, { useState, useEffect, useCallback } from 'react';
import { exerciseApi } from '../services/api';
import { Exercise, PageResponse } from '../types/api';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ExerciseDetail from '../components/exercises/ExerciseDetail';
import FilterBar from '../components/exercises/FilterBar';
import { Dumbbell, Search } from 'lucide-react';

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
      <div className="flex items-center justify-center h-64">
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
                Exercise Library
              </h1>
              <p className="text-body-lg text-secondary">
                Discover exercises to build your perfect workout routine
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="slide-in-right">
          <FilterBar
            initialFilters={{
              search: searchTerm,
              category: selectedCategory,
              equipment: selectedEquipment,
              difficulty: selectedDifficulty,
            }}
            onFilterChange={handleFilterChange}
          />
        </div>

        {error && (
          <div className="card" style={{ backgroundColor: '#fee2e2', borderColor: '#f87171', color: '#b91c1c' }}>
            {error}
          </div>
        )}

        {/* Results count */}
        <div className="slide-in-left">
          <p className="text-body-sm text-light">
            Showing {exercises.length} of {totalElements} exercises
          </p>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-in">
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
          <div className="flex justify-center fade-in">
            <nav className="flex gap-sm">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`btn hover-lift ${
                    currentPage === i
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

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
