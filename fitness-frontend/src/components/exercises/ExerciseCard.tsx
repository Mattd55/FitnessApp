import React from 'react';
import { Exercise, MuscleGroup } from '../../types/api';
import { Dumbbell, ArrowRight } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  const formatEquipment = (equipment: string): string => {
    if (equipment.toUpperCase() === 'NONE') {
      return 'No Equipment';
    }
    return equipment.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatMuscleGroup = (muscle: MuscleGroup): string => {
    return muscle.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div
      onClick={() => onClick(exercise)}
      className="card cursor-pointer group relative overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-5" style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-neutral-50">
            <span className="text-xs font-medium text-light">
              {exercise.category}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all duration-300 text-white">
          {exercise.name}
        </h3>

        <p className="text-sm leading-relaxed text-light" style={{ overflow: 'hidden' }}>
          {exercise.description.length > 100
            ? `${exercise.description.substring(0, 100)}...`
            : exercise.description}
        </p>
      </div>

      {/* Muscles Section */}
      <div className="p-5 space-y-4 flex-grow">
        {/* Primary Muscles */}
        {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-2 text-secondary">
              Primary Muscles
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.primaryMuscles.slice(0, 3).map((muscle, index) => (
                <span
                  key={index}
                  className="badge badge-primary"
                >
                  {formatMuscleGroup(muscle)}
                </span>
              ))}
              {exercise.primaryMuscles.length > 3 && (
                <span className="badge badge-secondary">
                  +{exercise.primaryMuscles.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Secondary Muscles */}
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-2 text-light">
              Secondary
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.secondaryMuscles.slice(0, 2).map((muscle, index) => (
                <span
                  key={index}
                  className="badge badge-secondary"
                >
                  {formatMuscleGroup(muscle)}
                </span>
              ))}
              {exercise.secondaryMuscles.length > 2 && (
                <span className="text-xs text-light">
                  +{exercise.secondaryMuscles.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Group - Equipment & Click for Details */}
      <div className="mt-auto">
        {/* Equipment Section */}
        <div className="px-5 py-3 bg-primary-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                {formatEquipment(exercise.equipment)}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-accent"></div>
          </div>
        </div>

        {/* Click for Details */}
        <div className="px-5 py-4 border-t" style={{
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderTopColor: 'rgba(255, 107, 107, 0.2)'
        }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: '#FF6B6B' }}>
              Click for details
            </span>
            <div className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-200">
              <ArrowRight className="h-4 w-4" style={{ color: '#FF6B6B' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;