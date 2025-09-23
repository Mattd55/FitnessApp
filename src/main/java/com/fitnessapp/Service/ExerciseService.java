package com.fitnessapp.service;

import com.fitnessapp.entity.Exercise;
import com.fitnessapp.entity.User;
import com.fitnessapp.repository.ExerciseRepository;
import com.fitnessapp.repository.UserRepository;
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
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    public ExerciseService(ExerciseRepository exerciseRepository, UserRepository userRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }

    @Cacheable(value = "exercises")
    public Page<Exercise> getAllActiveExercises(Pageable pageable) {
        return exerciseRepository.findByActiveTrue(pageable);
    }

    @Cacheable(value = "exercises", key = "#category.name() + '_' + #pageable.pageNumber")
    public Page<Exercise> getExercisesByCategory(Exercise.Category category, Pageable pageable) {
        return exerciseRepository.findByActiveTrueAndCategory(category, pageable);
    }

    @Cacheable(value = "exercises", key = "#equipment.name() + '_' + #pageable.pageNumber")
    public Page<Exercise> getExercisesByEquipment(Exercise.Equipment equipment, Pageable pageable) {
        return exerciseRepository.findByActiveTrueAndEquipment(equipment, pageable);
    }

    @Cacheable(value = "exercises", key = "#difficulty.name() + '_' + #pageable.pageNumber")
    public Page<Exercise> getExercisesByDifficulty(Exercise.Difficulty difficulty, Pageable pageable) {
        return exerciseRepository.findByActiveTrueAndDifficulty(difficulty, pageable);
    }

    public Optional<Exercise> getExerciseById(Long id) {
        return exerciseRepository.findByIdAndActiveTrue(id);
    }

    @CacheEvict(value = "exercises", allEntries = true)
    public Exercise createExercise(String creatorUsername, Exercise exercise) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + creatorUsername));

        // Only trainers and admins can create exercises
        if (creator.getRole() != User.Role.TRAINER && creator.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Only trainers and admins can create exercises");
        }

        exercise.setCreatedBy(creator);
        exercise.setCreatedAt(LocalDateTime.now());
        exercise.setUpdatedAt(LocalDateTime.now());
        exercise.setActive(true);

        return exerciseRepository.save(exercise);
    }

    @CacheEvict(value = "exercises", allEntries = true)
    public Exercise updateExercise(String updaterUsername, Long exerciseId, Exercise updatedExercise) {
        User updater = userRepository.findByUsername(updaterUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + updaterUsername));

        Exercise existingExercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found: " + exerciseId));

        // Only the creator, trainers, or admins can update exercises
        boolean canUpdate = updater.getRole() == User.Role.ADMIN ||
                           updater.getRole() == User.Role.TRAINER ||
                           (existingExercise.getCreatedBy() != null &&
                            existingExercise.getCreatedBy().getId().equals(updater.getId()));

        if (!canUpdate) {
            throw new IllegalArgumentException("Not authorized to update this exercise");
        }

        // Update fields
        existingExercise.setName(updatedExercise.getName());
        existingExercise.setDescription(updatedExercise.getDescription());
        existingExercise.setInstructions(updatedExercise.getInstructions());
        existingExercise.setCategory(updatedExercise.getCategory());
        existingExercise.setEquipment(updatedExercise.getEquipment());
        existingExercise.setDifficulty(updatedExercise.getDifficulty());
        existingExercise.setPrimaryMuscles(updatedExercise.getPrimaryMuscles());
        existingExercise.setSecondaryMuscles(updatedExercise.getSecondaryMuscles());
        existingExercise.setUpdatedAt(LocalDateTime.now());

        return exerciseRepository.save(existingExercise);
    }

    @CacheEvict(value = "exercises", allEntries = true)
    public void deactivateExercise(String deactivatorUsername, Long exerciseId) {
        User deactivator = userRepository.findByUsername(deactivatorUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + deactivatorUsername));

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found: " + exerciseId));

        // Only admins can deactivate exercises
        if (deactivator.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Only admins can deactivate exercises");
        }

        exercise.setActive(false);
        exercise.setUpdatedAt(LocalDateTime.now());
        exerciseRepository.save(exercise);
    }

    public Page<Exercise> searchExercises(String searchTerm, Pageable pageable) {
        return exerciseRepository.findByActiveTrueAndNameContainingIgnoreCase(searchTerm, pageable);
    }
}