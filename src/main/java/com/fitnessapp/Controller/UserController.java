package com.fitnessapp.controller;

import com.fitnessapp.dto.mapper.UserMapper;
import com.fitnessapp.dto.response.user.UserResponse;
import com.fitnessapp.entity.User;
import com.fitnessapp.entity.UserProgress;
import com.fitnessapp.service.UserService;
import com.fitnessapp.service.UserProgressService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserProgressService userProgressService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserProgressService userProgressService, UserMapper userMapper) {
        this.userService = userService;
        this.userProgressService = userProgressService;
        this.userMapper = userMapper;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUserProfile(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(u -> ResponseEntity.ok(userMapper.userToUserResponse(u)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateCurrentUserProfile(@Valid @RequestBody User updatedProfile,
                                                               Authentication authentication) {
        String username = authentication.getName();
        User updatedUser = userService.updateUserProfile(username, updatedProfile);
        return ResponseEntity.ok(userMapper.userToUserResponse(updatedUser));
    }

    @PostMapping("/progress")
    public ResponseEntity<UserProgress> createProgressEntry(@Valid @RequestBody UserProgress progressEntry,
                                                          Authentication authentication) {
        String username = authentication.getName();
        UserProgress savedProgress = userProgressService.createProgressEntry(username, progressEntry);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProgress);
    }

    @GetMapping("/progress")
    public ResponseEntity<Page<UserProgress>> getUserProgress(Authentication authentication, Pageable pageable) {
        String username = authentication.getName();
        Page<UserProgress> progressHistory = userProgressService.getUserProgressHistory(username, pageable);
        return ResponseEntity.ok(progressHistory);
    }

    @GetMapping("/progress/latest")
    public ResponseEntity<UserProgress> getLatestProgress(Authentication authentication) {
        String username = authentication.getName();
        Optional<UserProgress> latestProgress = userProgressService.getLatestProgress(username);
        return latestProgress.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/progress/{id}")
    public ResponseEntity<UserProgress> updateProgressEntry(@PathVariable Long id,
                                                          @Valid @RequestBody UserProgress updatedProgress,
                                                          Authentication authentication) {
        String username = authentication.getName();
        UserProgress updated = userProgressService.updateProgressEntry(username, id, updatedProgress);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgressEntry(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        userProgressService.deleteProgressEntry(username, id);
        return ResponseEntity.noContent().build();
    }
}