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
    if (minutes === undefined || minutes === null) return '';
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
      style={{
        border: '1.5px solid rgba(178, 190, 195, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-md)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1" style={{ paddingRight: '12px' }}>
          <h3 className="text-h4 text-white group-hover:text-primary transition-colors" style={{
            textAlign: 'left',
            marginBottom: '8px',
            lineHeight: '1.3'
          }}>
            {workout.name}
          </h3>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span className="text-caption" style={{
            color: workout.status === 'COMPLETED' ? '#10b981' :
                   workout.status === 'IN_PROGRESS' ? '#3b82f6' :
                   workout.status === 'PLANNED' ? '#f59e0b' : '#6b7280',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.7rem'
          }}>
            {formatStatus(workout.status)}
          </span>
        </div>
      </div>

      {/* Description */}
      {workout.description && (
        <p className="text-body-sm" style={{
          textAlign: 'left',
          color: '#CBD5E0',
          marginBottom: '16px',
          lineHeight: '1.5'
        }}>
          {workout.description}
        </p>
      )}

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: '12px' }}></div>

      {/* Stats Section */}
      <div style={{
        paddingTop: '12px',
        marginBottom: '16px',
        borderTop: '1px solid rgba(178, 190, 195, 0.15)'
      }}>
        {((workout.status === 'COMPLETED' && workout.durationMinutes !== undefined) || (workout.durationMinutes && workout.durationMinutes > 0) || (workout.caloriesBurned && workout.caloriesBurned > 0)) && (
          <div style={{ display: 'flex', gap: '16px' }}>
            {((workout.status === 'COMPLETED' && workout.durationMinutes !== undefined) || (workout.durationMinutes && workout.durationMinutes > 0)) && (
              <div className="flex items-center gap-xs">
                <Clock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                <span className="text-body-sm" style={{ color: '#9CA3AF' }}>{formatDuration(workout.durationMinutes)}</span>
              </div>
            )}

            {workout.caloriesBurned && workout.caloriesBurned > 0 && (
              <div className="flex items-center gap-xs">
                <Flame className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                <span className="text-body-sm" style={{ color: '#9CA3AF' }}>{workout.caloriesBurned} cal</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(178, 190, 195, 0.2)' }}>
        <span className="text-body-sm" style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
          {workout.status === 'COMPLETED' && workout.completedAt && `Completed ${formatDate(workout.completedAt)}`}
          {workout.status === 'IN_PROGRESS' && workout.startedAt && `Started ${formatDate(workout.startedAt)}`}
          {workout.status === 'PLANNED' && workout.scheduledDate && `Scheduled for ${formatDate(workout.scheduledDate)}`}
          {workout.status === 'PLANNED' && !workout.scheduledDate && `Created ${formatDate(workout.createdAt)}`}
        </span>
        <ArrowRight className="h-4 w-4 group-hover:text-primary group-hover:translate-x-1 transition-all" style={{ color: '#9CA3AF' }} />
      </div>
    </div>
  );
};

export default WorkoutCard;
