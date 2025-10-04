import React, { useState, useEffect } from 'react';
import { goalApi } from '../services/api';
import { Goal } from '../types/api';
import SetGoalModal from '../components/goals/SetGoalModal';
import { Plus, Target, Trophy, Calendar, TrendingUp, CheckCircle, Pause, XCircle } from 'lucide-react';

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSetGoalModal, setShowSetGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await goalApi.getGoals(0, 100);
      setGoals(response.content);
    } catch (err: any) {
      console.error('Error loading goals:', err);
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleGoalCreated = (newGoal: Goal) => {
    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === newGoal.id ? newGoal : g));
    } else {
      setGoals(prev => [newGoal, ...prev]);
    }
    setShowSetGoalModal(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowSetGoalModal(true);
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalApi.deleteGoal(goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (err: any) {
      console.error('Error deleting goal:', err);
      alert('Failed to delete goal');
    }
  };

  const handleCompleteGoal = async (goal: Goal) => {
    try {
      const updatedGoal = await goalApi.updateGoal(goal.id, {
        ...goal,
        status: 'COMPLETED',
        currentValue: goal.targetValue,
      });
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    } catch (err: any) {
      console.error('Error completing goal:', err);
      alert('Failed to complete goal');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />;
      case 'PAUSED':
        return <Pause className="h-5 w-5" style={{ color: '#f59e0b' }} />;
      case 'ABANDONED':
        return <XCircle className="h-5 w-5" style={{ color: '#ef4444' }} />;
      default:
        return <TrendingUp className="h-5 w-5" style={{ color: '#3b82f6' }} />;
    }
  };

  const getGoalTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      WEIGHT_LOSS: '⬇️',
      WEIGHT_GAIN: '⬆️',
      MUSCLE_GAIN: '💪',
      BODY_FAT_REDUCTION: '📉',
      STRENGTH: '🏋️',
      ENDURANCE: '🏃',
      FLEXIBILITY: '🧘',
      WORKOUT_FREQUENCY: '📅',
      PERSONAL_RECORD: '🏆',
      CUSTOM: '🎯',
    };
    return icons[type] || '🎯';
  };

  const calculateProgress = (goal: Goal): number => {
    if (!goal.currentValue || !goal.targetValue || goal.targetValue === 0) {
      return 0;
    }
    const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);

    // Auto-complete goal when it reaches 100%
    if (progress >= 100 && goal.status === 'ACTIVE') {
      handleCompleteGoal(goal);
    }

    return progress;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredGoals = goals.filter(goal => {
    if (filterStatus === 'ALL') return true;
    return goal.status === filterStatus;
  });

  const activeGoals = goals.filter(g => g.status === 'ACTIVE').length;
  const completedGoals = goals.filter(g => g.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
          <p style={{ color: 'var(--color-text-light)' }}>Loading goals...</p>
        </div>
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
                My Goals
              </h1>
              <p className="text-body-lg text-secondary">
                Set and track your fitness goals to stay motivated and achieve success
              </p>
              <div className="flex items-center justify-center gap-md mt-6">
                <button
                  onClick={() => {
                    setEditingGoal(null);
                    setShowSetGoalModal(true);
                  }}
                  className="btn btn-primary hover-glow"
                  style={{ padding: 'var(--space-md) var(--space-xl)', fontSize: 'var(--font-size-md)' }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Set New Goal
                </button>
                <div className="flex items-center gap-xl">
                  <span className="text-body font-medium text-light">
                    {activeGoals} Active
                  </span>
                  <span className="text-body font-medium text-light">
                    {completedGoals} Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="card border-l-4 border-error bg-red-50">
            <p className="text-error font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid-3 stagger-in">
          <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
            <h3 className="text-caption text-light mb-4">
              Active Goals
            </h3>
            <p className="text-h2 text-white" style={{ marginTop: 'auto' }}>
              {activeGoals}
            </p>
          </div>

          <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
            <h3 className="text-caption text-light mb-4">
              Completed
            </h3>
            <p className="text-h2 text-white" style={{ marginTop: 'auto' }}>
              {completedGoals}
            </p>
          </div>

          <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
            <h3 className="text-caption text-light mb-4">
              Total Goals
            </h3>
            <p className="text-h2 text-white" style={{ marginTop: 'auto' }}>
              {goals.length}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="card">
          <div className="flex gap-md justify-between">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`btn ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-outline'} flex-1`}
            >
              All Goals ({goals.length})
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`btn ${filterStatus === 'ACTIVE' ? 'btn-primary' : 'btn-outline'} flex-1`}
            >
              Active ({activeGoals})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`btn ${filterStatus === 'COMPLETED' ? 'btn-primary' : 'btn-outline'} flex-1`}
            >
              Completed ({completedGoals})
            </button>
          </div>
        </div>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <div className="card slide-in-right">
            <div className="flex-col-center py-12 fade-in">
              <h3 className="text-h4 text-primary">No goals yet</h3>
              <p className="text-body text-secondary">
                {filterStatus === 'ALL'
                  ? 'Set your first goal to start tracking your fitness journey!'
                  : `No ${filterStatus.toLowerCase()} goals found`}
              </p>
              {filterStatus === 'ALL' && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowSetGoalModal(true)}
                    className="btn btn-primary hover-glow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Set Your First Goal
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card" style={{ maxHeight: '800px', overflow: 'hidden', padding: '0' }}>
            <div style={{ maxHeight: '800px', overflowY: 'auto', overflowX: 'hidden' }}>
              <div className="grid-auto-fit stagger-in" style={{ padding: 'var(--space-lg)' }}>
            {filteredGoals.map((goal) => {
              const progress = calculateProgress(goal);
              return (
                <div
                  key={goal.id}
                  className="card hover-lift"
                  style={{ display: 'flex', flexDirection: 'column', padding: 'var(--space-md)', border: '1.5px solid rgba(178, 190, 195, 0.3)' }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1" style={{ textAlign: 'left' }}>
                      <h3 className="text-h4 text-white mb-2" style={{ textAlign: 'left' }}>{goal.title}</h3>
                      {/* Description */}
                      {goal.description && (
                        <p className="text-body-sm" style={{ textAlign: 'left', color: '#CBD5E0' }}>
                          {goal.description}
                        </p>
                      )}
                    </div>
                    {/* Target Date */}
                    {goal.targetDate && (
                      <div>
                        <span className="text-caption text-light">
                          By: {formatDate(goal.targetDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Spacer for flex layout */}
                  <div style={{ flex: 1, minHeight: '12px' }}></div>

                  {/* Progress Section */}
                  <div style={{
                    paddingTop: '12px',
                    marginBottom: '16px',
                    borderTop: '1px solid rgba(178, 190, 195, 0.15)'
                  }}>
                    {goal.targetValue && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-body-sm text-secondary font-medium">Progress</span>
                          <span className="text-body-sm text-primary font-semibold">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar" style={{ border: '1px solid rgba(178, 190, 195, 0.3)' }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${progress}%`,
                              background: goal.status === 'COMPLETED'
                                ? 'var(--color-success)'
                                : 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-body-sm text-secondary">
                            {goal.currentValue || 0} {goal.unit}
                          </span>
                          <span className="text-body-sm text-secondary">
                            Target: {goal.targetValue} {goal.unit}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-md pt-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                    {goal.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleCompleteGoal(goal)}
                        className="btn btn-primary flex-1"
                        style={{ fontSize: '13px', padding: '8px 12px' }}
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="btn btn-ghost flex-1"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="btn btn-ghost flex-1"
                      style={{ fontSize: '13px', padding: '8px 12px', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
              </div>
            </div>
          </div>
        )}

        {/* Set Goal Modal */}
        {showSetGoalModal && (
          <SetGoalModal
            onClose={() => {
              setShowSetGoalModal(false);
              setEditingGoal(null);
            }}
            onGoalCreated={handleGoalCreated}
            editGoal={editingGoal}
          />
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
