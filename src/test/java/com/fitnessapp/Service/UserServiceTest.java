package com.fitnessapp.service;

import com.fitnessapp.entity.User;
import com.fitnessapp.repository.UserRepository;
import com.fitnessapp.dto.request.auth.RegisterRequest;
import com.fitnessapp.exception.UserAlreadyExistsException;
import com.fitnessapp.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(
            userRepository,
            passwordEncoder,
            jwtService,
            authManager,
            eventPublisher
        );
    }

    @Test
    void registerUser_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFirstName("John");
        request.setLastName("Doe");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("testuser");
        savedUser.setEmail("test@example.com");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(anyString())).thenReturn("jwt-token");

        var response = userService.registerUser(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("Registration successful", response.getMessage());
        assertEquals("testuser", response.getUsername());

        verify(userRepository).save(any(User.class));
        verify(eventPublisher).publishEvent(any());
    }

    @Test
    void registerUser_UsernameExists_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setEmail("new@example.com");

        when(userRepository.findByUsername("existinguser"))
            .thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () ->
            userService.registerUser(request));

        verify(userRepository, never()).save(any(User.class));
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void registerUser_EmailExists_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("existing@example.com");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail("existing@example.com"))
            .thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () ->
            userService.registerUser(request));

        verify(userRepository, never()).save(any(User.class));
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void getUserById_Found() {
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setUsername("testuser");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(userId);

        assertTrue(result.isPresent());
        assertEquals(userId, result.get().getId());
        assertEquals("testuser", result.get().getUsername());
    }

    @Test
    void getUserById_NotFound() {
        Long userId = 999L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(userId);

        assertFalse(result.isPresent());
    }

    @Test
    void updateUserRole_Success() {
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setRole(User.Role.USER);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.updateUserRole(userId, User.Role.TRAINER);

        assertNotNull(result);
        assertEquals(User.Role.TRAINER, result.getRole());
        verify(userRepository).save(user);
    }

    @Test
    void updateUserRole_UserNotFound_ThrowsException() {
        Long userId = 999L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
            userService.updateUserRole(userId, User.Role.TRAINER));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_Success() {
        Long userId = 1L;

        when(userRepository.existsById(userId)).thenReturn(true);

        assertDoesNotThrow(() -> userService.deleteUser(userId));

        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_NotFound_ThrowsException() {
        Long userId = 999L;

        when(userRepository.existsById(userId)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () ->
            userService.deleteUser(userId));

        verify(userRepository, never()).deleteById(any());
    }
}