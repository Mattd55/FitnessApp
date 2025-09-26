package com.fitnessapp.repository;

import com.fitnessapp.entity.Exercise;
import com.fitnessapp.enums.ExerciseCategory;
import com.fitnessapp.enums.ExerciseEquipment;
import com.fitnessapp.enums.ExerciseDifficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    Page<Exercise> findByActiveTrue(Pageable pageable);

    Page<Exercise> findByActiveTrueAndCategory(ExerciseCategory category, Pageable pageable);

    Page<Exercise> findByActiveTrueAndEquipment(ExerciseEquipment equipment, Pageable pageable);

    Page<Exercise> findByActiveTrueAndDifficulty(ExerciseDifficulty difficulty, Pageable pageable);

    Optional<Exercise> findByIdAndActiveTrue(Long id);

    Page<Exercise> findByActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
}