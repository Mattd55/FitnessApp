package com.fitnessapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "measurement_date", nullable = false)
    private LocalDate measurementDate;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "body_fat_percentage")
    private Double bodyFatPercentage;

    @Column(name = "muscle_mass_kg")
    private Double muscleMassKg;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "chest_cm")
    private Double chestCm;

    @Column(name = "waist_cm")
    private Double waistCm;

    @Column(name = "hip_cm")
    private Double hipCm;

    @Column(name = "arm_cm")
    private Double armCm;

    @Column(name = "thigh_cm")
    private Double thighCm;

    @Column(name = "neck_cm")
    private Double neckCm;

    @Column(name = "resting_heart_rate")
    private Integer restingHeartRate;

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Double calculateBMI() {
        if (weightKg != null && heightCm != null && heightCm > 0) {
            double heightM = heightCm / 100.0;
            return weightKg / (heightM * heightM);
        }
        return null;
    }

    public Double calculateWaistToHipRatio() {
        if (waistCm != null && hipCm != null && hipCm > 0) {
            return waistCm / hipCm;
        }
        return null;
    }
}