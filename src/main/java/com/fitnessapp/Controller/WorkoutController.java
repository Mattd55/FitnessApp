package com.fitnessapp.controller;

import com.fitnessapp.dto.WorkoutExerciseDTO;
import com.fitnessapp.entity.ExerciseSet;
import com.fitnessapp.entity.Workout;
import com.fitnessapp.entity.WorkoutExercise;
import com.fitnessapp.service.WorkoutService;

import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@Valid @RequestBody Workout workout,
                                               Authentication authentication) {
        String username = authentication.getName();
        Workout createdWorkout = workoutService.createWorkout(username, workout);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkout);
    }

    @GetMapping
    public ResponseEntity<Page<Workout>> getUserWorkouts(Authentication authentication, Pageable pageable) {
        String username = authentication.getName();
        Page<Workout> workouts = workoutService.getUserWorkouts(username, pageable);
        return ResponseEntity.ok(workouts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkout(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Optional<Workout> workout = workoutService.getWorkoutById(username, id);
        return workout.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/exercises")
    public ResponseEntity<List<WorkoutExerciseDTO>> getWorkoutExercises(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        List<WorkoutExercise> exercises = workoutService.getWorkoutExercises(username, id);
        List<WorkoutExerciseDTO> exerciseDTOs = exercises.stream()
                .map(WorkoutExerciseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(exerciseDTOs);
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<Workout> startWorkout(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Workout workout = workoutService.startWorkout(username, id);
        return ResponseEntity.ok(workout);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Workout> completeWorkout(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Workout workout = workoutService.completeWorkout(username, id);
        return ResponseEntity.ok(workout);
    }

    @PostMapping("/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<WorkoutExercise> addExerciseToWorkout(@PathVariable Long workoutId,
                                                              @PathVariable Long exerciseId,
                                                              @Valid @RequestBody WorkoutExercise workoutExercise,
                                                              Authentication authentication) {
        String username = authentication.getName();
        WorkoutExercise created = workoutService.addExerciseToWorkout(username, workoutId, exerciseId, workoutExercise);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{workoutId}/exercises/{workoutExerciseId}")
    public ResponseEntity<WorkoutExerciseDTO> updateWorkoutExercise(@PathVariable Long workoutId,
                                                                  @PathVariable Long workoutExerciseId,
                                                                  @Valid @RequestBody WorkoutExercise workoutExercise,
                                                                  Authentication authentication) {
        String username = authentication.getName();
        WorkoutExercise updated = workoutService.updateWorkoutExercise(username, workoutId, workoutExerciseId, workoutExercise);
        return ResponseEntity.ok(WorkoutExerciseDTO.fromEntity(updated));
    }

    @PostMapping("/{workoutId}/exercises/{workoutExerciseId}/start")
    public ResponseEntity<WorkoutExercise> startExercise(@PathVariable Long workoutId,
                                                       @PathVariable Long workoutExerciseId,
                                                       Authentication authentication) {
        String username = authentication.getName();
        WorkoutExercise workoutExercise = workoutService.startExercise(username, workoutId, workoutExerciseId);
        return ResponseEntity.ok(workoutExercise);
    }

    @PostMapping("/exercises/{workoutExerciseId}/sets")
    public ResponseEntity<ExerciseSet> logSet(@PathVariable Long workoutExerciseId,
                                            @Valid @RequestBody ExerciseSet exerciseSet,
                                            Authentication authentication) {
        String username = authentication.getName();
        ExerciseSet logged = workoutService.logSet(username, workoutExerciseId, exerciseSet);
        return ResponseEntity.status(HttpStatus.CREATED).body(logged);
    }

    @PostMapping("/sets/{setId}/complete")
    public ResponseEntity<ExerciseSet> completeSet(@PathVariable Long setId, Authentication authentication) {
        String username = authentication.getName();
        ExerciseSet completed = workoutService.completeSet(username, setId);
        return ResponseEntity.ok(completed);
    }

    @GetMapping("/exercises/{workoutExerciseId}/sets")
    public ResponseEntity<List<ExerciseSet>> getExerciseSets(@PathVariable Long workoutExerciseId, Authentication authentication) {
        String username = authentication.getName();
        List<ExerciseSet> sets = workoutService.getExerciseSets(username, workoutExerciseId);
        return ResponseEntity.ok(sets);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        workoutService.deleteWorkout(username, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{workoutId}/exercises/{workoutExerciseId}/complete")
    public ResponseEntity<WorkoutExercise> completeExercise(@PathVariable Long workoutId,
                                                          @PathVariable Long workoutExerciseId,
                                                          Authentication authentication) {
        String username = authentication.getName();
        WorkoutExercise completed = workoutService.completeExercise(username, workoutId, workoutExerciseId);
        return ResponseEntity.ok(completed);
    }

    @PostMapping("/{id}/fix-status")
    public ResponseEntity<String> fixWorkoutStatus(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        workoutService.fixWorkoutStatusInconsistency(username, id);
        return ResponseEntity.ok("Workout status fixed");
    }
}