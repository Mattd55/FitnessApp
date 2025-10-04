/**
 * Application-wide constants
 */

// API Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  INITIAL_PAGE: 0
} as const;

// Time durations (in milliseconds)
export const DURATION = {
  DEBOUNCE_SEARCH: 300,
  AUTO_HIDE_SUCCESS: 3000,
  AUTO_HIDE_ERROR: 5000,
  MODAL_CLOSE_DELAY: 1500,
  REST_TIMER_INTERVAL: 1000
} as const;

// Validation limits
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_WORKOUT_DURATION: 1,
  MAX_WORKOUT_DURATION: 600, // 10 hours
  MIN_SETS: 1,
  MAX_SETS: 20,
  MIN_REPS: 1,
  MAX_REPS: 1000,
  MIN_WEIGHT: 0,
  MAX_WEIGHT: 1000, // kg
  MIN_REST_TIME: 0,
  MAX_REST_TIME: 600 // 10 minutes in seconds
} as const;

// UI Breakpoints (px)
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280
} as const;

// Z-Index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  MODAL_BACKDROP: 9999,
  MODAL: 10000,
  TOAST: 10100
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme'
} as const;

// Status colors
export const STATUS_COLORS = {
  PLANNED: 'var(--color-secondary)',
  IN_PROGRESS: 'var(--color-warning)',
  COMPLETED: 'var(--color-success)',
  PENDING: 'var(--color-border-medium)'
} as const;

// Workout status options
export const WORKOUT_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

// Exercise status options
export const EXERCISE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

// Set status options
export const SET_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
} as const;

// Goal types
export const GOAL_TYPES = {
  WEIGHT_LOSS: 'WEIGHT_LOSS',
  MUSCLE_GAIN: 'MUSCLE_GAIN',
  STRENGTH: 'STRENGTH',
  ENDURANCE: 'ENDURANCE',
  FLEXIBILITY: 'FLEXIBILITY',
  GENERAL_FITNESS: 'GENERAL_FITNESS'
} as const;

// Date/Time formats
export const DATE_FORMATS = {
  INPUT_DATETIME: 'yyyy-MM-ddTHH:mm',
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_DATETIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd'
} as const;
