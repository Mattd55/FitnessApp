import React from 'react';
import { Exercise, MuscleGroup } from '../../types/api';

interface ExerciseDetailProps {
  exercise: Exercise;
  onClose: () => void;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise, onClose }) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EXPERT':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'STRENGTH':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
          </svg>
        );
      case 'CARDIO':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'FLEXIBILITY':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'SPORTS':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12.414 11.414a1 1 0 00.707.293H15M6 20l4-16m4 16l-4-16" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
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

  const formatInstructions = (instructions: string): string[] => {
    // Split instructions by common separators and clean them up
    return instructions
      .split(/\d+\.\s|\n|\.\s/)
      .map(step => step.trim())
      .filter(step => step.length > 10); // Filter out very short fragments
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const instructionSteps = formatInstructions(exercise.instructions);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-indigo-600">
                  {getCategoryIcon(exercise.category)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
              </div>
              <p className="text-gray-600 text-lg">{exercise.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Difficulty */}
            <div className={`p-4 rounded-lg border ${getDifficultyColor(exercise.difficulty)}`}>
              <h3 className="font-medium text-sm mb-1">Difficulty Level</h3>
              <p className="text-lg font-semibold">{formatDifficulty(exercise.difficulty)}</p>
            </div>

            {/* Category */}
            <div className="p-4 rounded-lg border bg-blue-50 text-blue-800 border-blue-200">
              <h3 className="font-medium text-sm mb-1">Category</h3>
              <p className="text-lg font-semibold">{exercise.category}</p>
            </div>

            {/* Equipment */}
            <div className="p-4 rounded-lg border bg-gray-50 text-gray-800 border-gray-200">
              <h3 className="font-medium text-sm mb-1">Equipment</h3>
              <p className="text-lg font-semibold">{formatEquipment(exercise.equipment)}</p>
            </div>
          </div>

          {/* Muscle Groups */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Targeted Muscles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Muscles */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                  Primary Muscles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.primaryMuscles.map((muscle, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium"
                    >
                      {formatMuscleGroup(muscle)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Secondary Muscles */}
              {exercise.secondaryMuscles.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                    Secondary Muscles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map((muscle, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                      >
                        {formatMuscleGroup(muscle)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Perform</h3>

            {instructionSteps.length > 1 ? (
              <ol className="space-y-4">
                {instructionSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{exercise.instructions}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
              Add to Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;