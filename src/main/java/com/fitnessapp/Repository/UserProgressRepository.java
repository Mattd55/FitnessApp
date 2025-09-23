package com.fitnessapp.repository;

import com.fitnessapp.entity.User;
import com.fitnessapp.entity.UserProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    Page<UserProgress> findByUserOrderByMeasurementDateDesc(User user, Pageable pageable);

    Optional<UserProgress> findFirstByUserOrderByMeasurementDateDesc(User user);
}