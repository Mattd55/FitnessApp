import React from 'react';
import { Workout } from '../../types/api';
import { Calendar, Clock, Flame, Trophy, Activity, Target, ArrowRight } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onClick: (workout: Workout) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return { class: 'badge-warning', icon: Target };
      case 'IN_PROGRESS':
        return { class: 'badge-info', icon: Activity };
      case 'COMPLETED':
        return { class: 'badge-success', icon: Trophy };
      case 'CANCELLED':
        return { class: 'badge-error', icon: null };
      case 'SKIPPED':
        return { class: 'badge-secondary', icon: null };
      default:
        return { class: 'badge-secondary', icon: null };
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

  const statusBadge = getStatusBadge(workout.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div
      onClick={() => onClick(workout)}
      className="card cursor-pointer group"
      style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', display: 'flex', flexDirection: 'column', minHeight: '200px' }}
    >
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-h4 text-white group-hover:text-primary transition-colors">
            {workout.name}
          </h3>
          <span className={`badge ${statusBadge.class}`}>
            {formatStatus(workout.status)}
          </span>
        </div>

        <div style={{ minHeight: '40px', textAlign: 'left' }}>
          {workout.description && (
            <p className="text-body-sm text-secondary line-clamp-2" style={{ textAlign: 'left' }}>
              {workout.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-md mb-4" style={{ marginTop: 'auto' }}>
        {workout.scheduledDate && (
          <div className="flex items-center gap-xs">
            <Calendar className="h-4 w-4 text-light" />
            <span className="text-body-sm text-light">{formatDate(workout.scheduledDate)}</span>
          </div>
        )}

        {workout.durationMinutes && (
          <div className="flex items-center gap-xs">
            <Clock className="h-4 w-4 text-light" />
            <span className="text-body-sm text-light">{formatDuration(workout.durationMinutes)}</span>
          </div>
        )}

        {workout.caloriesBurned && workout.caloriesBurned > 0 && (
          <div className="flex items-center gap-xs">
            <Flame className="h-4 w-4 text-light" />
            <span className="text-body-sm text-light">{workout.caloriesBurned} cal</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(45, 52, 54, 0.1)' }}>
        <span className="text-body-sm text-light">
          {workout.status === 'COMPLETED' && workout.completedAt && `Completed ${formatDate(workout.completedAt)}`}
          {workout.status === 'IN_PROGRESS' && workout.startedAt && `Started ${formatDate(workout.startedAt)}`}
          {workout.status === 'PLANNED' && !workout.scheduledDate && `Created ${formatDate(workout.createdAt)}`}
          {workout.status === 'PLANNED' && workout.scheduledDate && 'Scheduled'}
        </span>
        <ArrowRight className="h-4 w-4 text-light group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default WorkoutCard;
