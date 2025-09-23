package com.fitnessapp.event.listener;

import com.fitnessapp.entity.Workout;
import com.fitnessapp.event.WorkoutCompletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class WorkoutEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WorkoutEventListener.class);

    @EventListener
    @Async
    public void handleWorkoutCompleted(WorkoutCompletedEvent event) {
        Workout workout = event.getWorkout();
        logger.info("Workout completed: {} by user: {}",
                   workout.getName(), workout.getUser().getUsername());

        updateUserProgress(workout);

        calculateAchievements(workout);

        sendCompletionNotification(workout);
    }

    private void updateUserProgress(Workout workout) {
        logger.info("Updating progress for user: {}", workout.getUser().getUsername());
    }

    private void calculateAchievements(Workout workout) {
        logger.info("Calculating achievements for workout: {}", workout.getName());
    }

    private void sendCompletionNotification(Workout workout) {
        logger.info("Sending completion notification to: {}", workout.getUser().getEmail());
    }
}