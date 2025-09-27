package com.fitnessapp.repository;

import com.fitnessapp.entity.ExerciseSet;
import com.fitnessapp.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseSetRepository extends JpaRepository<ExerciseSet, Long> {

    List<ExerciseSet> findByWorkoutExerciseOrderBySetNumberAsc(WorkoutExercise workoutExercise);
}