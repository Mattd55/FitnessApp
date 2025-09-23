package com.fitnessapp.repository;

import com.fitnessapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username (used for authentication)
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email (useful for registration validation)
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username already exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if email already exists
     */
    boolean existsByEmail(String email);

    /**
     * Find users by role with pagination
     */
    Page<User> findByRole(User.Role role, Pageable pageable);
}
