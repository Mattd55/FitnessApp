package com.fitnessapp.service;

import com.fitnessapp.entity.User;
import com.fitnessapp.entity.UserProgress;
import com.fitnessapp.repository.UserProgressRepository;
import com.fitnessapp.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;

    public UserProgressService(UserProgressRepository progressRepository, UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @CacheEvict(value = "userProgress", key = "#username")
    public UserProgress createProgressEntry(String username, UserProgress progressEntry) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        progressEntry.setUser(user);
        progressEntry.setCreatedAt(LocalDateTime.now());
        progressEntry.setUpdatedAt(LocalDateTime.now());

        return progressRepository.save(progressEntry);
    }

    @Cacheable(value = "userProgress", key = "#username")
    public Page<UserProgress> getUserProgressHistory(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return progressRepository.findByUserOrderByMeasurementDateDesc(user, pageable);
    }

    public Optional<UserProgress> getLatestProgress(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return progressRepository.findFirstByUserOrderByMeasurementDateDesc(user);
    }

    @CacheEvict(value = "userProgress", key = "#username")
    public UserProgress updateProgressEntry(String username, Long progressId, UserProgress updatedProgress) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        UserProgress existingProgress = progressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Progress entry not found: " + progressId));

        if (!existingProgress.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Progress entry does not belong to user: " + username);
        }

        // Update fields
        existingProgress.setMeasurementDate(updatedProgress.getMeasurementDate());
        existingProgress.setWeightKg(updatedProgress.getWeightKg());
        existingProgress.setHeightCm(updatedProgress.getHeightCm());
        existingProgress.setBodyFatPercentage(updatedProgress.getBodyFatPercentage());
        existingProgress.setMuscleMassKg(updatedProgress.getMuscleMassKg());
        existingProgress.setWaistCm(updatedProgress.getWaistCm());
        existingProgress.setChestCm(updatedProgress.getChestCm());
        existingProgress.setArmCm(updatedProgress.getArmCm());
        existingProgress.setThighCm(updatedProgress.getThighCm());
        existingProgress.setHipCm(updatedProgress.getHipCm());
        existingProgress.setNeckCm(updatedProgress.getNeckCm());
        existingProgress.setBloodPressureSystolic(updatedProgress.getBloodPressureSystolic());
        existingProgress.setBloodPressureDiastolic(updatedProgress.getBloodPressureDiastolic());
        existingProgress.setRestingHeartRate(updatedProgress.getRestingHeartRate());
        existingProgress.setNotes(updatedProgress.getNotes());
        existingProgress.setUpdatedAt(LocalDateTime.now());

        return progressRepository.save(existingProgress);
    }

    @CacheEvict(value = "userProgress", key = "#username")
    public void deleteProgressEntry(String username, Long progressId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        UserProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new IllegalArgumentException("Progress entry not found: " + progressId));

        if (!progress.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Progress entry does not belong to user: " + username);
        }

        progressRepository.deleteById(progressId);
    }
}