package com.fitnessapp.controller;

import com.fitnessapp.entity.User;
import com.fitnessapp.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainer")
@PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
public class TrainerController {

    private final UserService userService;

    public TrainerController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/clients")
    public ResponseEntity<Page<User>> getClients(Pageable pageable) {
        Page<User> clients = userService.getUsersByRole(User.Role.USER, pageable);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<User> getClientById(@PathVariable Long id) {
        return userService.getUserById(id)
                .filter(user -> user.getRole() == User.Role.USER)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/clients/{clientId}/workouts")
    public ResponseEntity<String> assignWorkoutToClient(@PathVariable Long clientId,
                                                       @RequestBody Long workoutTemplateId,
                                                       Authentication authentication) {
        // Future implementation: Assign workout templates to clients
        return ResponseEntity.ok("Workout assignment feature coming soon");
    }

    @GetMapping("/clients/{clientId}/progress")
    public ResponseEntity<String> getClientProgress(@PathVariable Long clientId, Authentication authentication) {
        // Future implementation: View client progress
        return ResponseEntity.ok("Client progress tracking feature coming soon");
    }
}