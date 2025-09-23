package com.fitnessapp.controller;

import com.fitnessapp.service.UserService;
import com.fitnessapp.dto.request.auth.LoginRequest;
import com.fitnessapp.dto.response.auth.LoginResponse;
import com.fitnessapp.dto.request.auth.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = userService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        LoginResponse response = userService.registerUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

