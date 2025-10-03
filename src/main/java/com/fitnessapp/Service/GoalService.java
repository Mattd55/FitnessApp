package com.fitnessapp.service;

import com.fitnessapp.entity.Goal;
import com.fitnessapp.entity.User;
import com.fitnessapp.repository.GoalRepository;
import com.fitnessapp.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public Goal createGoal(String username, Goal goal) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        goal.setUser(user);
        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        if (goal.getStartedDate() == null) {
            goal.setStartedDate(LocalDate.now());
        }

        if (goal.getStatus() == null) {
            goal.setStatus(Goal.GoalStatus.ACTIVE);
        }

        return goalRepository.save(goal);
    }

    public Page<Goal> getUserGoals(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return goalRepository.findByUserId(user.getId(), pageable);
    }

    public List<Goal> getActiveGoals(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return goalRepository.findActiveGoalsByUser(user.getId(), Goal.GoalStatus.ACTIVE);
    }

    public Goal getGoalById(String username, Long goalId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return goalRepository.findByIdAndUserId(goalId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Goal not found or does not belong to user"));
    }

    public Goal updateGoal(String username, Long goalId, Goal updatedGoal) {
        Goal existingGoal = getGoalById(username, goalId);

        if (updatedGoal.getTitle() != null) {
            existingGoal.setTitle(updatedGoal.getTitle());
        }
        if (updatedGoal.getDescription() != null) {
            existingGoal.setDescription(updatedGoal.getDescription());
        }
        if (updatedGoal.getType() != null) {
            existingGoal.setType(updatedGoal.getType());
        }
        if (updatedGoal.getStatus() != null) {
            existingGoal.setStatus(updatedGoal.getStatus());

            // Set completion date if status changed to COMPLETED
            if (updatedGoal.getStatus() == Goal.GoalStatus.COMPLETED && existingGoal.getCompletedDate() == null) {
                existingGoal.setCompletedDate(LocalDate.now());
            }
        }
        if (updatedGoal.getTargetValue() != null) {
            existingGoal.setTargetValue(updatedGoal.getTargetValue());
        }
        if (updatedGoal.getCurrentValue() != null) {
            existingGoal.setCurrentValue(updatedGoal.getCurrentValue());
        }
        if (updatedGoal.getUnit() != null) {
            existingGoal.setUnit(updatedGoal.getUnit());
        }
        if (updatedGoal.getTargetDate() != null) {
            existingGoal.setTargetDate(updatedGoal.getTargetDate());
        }

        existingGoal.setUpdatedAt(LocalDateTime.now());

        return goalRepository.save(existingGoal);
    }

    public void deleteGoal(String username, Long goalId) {
        Goal goal = getGoalById(username, goalId);
        goalRepository.delete(goal);
    }

    public long getActiveGoalsCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return goalRepository.countActiveGoalsByUser(user.getId());
    }

    public long getCompletedGoalsCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return goalRepository.countCompletedGoalsByUser(user.getId());
    }
}
