import React from 'react';
import { Exercise, MuscleGroup } from '../../types/api';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800';
      case 'EXPERT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'STRENGTH':
        return 'bg-blue-100 text-blue-800';
      case 'CARDIO':
        return 'bg-red-100 text-red-800';
      case 'FLEXIBILITY':
        return 'bg-green-100 text-green-800';
      case 'SPORTS':
        return 'bg-purple-100 text-purple-800';
      case 'REHABILITATION':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEquipment = (equipment: string): string => {
    return equipment.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatMuscleGroup = (muscle: MuscleGroup): string => {
    return muscle.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDifficulty = (difficulty: string): string => {
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
  };

  return (
    <div
      onClick={() => onClick(exercise)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden"
    >
      {/* Header with difficulty and category */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {formatDifficulty(exercise.difficulty)}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
            {exercise.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {exercise.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {exercise.description}
        </p>
      </div>

      {/* Equipment */}
      <div className="px-4 py-2 bg-gray-50">
        <div className="flex items-center">
          <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
          </svg>
          <span className="text-xs text-gray-600 font-medium">
            {formatEquipment(exercise.equipment)}
          </span>
        </div>
      </div>

      {/* Primary Muscles */}
      <div className="px-4 py-3">
        {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
          <div className="mb-2">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Primary Muscles</h4>
            <div className="flex flex-wrap gap-1">
              {exercise.primaryMuscles.slice(0, 3).map((muscle, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium"
                >
                  {formatMuscleGroup(muscle)}
                </span>
              ))}
              {exercise.primaryMuscles.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                  +{exercise.primaryMuscles.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Secondary Muscles */}
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-1">Secondary Muscles</h4>
            <div className="flex flex-wrap gap-1">
              {exercise.secondaryMuscles.slice(0, 2).map((muscle, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium"
                >
                  {formatMuscleGroup(muscle)}
                </span>
              ))}
              {exercise.secondaryMuscles.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
                  +{exercise.secondaryMuscles.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Click for details
          </span>
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;