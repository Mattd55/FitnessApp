package com.fitnessapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalStatus status = GoalStatus.ACTIVE;

    @Column(name = "target_value")
    private Double targetValue;

    @Column(name = "current_value")
    private Double currentValue;

    @Column(name = "unit")
    private String unit;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "started_date")
    private LocalDate startedDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum GoalType {
        WEIGHT_LOSS,
        WEIGHT_GAIN,
        MUSCLE_GAIN,
        BODY_FAT_REDUCTION,
        STRENGTH,
        ENDURANCE,
        FLEXIBILITY,
        WORKOUT_FREQUENCY,
        PERSONAL_RECORD,
        CUSTOM
    }

    public enum GoalStatus {
        ACTIVE,
        COMPLETED,
        ABANDONED,
        PAUSED
    }

    public Double calculateProgress() {
        if (currentValue == null || targetValue == null || targetValue == 0) {
            return 0.0;
        }
        return Math.min((currentValue / targetValue) * 100, 100.0);
    }
}
