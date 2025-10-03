package com.fitnessapp.dto;

public class PersonalRecordDTO {
    private String exerciseName;
    private Double maxWeight;
    private Integer maxReps;

    public PersonalRecordDTO(String exerciseName, Double maxWeight, Integer maxReps) {
        this.exerciseName = exerciseName;
        this.maxWeight = maxWeight;
        this.maxReps = maxReps;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public Double getMaxWeight() {
        return maxWeight;
    }

    public void setMaxWeight(Double maxWeight) {
        this.maxWeight = maxWeight;
    }

    public Integer getMaxReps() {
        return maxReps;
    }

    public void setMaxReps(Integer maxReps) {
        this.maxReps = maxReps;
    }
}
