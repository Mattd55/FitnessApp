package com.fitnessapp.controller;

import com.fitnessapp.entity.Exercise;
import com.fitnessapp.enums.ExerciseCategory;
import com.fitnessapp.enums.ExerciseEquipment;
import com.fitnessapp.enums.ExerciseDifficulty;
import com.fitnessapp.enums.MuscleGroup;
import com.fitnessapp.service.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<Page<Exercise>> getAllExercises(
            @RequestParam(required = false) ExerciseCategory category,
            @RequestParam(required = false) ExerciseEquipment equipment,
            @RequestParam(required = false) ExerciseDifficulty difficulty,
            @RequestParam(required = false) String search,
            Pageable pageable) {

        Page<Exercise> exercises;

        if (search != null && !search.trim().isEmpty()) {
            exercises = exerciseService.searchExercises(search.trim(), pageable);
        } else if (category != null) {
            exercises = exerciseService.getExercisesByCategory(category, pageable);
        } else if (equipment != null) {
            exercises = exerciseService.getExercisesByEquipment(equipment, pageable);
        } else if (difficulty != null) {
            exercises = exerciseService.getExercisesByDifficulty(difficulty, pageable);
        } else {
            exercises = exerciseService.getAllActiveExercises(pageable);
        }

        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable Long id) {
        Optional<Exercise> exercise = exerciseService.getExerciseById(id);
        return exercise.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<Exercise> createExercise(@Valid @RequestBody Exercise exercise,
                                                 Authentication authentication) {
        String username = authentication.getName();
        Exercise createdExercise = exerciseService.createExercise(username, exercise);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExercise);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id,
                                                 @Valid @RequestBody Exercise updatedExercise,
                                                 Authentication authentication) {
        String username = authentication.getName();
        Exercise exercise = exerciseService.updateExercise(username, id, updatedExercise);
        return ResponseEntity.ok(exercise);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateExercise(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        exerciseService.deactivateExercise(username, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<ExerciseCategory[]> getCategories() {
        return ResponseEntity.ok(ExerciseCategory.values());
    }

    @GetMapping("/equipment")
    public ResponseEntity<ExerciseEquipment[]> getEquipment() {
        return ResponseEntity.ok(ExerciseEquipment.values());
    }

    @GetMapping("/difficulties")
    public ResponseEntity<ExerciseDifficulty[]> getDifficulties() {
        return ResponseEntity.ok(ExerciseDifficulty.values());
    }

    @GetMapping("/muscle-groups")
    public ResponseEntity<MuscleGroup[]> getMuscleGroups() {
        return ResponseEntity.ok(MuscleGroup.values());
    }
}