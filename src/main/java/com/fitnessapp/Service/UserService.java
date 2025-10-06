package com.fitnessapp.service;

import com.fitnessapp.entity.User;
import com.fitnessapp.repository.UserRepository;
import com.fitnessapp.repository.WorkoutRepository;
import com.fitnessapp.repository.UserProgressRepository;
import com.fitnessapp.repository.GoalRepository;
import com.fitnessapp.dto.request.auth.LoginRequest;
import com.fitnessapp.dto.response.auth.LoginResponse;
import com.fitnessapp.dto.request.auth.RegisterRequest;
import com.fitnessapp.event.UserRegisteredEvent;
import com.fitnessapp.exception.UserAlreadyExistsException;
import com.fitnessapp.security.JwtService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final ApplicationEventPublisher eventPublisher;
    private final WorkoutRepository workoutRepository;
    private final UserProgressRepository userProgressRepository;
    private final GoalRepository goalRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService,
                      AuthenticationManager authManager,
                      ApplicationEventPublisher eventPublisher,
                      WorkoutRepository workoutRepository,
                      UserProgressRepository userProgressRepository,
                      GoalRepository goalRepository,
                      EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.eventPublisher = eventPublisher;
        this.workoutRepository = workoutRepository;
        this.userProgressRepository = userProgressRepository;
        this.goalRepository = goalRepository;
        this.emailService = emailService;
    }

    public LoginResponse registerUser(RegisterRequest request) {
        validateUserDoesNotExist(request.getUsername(), request.getEmail());

        User user = createUserFromRequest(request);
        User savedUser = userRepository.save(user);

        eventPublisher.publishEvent(new UserRegisteredEvent(this, savedUser));

        String token = jwtService.generateToken(savedUser.getUsername());
        return new LoginResponse(token, "Registration successful", savedUser.getUsername());
    }

    public LoginResponse authenticateUser(LoginRequest request) throws AuthenticationException {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtService.generateToken(request.getUsername());
        return new LoginResponse(token, "Login successful", request.getUsername());
    }

    @Transactional(readOnly = true)
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "users", key = "#id")
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "users", key = "#username")
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional(readOnly = true)
    public Page<User> getUsersByRole(User.Role role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }

    @CacheEvict(value = "users", key = "#userId")
    public User updateUserRole(Long userId, User.Role newRole) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        user.setRole(newRole);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @CacheEvict(value = "users", key = "#userId")
    public User updateUserStatus(Long userId, boolean enabled, Boolean accountNonLocked) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        user.setEnabled(enabled);
        if (accountNonLocked != null) {
            user.setAccountNonLocked(accountNonLocked);
        }
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @CacheEvict(value = "users", key = "#username")
    public User updateUserProfile(String username, User updatedProfile) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        // Update profile fields
        user.setFirstName(updatedProfile.getFirstName());
        user.setLastName(updatedProfile.getLastName());
        user.setEmail(updatedProfile.getEmail());

        // Update username if provided and different from current
        if (updatedProfile.getUsername() != null && !updatedProfile.getUsername().equals(username)) {
            // Check if new username already exists
            if (userRepository.findByUsername(updatedProfile.getUsername()).isPresent()) {
                throw new IllegalArgumentException("Username already exists: " + updatedProfile.getUsername());
            }
            user.setUsername(updatedProfile.getUsername());
        }

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @CacheEvict(value = "users", key = "#username")
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public String generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + email));

        // Generate reset token (UUID)
        String resetToken = UUID.randomUUID().toString();

        // Set token expiry (1 hour from now)
        LocalDateTime expiry = LocalDateTime.now().plusHours(1);

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiry);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(email, resetToken);

        return resetToken;
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findAll().stream()
            .filter(u -> token.equals(u.getResetToken()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        // Check if token is expired
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear reset token
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    private void validateUserDoesNotExist(String username, String email) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists: " + username);
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists: " + email);
        }
    }

    private User createUserFromRequest(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(User.Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    public void deleteAccount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        // All related entities (workouts, progress, goals) will be cascade-deleted via JPA
        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> exportUserData(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        java.util.Map<String, Object> exportData = new java.util.HashMap<>();

        // User profile information
        java.util.Map<String, Object> profile = new java.util.HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("role", user.getRole());
        profile.put("createdAt", user.getCreatedAt());
        profile.put("updatedAt", user.getUpdatedAt());
        exportData.put("profile", profile);

        // Workouts - fetch all workouts for user
        exportData.put("workouts", workoutRepository.findByUserOrderByCreatedAtDesc(user, Pageable.unpaged()).getContent());

        // Progress entries - fetch all progress entries for user
        exportData.put("progressHistory", userProgressRepository.findByUserOrderByMeasurementDateDesc(user, Pageable.unpaged()).getContent());

        // Goals - fetch all goals for user
        exportData.put("goals", goalRepository.findByUserId(user.getId(), Pageable.unpaged()).getContent());

        // Export metadata
        java.util.Map<String, Object> metadata = new java.util.HashMap<>();
        metadata.put("exportDate", LocalDateTime.now());
        metadata.put("version", "1.0");
        exportData.put("metadata", metadata);

        return exportData;
    }
}