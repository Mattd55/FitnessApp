package com.fitnessapp.dto;

import com.fitnessapp.entity.Exercise;
import com.fitnessapp.enums.MuscleGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDTO {
    private Long id;
    private String name;
    private String description;
    private String instructions;
    private String category;
    private String equipment;
    private String difficulty;
    private List<MuscleGroup> primaryMuscles;
    private List<MuscleGroup> secondaryMuscles;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ExerciseDTO fromEntity(Exercise entity) {
        ExerciseDTO dto = new ExerciseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setInstructions(entity.getInstructions());
        dto.setCategory(entity.getCategory().name());
        dto.setEquipment(entity.getEquipment().name());
        dto.setDifficulty(entity.getDifficulty().name());
        dto.setPrimaryMuscles(entity.getPrimaryMuscles());
        dto.setSecondaryMuscles(entity.getSecondaryMuscles());
        dto.setActive(entity.isActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}