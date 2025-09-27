import axios from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Exercise,
  Workout,
  WorkoutExercise,
  ExerciseSet,
  UserProgress,
  PageResponse,
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  delete apiClient.defaults.headers.common['Authorization'];
};

// Initialize token on app load
const token = getAuthToken();
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data as LoginResponse;
  },

  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data as LoginResponse;
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/profile');
    return response.data as User;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/users/profile', userData);
    return response.data as User;
  },

  getProgress: async (page = 0, size = 10): Promise<PageResponse<UserProgress>> => {
    const response = await apiClient.get(
      `/users/progress?page=${page}&size=${size}`
    );
    return response.data as PageResponse<UserProgress>;
  },

  createProgress: async (progressData: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt' | 'user'>): Promise<UserProgress> => {
    const response = await apiClient.post('/users/progress', progressData);
    return response.data as UserProgress;
  },

  getLatestProgress: async (): Promise<UserProgress> => {
    const response = await apiClient.get('/users/progress/latest');
    return response.data as UserProgress;
  },
};

// Exercise API
export const exerciseApi = {
  getExercises: async (params?: {
    page?: number;
    size?: number;
    category?: string;
    equipment?: string;
    difficulty?: string;
    search?: string;
  }): Promise<PageResponse<Exercise>> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.equipment) queryParams.append('equipment', params.equipment);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.search) queryParams.append('search', params.search);

    const response = await apiClient.get(
      `/exercises?${queryParams.toString()}`
    );
    return response.data as PageResponse<Exercise>;
  },

  getExercise: async (id: number): Promise<Exercise> => {
    const response = await apiClient.get(`/exercises/${id}`);
    return response.data as Exercise;
  },

  createExercise: async (exerciseData: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'active'>): Promise<Exercise> => {
    const response = await apiClient.post('/exercises', exerciseData);
    return response.data as Exercise;
  },

  updateExercise: async (id: number, exerciseData: Partial<Exercise>): Promise<Exercise> => {
    const response = await apiClient.put(`/exercises/${id}`, exerciseData);
    return response.data as Exercise;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get('/exercises/categories');
    return response.data as string[];
  },

  getEquipment: async (): Promise<string[]> => {
    const response = await apiClient.get('/exercises/equipment');
    return response.data as string[];
  },

  getDifficulties: async (): Promise<string[]> => {
    const response = await apiClient.get('/exercises/difficulties');
    return response.data as string[];
  },

  getMuscleGroups: async (): Promise<string[]> => {
    const response = await apiClient.get('/exercises/muscle-groups');
    return response.data as string[];
  },
};

// Workout API
export const workoutApi = {
  getWorkouts: async (page = 0, size = 10): Promise<PageResponse<Workout>> => {
    const response = await apiClient.get(
      `/workouts?page=${page}&size=${size}`
    );
    return response.data as PageResponse<Workout>;
  },

  getWorkout: async (id: number): Promise<Workout> => {
    const response = await apiClient.get(`/workouts/${id}`);
    return response.data as Workout;
  },

  getWorkoutExercises: async (workoutId: number): Promise<WorkoutExercise[]> => {
    const response = await apiClient.get(`/workouts/${workoutId}/exercises`);
    return response.data as WorkoutExercise[];
  },

  createWorkout: async (workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'trainer'>): Promise<Workout> => {
    const response = await apiClient.post('/workouts', workoutData);
    return response.data as Workout;
  },

  startWorkout: async (id: number): Promise<Workout> => {
    const response = await apiClient.post(`/workouts/${id}/start`);
    return response.data as Workout;
  },

  completeWorkout: async (id: number): Promise<Workout> => {
    const response = await apiClient.post(`/workouts/${id}/complete`);
    return response.data as Workout;
  },

  deleteWorkout: async (id: number): Promise<void> => {
    await apiClient.delete(`/workouts/${id}`);
  },

  addExerciseToWorkout: async (
    workoutId: number,
    exerciseId: number,
    exerciseData: Omit<WorkoutExercise, 'id' | 'createdAt' | 'updatedAt' | 'exercise' | 'workout' | 'status'>
  ): Promise<WorkoutExercise> => {
    const response = await apiClient.post(
      `/workouts/${workoutId}/exercises/${exerciseId}`,
      exerciseData
    );
    return response.data as WorkoutExercise;
  },

  updateWorkoutExercise: async (
    workoutId: number,
    workoutExerciseId: number,
    exerciseData: Omit<WorkoutExercise, 'id' | 'createdAt' | 'updatedAt' | 'exercise' | 'workout' | 'status'>
  ): Promise<WorkoutExercise> => {
    const response = await apiClient.put(
      `/workouts/${workoutId}/exercises/${workoutExerciseId}`,
      exerciseData
    );
    return response.data as WorkoutExercise;
  },

  startExercise: async (workoutId: number, workoutExerciseId: number): Promise<WorkoutExercise> => {
    const response = await apiClient.post(`/workouts/${workoutId}/exercises/${workoutExerciseId}/start`);
    return response.data as WorkoutExercise;
  },

  completeExercise: async (workoutId: number, workoutExerciseId: number): Promise<WorkoutExercise> => {
    const response = await apiClient.post(`/workouts/${workoutId}/exercises/${workoutExerciseId}/complete`);
    return response.data as WorkoutExercise;
  },

  logSet: async (
    workoutExerciseId: number,
    setData: Omit<ExerciseSet, 'id' | 'createdAt' | 'workoutExercise' | 'status'>
  ): Promise<ExerciseSet> => {
    const response = await apiClient.post(
      `/workouts/exercises/${workoutExerciseId}/sets`,
      setData
    );
    return response.data as ExerciseSet;
  },

  completeSet: async (setId: number): Promise<ExerciseSet> => {
    const response = await apiClient.post(`/workouts/sets/${setId}/complete`);
    return response.data as ExerciseSet;
  },

  getExerciseSets: async (workoutExerciseId: number): Promise<ExerciseSet[]> => {
    const response = await apiClient.get(`/workouts/exercises/${workoutExerciseId}/sets`);
    return response.data as ExerciseSet[];
  },
};

export default apiClient;