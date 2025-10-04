package com.fitnessapp.repository;

import com.fitnessapp.entity.ExerciseSet;
import com.fitnessapp.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseSetRepository extends JpaRepository<ExerciseSet, Long> {

    List<ExerciseSet> findByWorkoutExerciseOrderBySetNumberAsc(WorkoutExercise workoutExercise);

    @Query("SELECT e.name, " +
           "COALESCE(MAX(es.actualWeight), MAX(we.plannedWeight)), " +
           "COALESCE(MAX(es.actualReps), MAX(we.plannedReps)) " +
           "FROM WorkoutExercise we " +
           "JOIN we.exercise e " +
           "JOIN we.workout w " +
           "LEFT JOIN we.actualSets es " +
           "WHERE w.user.id = :userId " +
           "AND w.status = 'COMPLETED' " +
           "AND (es.actualWeight IS NOT NULL OR we.plannedWeight IS NOT NULL) " +
           "GROUP BY e.id, e.name " +
           "ORDER BY COALESCE(MAX(es.actualWeight), MAX(we.plannedWeight)) DESC")
    List<Object[]> findPersonalRecordsByUser(@Param("userId") Long userId);
}