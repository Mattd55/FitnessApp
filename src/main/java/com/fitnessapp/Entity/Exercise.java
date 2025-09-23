package com.fitnessapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Equipment equipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @ElementCollection
    @CollectionTable(name = "exercise_muscle_groups")
    @Enumerated(EnumType.STRING)
    private List<MuscleGroup> primaryMuscles;

    @ElementCollection
    @CollectionTable(name = "exercise_secondary_muscles")
    @Enumerated(EnumType.STRING)
    private List<MuscleGroup> secondaryMuscles;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    public enum Category {
        STRENGTH, CARDIO, FLEXIBILITY, SPORTS, REHABILITATION
    }

    public enum Equipment {
        NONE, BARBELL, DUMBBELL, KETTLEBELL, RESISTANCE_BAND,
        PULL_UP_BAR, MACHINE, CABLE, MEDICINE_BALL, FOAM_ROLLER
    }

    public enum Difficulty {
        BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    }

    public enum MuscleGroup {
        CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, FOREARMS,
        CORE, GLUTES, QUADRICEPS, HAMSTRINGS, CALVES,
        FULL_BODY, CARDIO
    }
}