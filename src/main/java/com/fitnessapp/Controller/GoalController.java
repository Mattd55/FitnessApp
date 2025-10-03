package com.fitnessapp.controller;

import com.fitnessapp.entity.Goal;
import com.fitnessapp.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@Valid @RequestBody Goal goal, Authentication authentication) {
        String username = authentication.getName();
        Goal createdGoal = goalService.createGoal(username, goal);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGoal);
    }

    @GetMapping
    public ResponseEntity<Page<Goal>> getUserGoals(Authentication authentication, Pageable pageable) {
        String username = authentication.getName();
        Page<Goal> goals = goalService.getUserGoals(username, pageable);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Goal>> getActiveGoals(Authentication authentication) {
        String username = authentication.getName();
        List<Goal> goals = goalService.getActiveGoals(username);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoalById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Goal goal = goalService.getGoalById(username, id);
        return ResponseEntity.ok(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id,
                                         @Valid @RequestBody Goal updatedGoal,
                                         Authentication authentication) {
        String username = authentication.getName();
        Goal goal = goalService.updateGoal(username, id, updatedGoal);
        return ResponseEntity.ok(goal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        goalService.deleteGoal(username, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/active")
    public ResponseEntity<Long> getActiveGoalsCount(Authentication authentication) {
        String username = authentication.getName();
        long count = goalService.getActiveGoalsCount(username);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/completed")
    public ResponseEntity<Long> getCompletedGoalsCount(Authentication authentication) {
        String username = authentication.getName();
        long count = goalService.getCompletedGoalsCount(username);
        return ResponseEntity.ok(count);
    }
}
