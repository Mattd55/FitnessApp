package com.fitnessapp.repository;

import com.fitnessapp.entity.User;
import com.fitnessapp.entity.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    Page<Workout> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Optional<Workout> findByIdAndUser(Long id, User user);
}