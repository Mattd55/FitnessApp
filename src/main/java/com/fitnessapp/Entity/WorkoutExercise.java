package com.fitnessapp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workout_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    @JsonBackReference
    private Workout workout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @NotNull(message = "Order index is required")
    @PositiveOrZero(message = "Order index must be zero or positive")
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Min(value = 1, message = "Planned sets must be at least 1")
    @Column(name = "planned_sets")
    private Integer plannedSets;

    @Min(value = 1, message = "Planned reps must be at least 1")
    @Column(name = "planned_reps")
    private Integer plannedReps;

    @PositiveOrZero(message = "Planned weight must be zero or positive")
    @Column(name = "planned_weight")
    private Double plannedWeight;

    @PositiveOrZero(message = "Planned duration must be zero or positive")
    @Column(name = "planned_duration_seconds")
    private Integer plannedDurationSeconds;

    @PositiveOrZero(message = "Planned distance must be zero or positive")
    @Column(name = "planned_distance_meters")
    private Double plannedDistanceMeters;

    @PositiveOrZero(message = "Rest time must be zero or positive")
    @Column(name = "rest_time_seconds")
    private Integer restTimeSeconds;

    @OneToMany(mappedBy = "workoutExercise", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ExerciseSet> actualSets;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, SKIPPED
    }

    public void startExercise() {
        this.status = Status.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void completeExercise() {
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void skipExercise() {
        this.status = Status.SKIPPED;
        this.updatedAt = LocalDateTime.now();
    }
}