package com.fitnessapp.repository;

import com.fitnessapp.entity.User;
import com.fitnessapp.entity.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    Page<Workout> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Optional<Workout> findByIdAndUser(Long id, User user);

    // Fetch workout with exercises to avoid N+1 problem
    // Note: actualSets are not fetched here to avoid MultipleBagFetchException
    @Query("SELECT DISTINCT w FROM Workout w " +
           "LEFT JOIN FETCH w.exercises we " +
           "LEFT JOIN FETCH we.exercise " +
           "WHERE w.id = :workoutId AND w.user = :user")
    Optional<Workout> findByIdAndUserWithExercises(@Param("workoutId") Long workoutId, @Param("user") User user);
}