// API Response Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'TRAINER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  username: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  instructions: string;
  category: 'STRENGTH' | 'CARDIO' | 'FLEXIBILITY' | 'SPORTS' | 'REHABILITATION';
  equipment: 'NONE' | 'BARBELL' | 'DUMBBELL' | 'KETTLEBELL' | 'RESISTANCE_BAND' |
            'PULL_UP_BAR' | 'MACHINE' | 'CABLE' | 'MEDICINE_BALL' | 'FOAM_ROLLER';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
}

export type MuscleGroup = 'CHEST' | 'BACK' | 'SHOULDERS' | 'BICEPS' | 'TRICEPS' |
                         'FOREARMS' | 'CORE' | 'GLUTES' | 'QUADRICEPS' | 'HAMSTRINGS' |
                         'CALVES' | 'FULL_BODY' | 'CARDIO';

export interface Workout {
  id: number;
  name: string;
  description?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'SKIPPED';
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  trainer?: User;
}

export interface WorkoutExercise {
  id: number;
  orderIndex: number;
  plannedSets: number;
  plannedReps: number;
  plannedWeight?: number;
  plannedDurationSeconds?: number;
  plannedDistanceMeters?: number;
  restTimeSeconds?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  exercise: Exercise;
  workout: Workout;
}

export interface ExerciseSet {
  id: number;
  setNumber: number;
  actualReps?: number;
  actualWeight?: number;
  actualDurationSeconds?: number;
  actualDistanceMeters?: number;
  rpeScore?: number;
  restTimeSeconds?: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  workoutExercise: WorkoutExercise;
}

export interface UserProgress {
  id: number;
  measurementDate: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  hipCm?: number;
  neckCm?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  restingHeartRate?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface ErrorResponse {
  errorCode: string;
  message: string;
  path: string;
  timestamp: string;
  details?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}