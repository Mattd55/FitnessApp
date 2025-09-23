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

    @CacheEvict(value = "userWorkouts", key = "#username")
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

    @CacheEvict(value = "userWorkouts", key = "#username")
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

    @CacheEvict(value = "userWorkouts", key = "#username")
    public Workout completeWorkout(String username, Long workoutId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        if (workout.getStatus() != Workout.Status.IN_PROGRESS) {
            throw new IllegalStateException("Workout is not in progress");
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

    public WorkoutExercise startExercise(String username, Long workoutId, Long workoutExerciseId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        WorkoutExercise workoutExercise = workoutExerciseRepository.findByIdAndWorkout(workoutExerciseId, workout)
                .orElseThrow(() -> new IllegalArgumentException("Workout exercise not found: " + workoutExerciseId));

        workoutExercise.setStatus(WorkoutExercise.Status.IN_PROGRESS);
        workoutExercise.setStartedAt(LocalDateTime.now());
        workoutExercise.setUpdatedAt(LocalDateTime.now());

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

        return exerciseSetRepository.save(exerciseSet);
    }

    @CacheEvict(value = "userWorkouts", key = "#username")
    public void deleteWorkout(String username, Long workoutId) {
        Workout workout = getWorkoutById(username, workoutId)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found: " + workoutId));

        if (workout.getStatus() == Workout.Status.IN_PROGRESS) {
            throw new IllegalStateException("Cannot delete workout in progress");
        }

        workoutRepository.deleteById(workoutId);
    }
}