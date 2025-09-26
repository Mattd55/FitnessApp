package com.fitnessapp.entity;

import com.fitnessapp.enums.ExerciseCategory;
import com.fitnessapp.enums.ExerciseEquipment;
import com.fitnessapp.enums.ExerciseDifficulty;
import com.fitnessapp.enums.MuscleGroup;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private ExerciseCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseEquipment equipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseDifficulty difficulty;

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
    @JsonIgnore
    private User createdBy;
}