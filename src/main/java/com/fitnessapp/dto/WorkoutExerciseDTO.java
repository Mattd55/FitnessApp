package com.fitnessapp.dto;

import com.fitnessapp.entity.WorkoutExercise;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutExerciseDTO {
    private Long id;
    private Integer orderIndex;
    private Integer plannedSets;
    private Integer plannedReps;
    private Double plannedWeight;
    private Integer plannedDurationSeconds;
    private Double plannedDistanceMeters;
    private Integer restTimeSeconds;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ExerciseDTO exercise;

    public static WorkoutExerciseDTO fromEntity(WorkoutExercise entity) {
        WorkoutExerciseDTO dto = new WorkoutExerciseDTO();
        dto.setId(entity.getId());
        dto.setOrderIndex(entity.getOrderIndex());
        dto.setPlannedSets(entity.getPlannedSets());
        dto.setPlannedReps(entity.getPlannedReps());
        dto.setPlannedWeight(entity.getPlannedWeight());
        dto.setPlannedDurationSeconds(entity.getPlannedDurationSeconds());
        dto.setPlannedDistanceMeters(entity.getPlannedDistanceMeters());
        dto.setRestTimeSeconds(entity.getRestTimeSeconds());
        dto.setStatus(entity.getStatus().name());
        dto.setStartedAt(entity.getStartedAt());
        dto.setCompletedAt(entity.getCompletedAt());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setExercise(ExerciseDTO.fromEntity(entity.getExercise()));
        return dto;
    }
}