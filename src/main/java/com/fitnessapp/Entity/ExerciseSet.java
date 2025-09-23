package com.fitnessapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_sets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_exercise_id", nullable = false)
    private WorkoutExercise workoutExercise;

    @Column(name = "set_number", nullable = false)
    private Integer setNumber;

    @Column(name = "actual_reps")
    private Integer actualReps;

    @Column(name = "actual_weight")
    private Double actualWeight;

    @Column(name = "actual_duration_seconds")
    private Integer actualDurationSeconds;

    @Column(name = "actual_distance_meters")
    private Double actualDistanceMeters;

    @Column(name = "rpe_score")
    private Integer rpeScore; // Rate of Perceived Exertion (1-10)

    @Column(name = "rest_time_seconds")
    private Integer restTimeSeconds;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, COMPLETED, FAILED
    }

    public void completeSet() {
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    public void failSet() {
        this.status = Status.FAILED;
        this.completedAt = LocalDateTime.now();
    }
}