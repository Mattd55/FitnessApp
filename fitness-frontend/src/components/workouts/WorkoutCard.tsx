import React from 'react';
import { Workout } from '../../types/api';

interface WorkoutCardProps {
  workout: Workout;
  onClick: (workout: Workout) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'SKIPPED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'IN_PROGRESS':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293L12.414 11.414a1 1 0 00.707.293H15M6 20l4-16m4 16l-4-16" />
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
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
      onClick={() => onClick(workout)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(workout.status)}`}>
            {getStatusIcon(workout.status)}
            {formatStatus(workout.status)}
          </span>
          {workout.scheduledDate && (
            <span className="text-xs text-gray-500">
              {formatDate(workout.scheduledDate)}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {workout.name}
        </h3>

        {workout.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {workout.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {workout.durationMinutes && (
            <div className="flex items-center text-gray-600">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formatDuration(workout.durationMinutes)}</span>
            </div>
          )}

          {workout.caloriesBurned && (
            <div className="flex items-center text-gray-600">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span className="font-medium">{workout.caloriesBurned} cal</span>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="mt-2 text-xs text-gray-500">
          {workout.status === 'COMPLETED' && workout.completedAt && (
            <span>Completed {formatDate(workout.completedAt)}</span>
          )}
          {workout.status === 'IN_PROGRESS' && workout.startedAt && (
            <span>Started {formatDate(workout.startedAt)}</span>
          )}
          {workout.status === 'PLANNED' && workout.scheduledDate && (
            <span>Scheduled for {formatDate(workout.scheduledDate)}</span>
          )}
          {!workout.scheduledDate && workout.status === 'PLANNED' && (
            <span>Created {formatDate(workout.createdAt)}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Click to view details
          </span>
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;