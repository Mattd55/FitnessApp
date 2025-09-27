package com.fitnessapp.service;

import com.fitnessapp.entity.*;
import com.fitnessapp.repository.*;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final ExerciseSetRepository exerciseSetRepository;

    public WorkoutService(WorkoutRepository workoutRepository,
                         UserRepository userRepository,
                         ExerciseRepository exerciseRepository,
                         WorkoutExerciseRepository workoutExerciseRepository,
                         ExerciseSetRepository exerciseSetRepository) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.workoutExerciseRepository = workoutExerciseRepository;
        this.exerciseSetRepository = exerciseSetRepository;
    }

    @CacheEvict(value = "userWorkouts", allEntries = true)
    public Workout createWorkout(String username, Workout workout) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        workout.setUser(user);
        workout.setStatus(Workout.Status.PLANNED);
        workout.setCreatedAt(LocalDateTime.now());
        workout.setUpdatedAt(LocalDateTime.now());

        return workoutRepository.save(workout);
    }

    @Cacheable(value = "userWorkouts", key = "#username + '_' + #pageable.pageNumber")
    public Page<Workout> getUserWorkouts(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return workoutRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public Optional<Workout> getWorkoutById(String username, Long workoutId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return workoutRepository.findByIdAndUser(workoutId, user);
    }

    public List<WorkoutExercise> getWorkoutExercises(String username, Long workoutId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        return workoutExerciseRepository.findByWorkoutOrderByOrderIndexAsc(workout);
    }

    @CacheEvict(value = "userWorkouts", allEntries = true)
    public Workout startWorkout(String username, Long workoutId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        if (workout.getStatus() != Workout.Status.PLANNED) {
            throw new IllegalStateException("Workout is not in planned state");
        }

        workout.setStatus(Workout.Status.IN_PROGRESS);
        workout.setStartedAt(LocalDateTime.now());
        workout.setUpdatedAt(LocalDateTime.now());

        return workoutRepository.save(workout);
    }

    @CacheEvict(value = "userWorkouts", allEntries = true)
    public Workout completeWorkout(String username, Long workoutId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        if (workout.getStatus() != Workout.Status.IN_PROGRESS) {
            throw new IllegalStateException("Workout is not in progress");
        }

        // Complete all exercises in the workout that are still in progress
        List<WorkoutExercise> exercises = workoutExerciseRepository.findByWorkoutOrderByOrderIndexAsc(workout);
        for (WorkoutExercise exercise : exercises) {
            if (exercise.getStatus() == WorkoutExercise.Status.IN_PROGRESS) {
                exercise.setStatus(WorkoutExercise.Status.COMPLETED);
                exercise.setCompletedAt(LocalDateTime.now());
                exercise.setUpdatedAt(LocalDateTime.now());
                workoutExerciseRepository.save(exercise);
            }
        }

        workout.setStatus(Workout.Status.COMPLETED);
        workout.setCompletedAt(LocalDateTime.now());
        workout.setUpdatedAt(LocalDateTime.now());

        // Calculate duration if started
        if (workout.getStartedAt() != null) {
            long durationMinutes = java.time.Duration.between(
                workout.getStartedAt(), workout.getCompletedAt()).toMinutes();
            workout.setDurationMinutes((int) durationMinutes);
        }

        return workoutRepository.save(workout);
    }

    public WorkoutExercise addExerciseToWorkout(String username, Long workoutId, Long exerciseId, WorkoutExercise workoutExercise) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found: " + exerciseId));

        workoutExercise.setWorkout(workout);
        workoutExercise.setExercise(exercise);
        workoutExercise.setStatus(WorkoutExercise.Status.PENDING);
        workoutExercise.setCreatedAt(LocalDateTime.now());
        workoutExercise.setUpdatedAt(LocalDateTime.now());

        return workoutExerciseRepository.save(workoutExercise);
    }

    public WorkoutExercise updateWorkoutExercise(String username, Long workoutId, Long workoutExerciseId, WorkoutExercise updatedWorkoutExercise) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        WorkoutExercise existingWorkoutExercise = workoutExerciseRepository.findByIdAndWorkout(workoutExerciseId, workout)
                .orElseThrow(() -> new IllegalArgumentException("Workout exercise not found: " + workoutExerciseId));

        // Update the modifiable fields
        existingWorkoutExercise.setPlannedSets(updatedWorkoutExercise.getPlannedSets());
        existingWorkoutExercise.setPlannedReps(updatedWorkoutExercise.getPlannedReps());
        existingWorkoutExercise.setPlannedWeight(updatedWorkoutExercise.getPlannedWeight());
        existingWorkoutExercise.setRestTimeSeconds(updatedWorkoutExercise.getRestTimeSeconds());
        existingWorkoutExercise.setNotes(updatedWorkoutExercise.getNotes());
        existingWorkoutExercise.setOrderIndex(updatedWorkoutExercise.getOrderIndex());
        existingWorkoutExercise.setUpdatedAt(LocalDateTime.now());

        return workoutExerciseRepository.save(existingWorkoutExercise);
    }

    @CacheEvict(value = "userWorkouts", allEntries = true)
    public WorkoutExercise startExercise(String username, Long workoutId, Long workoutExerciseId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        WorkoutExercise workoutExercise = workoutExerciseRepository.findByIdAndWorkout(workoutExerciseId, workout)
                .orElseThrow(() -> new IllegalArgumentException("Workout exercise not found: " + workoutExerciseId));

        // Update exercise status
        workoutExercise.setStatus(WorkoutExercise.Status.IN_PROGRESS);
        workoutExercise.setStartedAt(LocalDateTime.now());
        workoutExercise.setUpdatedAt(LocalDateTime.now());

        // Also update workout status to IN_PROGRESS when first exercise is started
        if (workout.getStatus() == Workout.Status.PLANNED) {
            workout.setStatus(Workout.Status.IN_PROGRESS);
            workout.setStartedAt(LocalDateTime.now());
            workout.setUpdatedAt(LocalDateTime.now());
            workoutRepository.save(workout);
        }

        return workoutExerciseRepository.save(workoutExercise);
    }

    public ExerciseSet logSet(String username, Long workoutExerciseId, ExerciseSet exerciseSet) {
        // Verify the workout exercise belongs to the user
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(workoutExerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Workout exercise not found: " + workoutExerciseId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (!workoutExercise.getWorkout().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Workout exercise does not belong to user: " + username);
        }

        exerciseSet.setWorkoutExercise(workoutExercise);
        exerciseSet.setStatus(ExerciseSet.Status.PENDING);
        exerciseSet.setCreatedAt(LocalDateTime.now());

        return exerciseSetRepository.save(exerciseSet);
    }

    public ExerciseSet completeSet(String username, Long setId) {
        ExerciseSet exerciseSet = exerciseSetRepository.findById(setId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise set not found: " + setId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (!exerciseSet.getWorkoutExercise().getWorkout().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Exercise set does not belong to user: " + username);
        }

        exerciseSet.setStatus(ExerciseSet.Status.COMPLETED);
        exerciseSet.setCompletedAt(LocalDateTime.now());
        ExerciseSet savedSet = exerciseSetRepository.save(exerciseSet);

        // Check if all sets for this exercise are completed and auto-complete the exercise
        WorkoutExercise workoutExercise = exerciseSet.getWorkoutExercise();
        if (workoutExercise.getStatus() == WorkoutExercise.Status.IN_PROGRESS) {
            List<ExerciseSet> allSets = exerciseSetRepository.findByWorkoutExerciseOrderBySetNumberAsc(workoutExercise);
            long completedSets = allSets.stream()
                    .filter(set -> set.getStatus() == ExerciseSet.Status.COMPLETED)
                    .count();

            // If all planned sets are completed, automatically complete the exercise
            if (completedSets >= workoutExercise.getPlannedSets()) {
                workoutExercise.completeExercise();
                workoutExerciseRepository.save(workoutExercise);
            }
        }

        return savedSet;
    }

    public List<ExerciseSet> getExerciseSets(String username, Long workoutExerciseId) {
        // Verify the workout exercise belongs to the user
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(workoutExerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Workout exercise not found: " + workoutExerciseId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (!workoutExercise.getWorkout().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Workout exercise does not belong to user: " + username);
        }

        return exerciseSetRepository.findByWorkoutExerciseOrderBySetNumberAsc(workoutExercise);
    }

    public WorkoutExercise completeExercise(String username, Long workoutId, Long workoutExerciseId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        WorkoutExercise workoutExercise = workoutExerciseRepository.findByIdAndWorkout(workoutExerciseId, workout)
                .orElseThrow(() -> new IllegalArgumentException("Workout exercise not found: " + workoutExerciseId));

        if (workoutExercise.getStatus() != WorkoutExercise.Status.IN_PROGRESS) {
            throw new IllegalStateException("Can only complete exercises that are in progress");
        }

        workoutExercise.completeExercise();
        return workoutExerciseRepository.save(workoutExercise);
    }

    @CacheEvict(value = "userWorkouts", allEntries = true)
    public void deleteWorkout(String username, Long workoutId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        // Allow deletion at all times - no restrictions on workout status or logged sets
        // This will cascade delete all related WorkoutExercises and ExerciseSets due to JPA cascade settings
        workoutRepository.deleteById(workoutId);
    }

    // Method to fix data inconsistencies for existing workouts
    @CacheEvict(value = "userWorkouts", allEntries = true)
    public void fixWorkoutStatusInconsistency(String username, Long workoutId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        List<WorkoutExercise> exercises = workoutExerciseRepository.findByWorkoutOrderByOrderIndexAsc(workout);

        // Fix if workout is PLANNED but has IN_PROGRESS exercises
        if (workout.getStatus() == Workout.Status.PLANNED) {
            boolean hasInProgressExercises = exercises.stream()
                    .anyMatch(ex -> ex.getStatus() == WorkoutExercise.Status.IN_PROGRESS);

            if (hasInProgressExercises) {
                // Update workout to IN_PROGRESS to match exercise status
                workout.setStatus(Workout.Status.IN_PROGRESS);
                if (workout.getStartedAt() == null) {
                    workout.setStartedAt(LocalDateTime.now());
                }
                workout.setUpdatedAt(LocalDateTime.now());
                workoutRepository.save(workout);
            }
        }

        // Fix if workout is COMPLETED but has IN_PROGRESS exercises
        if (workout.getStatus() == Workout.Status.COMPLETED) {
            boolean hasInProgressExercises = exercises.stream()
                    .anyMatch(ex -> ex.getStatus() == WorkoutExercise.Status.IN_PROGRESS);

            if (hasInProgressExercises) {
                // Complete all IN_PROGRESS exercises to match workout status
                for (WorkoutExercise exercise : exercises) {
                    if (exercise.getStatus() == WorkoutExercise.Status.IN_PROGRESS) {
                        exercise.setStatus(WorkoutExercise.Status.COMPLETED);
                        exercise.setCompletedAt(LocalDateTime.now());
                        exercise.setUpdatedAt(LocalDateTime.now());
                        workoutExerciseRepository.save(exercise);
                    }
                }
            }
        }
    }
}