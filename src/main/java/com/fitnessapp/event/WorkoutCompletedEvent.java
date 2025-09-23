package com.fitnessapp.event;

import com.fitnessapp.entity.Workout;
import org.springframework.context.ApplicationEvent;

public class WorkoutCompletedEvent extends ApplicationEvent {
    private final Workout workout;

    public WorkoutCompletedEvent(Object source, Workout workout) {
        super(source);
        this.workout = workout;
    }

    public Workout getWorkout() {
        return workout;
    }
}