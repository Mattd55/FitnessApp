package com.fitnessapp.event.listener;

import com.fitnessapp.entity.User;
import com.fitnessapp.event.UserRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class UserEventListener {

    private static final Logger logger = LoggerFactory.getLogger(UserEventListener.class);

    @EventListener
    @Async
    public void handleUserRegistered(UserRegisteredEvent event) {
        User user = event.getUser();
        logger.info("User registered: {} ({})", user.getUsername(), user.getEmail());

        sendWelcomeEmail(user);

        createDefaultUserProfile(user);

        trackUserRegistration(user);
    }

    private void sendWelcomeEmail(User user) {
        logger.info("Sending welcome email to: {}", user.getEmail());
    }

    private void createDefaultUserProfile(User user) {
        logger.info("Creating default profile for user: {}", user.getUsername());
    }

    private void trackUserRegistration(User user) {
        logger.info("Tracking registration analytics for user: {}", user.getUsername());
    }
}