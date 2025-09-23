package com.fitnessapp.service;

import com.fitnessapp.entity.User;
import com.fitnessapp.repository.UserRepository;
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

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final ApplicationEventPublisher eventPublisher;

    public UserService(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService,
                      AuthenticationManager authManager,
                      ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.eventPublisher = eventPublisher;
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

        user.setFirstName(updatedProfile.getFirstName());
        user.setLastName(updatedProfile.getLastName());
        user.setEmail(updatedProfile.getEmail());
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
}