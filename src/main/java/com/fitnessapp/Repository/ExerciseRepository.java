package com.fitnessapp.repository;

import com.fitnessapp.entity.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    Page<Exercise> findByActiveTrue(Pageable pageable);

    Page<Exercise> findByActiveTrueAndCategory(Exercise.Category category, Pageable pageable);

    Page<Exercise> findByActiveTrueAndEquipment(Exercise.Equipment equipment, Pageable pageable);

    Page<Exercise> findByActiveTrueAndDifficulty(Exercise.Difficulty difficulty, Pageable pageable);

    Optional<Exercise> findByIdAndActiveTrue(Long id);

    Page<Exercise> findByActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
}