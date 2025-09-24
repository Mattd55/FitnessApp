package com.fitnessapp.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UsernameValidator implements ConstraintValidator<ValidUsername, String> {

    @Override
    public void initialize(ValidUsername constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        if (username == null) {
            return false;
        }

        // Disable default constraint violation
        context.disableDefaultConstraintViolation();

        boolean isValid = true;

        // Check minimum length
        if (username.length() < 3) {
            context.buildConstraintViolationWithTemplate("Username must be at least 3 characters long")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check maximum length
        if (username.length() > 20) {
            context.buildConstraintViolationWithTemplate("Username must not exceed 20 characters")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check for valid characters (alphanumeric, underscore, hyphen)
        if (!username.matches("^[a-zA-Z0-9_-]+$")) {
            context.buildConstraintViolationWithTemplate("Username can only contain letters, numbers, underscores, and hyphens")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check that it starts with a letter or number (not underscore or hyphen)
        if (!username.matches("^[a-zA-Z0-9].*")) {
            context.buildConstraintViolationWithTemplate("Username must start with a letter or number")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check that it doesn't end with underscore or hyphen
        if (username.matches(".*[_-]$")) {
            context.buildConstraintViolationWithTemplate("Username cannot end with underscore or hyphen")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check for consecutive special characters
        if (username.matches(".*[_-]{2,}.*")) {
            context.buildConstraintViolationWithTemplate("Username cannot contain consecutive underscores or hyphens")
                   .addConstraintViolation();
            isValid = false;
        }

        return isValid;
    }
}