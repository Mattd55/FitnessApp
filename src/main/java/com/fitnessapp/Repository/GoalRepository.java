package com.fitnessapp.repository;

import com.fitnessapp.entity.Goal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    Page<Goal> findByUserId(Long userId, Pageable pageable);

    List<Goal> findByUserIdAndStatus(Long userId, Goal.GoalStatus status);

    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId AND g.status = :status ORDER BY g.createdAt DESC")
    List<Goal> findActiveGoalsByUser(@Param("userId") Long userId, @Param("status") Goal.GoalStatus status);

    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId AND g.id = :goalId")
    Optional<Goal> findByIdAndUserId(@Param("goalId") Long goalId, @Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM Goal g WHERE g.user.id = :userId AND g.status = 'ACTIVE'")
    long countActiveGoalsByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM Goal g WHERE g.user.id = :userId AND g.status = 'COMPLETED'")
    long countCompletedGoalsByUser(@Param("userId") Long userId);
}
