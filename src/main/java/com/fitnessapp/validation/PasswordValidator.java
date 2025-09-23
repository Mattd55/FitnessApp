package com.fitnessapp.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    @Override
    public void initialize(ValidPassword constraintAnnotation) {
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return false;
        }

        // Disable default constraint violation
        context.disableDefaultConstraintViolation();

        boolean isValid = true;

        // Check minimum length
        if (password.length() < 8) {
            context.buildConstraintViolationWithTemplate("Password must be at least 8 characters long")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check for at least one uppercase letter
        if (!password.matches(".*[A-Z].*")) {
            context.buildConstraintViolationWithTemplate("Password must contain at least one uppercase letter")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check for at least one lowercase letter
        if (!password.matches(".*[a-z].*")) {
            context.buildConstraintViolationWithTemplate("Password must contain at least one lowercase letter")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check for at least one digit
        if (!password.matches(".*[0-9].*")) {
            context.buildConstraintViolationWithTemplate("Password must contain at least one digit")
                   .addConstraintViolation();
            isValid = false;
        }

        // Check for at least one special character
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            context.buildConstraintViolationWithTemplate("Password must contain at least one special character")
                   .addConstraintViolation();
            isValid = false;
        }

        return isValid;
    }
}