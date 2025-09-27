package com.fitnessapp.repository;

import com.fitnessapp.entity.Workout;
import com.fitnessapp.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {

    Optional<WorkoutExercise> findByIdAndWorkout(Long id, Workout workout);

    List<WorkoutExercise> findByWorkoutOrderByOrderIndexAsc(Workout workout);
}