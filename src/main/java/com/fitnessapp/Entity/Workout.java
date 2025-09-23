package com.fitnessapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private User trainer;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WorkoutExercise> exercises;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PLANNED;

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        PLANNED, IN_PROGRESS, COMPLETED, CANCELLED, SKIPPED
    }

    public void startWorkout() {
        this.status = Status.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void completeWorkout() {
        this.status = Status.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.startedAt != null) {
            this.durationMinutes = (int) java.time.Duration.between(startedAt, completedAt).toMinutes();
        }
    }

    public void cancelWorkout() {
        this.status = Status.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }
}