package com.fitnessapp.service;

import com.fitnessapp.entity.Exercise;
import com.fitnessapp.entity.User;
import com.fitnessapp.enums.ExerciseCategory;
import com.fitnessapp.enums.ExerciseEquipment;
import com.fitnessapp.enums.ExerciseDifficulty;
import com.fitnessapp.enums.MuscleGroup;
import com.fitnessapp.repository.ExerciseRepository;
import com.fitnessapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataSeedingService implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (exerciseRepository.count() == 0) {
            log.info("Database is empty. Seeding sample exercises...");
            seedExercises();
            log.info("Sample exercises seeded successfully!");
        } else {
            log.info("Database already contains {} exercises. Skipping seeding.", exerciseRepository.count());
        }
    }

    private void seedExercises() {
        User systemUser = getOrCreateSystemUser();

        List<Exercise> exercises = Arrays.asList(
            // STRENGTH EXERCISES - BODYWEIGHT
            createExercise(
                "Push-ups",
                "Classic upper body bodyweight exercise targeting chest, shoulders, and triceps.",
                "1. Start in a plank position with hands slightly wider than shoulders. 2. Lower your body until chest nearly touches the floor. 3. Push back up to starting position. 4. Keep your body in a straight line throughout the movement.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CHEST, MuscleGroup.TRICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Bodyweight Squats",
                "Fundamental lower body exercise targeting legs and glutes.",
                "1. Stand with feet shoulder-width apart. 2. Lower your body by bending knees and pushing hips back. 3. Descend until thighs are parallel to floor. 4. Drive through heels to return to starting position.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Pull-ups",
                "Upper body pulling exercise requiring a pull-up bar.",
                "1. Hang from pull-up bar with palms facing away. 2. Pull your body up until chin clears the bar. 3. Lower yourself back down with control. 4. Keep core engaged throughout the movement.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.PULL_UP_BAR,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.BICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.CORE),
                systemUser
            ),

            // STRENGTH EXERCISES - DUMBBELL
            createExercise(
                "Dumbbell Bench Press",
                "Classic chest exercise performed with dumbbells on a bench.",
                "1. Lie on bench with dumbbell in each hand. 2. Start with arms extended above chest. 3. Lower dumbbells until they're level with chest. 4. Press back up to starting position.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.DUMBBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.CHEST, MuscleGroup.TRICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            createExercise(
                "Dumbbell Rows",
                "Back strengthening exercise performed with dumbbells.",
                "1. Hold dumbbell in each hand, hinge at hips. 2. Keep back straight and core engaged. 3. Pull dumbbells to your ribcage. 4. Lower with control to starting position.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.DUMBBELL,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.BICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.CORE),
                systemUser
            ),

            // STRENGTH EXERCISES - BARBELL
            createExercise(
                "Barbell Deadlift",
                "Compound movement targeting posterior chain muscles.",
                "1. Stand with feet hip-width apart, barbell over mid-foot. 2. Hinge at hips and knees to grip bar. 3. Drive through heels, extend hips and knees simultaneously. 4. Stand tall, then lower bar with control.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.BARBELL,
                ExerciseDifficulty.ADVANCED,
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK),
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Barbell Squat",
                "The king of leg exercises performed with a barbell.",
                "1. Position barbell on upper back, feet shoulder-width apart. 2. Initiate movement by pushing hips back. 3. Lower until thighs are parallel to floor. 4. Drive through heels to stand back up.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.BARBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CORE, MuscleGroup.BACK),
                systemUser
            ),

            // CARDIO EXERCISES
            createExercise(
                "Burpees",
                "Full-body cardio exercise combining squat, plank, and jump.",
                "1. Start standing, drop into squat position. 2. Place hands on ground, jump feet back into plank. 3. Perform push-up (optional). 4. Jump feet back to squat, then jump up with arms overhead.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.FULL_BODY, MuscleGroup.CARDIO),
                Arrays.asList(MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Jump Rope",
                "Classic cardio exercise great for coordination and endurance.",
                "1. Hold jump rope handles at hip level. 2. Use wrists to spin rope overhead and under feet. 3. Jump just high enough to clear rope. 4. Land softly on balls of feet.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CARDIO, MuscleGroup.CALVES),
                Arrays.asList(MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Mountain Climbers",
                "Dynamic cardio exercise targeting core and improving cardiovascular fitness.",
                "1. Start in plank position. 2. Quickly alternate bringing knees to chest. 3. Keep core tight and maintain plank position. 4. Move at a fast, controlled pace.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CARDIO, MuscleGroup.CORE),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            // FLEXIBILITY EXERCISES
            createExercise(
                "Downward Dog",
                "Yoga pose that stretches hamstrings, calves, and shoulders.",
                "1. Start on hands and knees. 2. Tuck toes, lift hips up and back. 3. Straighten legs as much as comfortable. 4. Press hands into ground, lengthen spine.",
                ExerciseCategory.FLEXIBILITY,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CALVES),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.BACK),
                systemUser
            ),

            createExercise(
                "Pigeon Pose",
                "Deep hip flexor and glute stretch.",
                "1. From downward dog, bring right knee forward behind right wrist. 2. Extend left leg back straight. 3. Square hips and fold forward over front leg. 4. Hold, then switch sides.",
                ExerciseCategory.FLEXIBILITY,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.GLUTES, MuscleGroup.CORE),
                Arrays.asList(MuscleGroup.HAMSTRINGS),
                systemUser
            ),

            // MACHINE EXERCISES
            createExercise(
                "Lat Pulldown",
                "Machine exercise targeting the latissimus dorsi muscles.",
                "1. Sit at lat pulldown machine, grip bar wider than shoulder-width. 2. Pull bar down to upper chest. 3. Squeeze shoulder blades together. 4. Slowly return to starting position.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.BICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            createExercise(
                "Leg Press",
                "Machine exercise for lower body strength.",
                "1. Sit in leg press machine with feet on platform. 2. Lower weight until knees reach 90-degree angle. 3. Press through heels to extend legs. 4. Don't lock knees completely at top.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CALVES),
                systemUser
            ),

            // KETTLEBELL EXERCISES
            createExercise(
                "Kettlebell Swings",
                "Dynamic exercise targeting posterior chain and cardiovascular system.",
                "1. Stand with feet shoulder-width apart, kettlebell between feet. 2. Hinge at hips, grip kettlebell with both hands. 3. Drive hips forward to swing kettlebell to shoulder height. 4. Let kettlebell swing back down between legs.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.KETTLEBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.CORE, MuscleGroup.BACK),
                systemUser
            ),

            // RESISTANCE BAND EXERCISES
            createExercise(
                "Resistance Band Rows",
                "Upper body pulling exercise using resistance bands.",
                "1. Anchor resistance band at chest height. 2. Hold handles, step back to create tension. 3. Pull handles to ribcage, squeezing shoulder blades. 4. Slowly return to starting position.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.RESISTANCE_BAND,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.BICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            // MEDICINE BALL EXERCISES
            createExercise(
                "Medicine Ball Slams",
                "Explosive full-body exercise using a medicine ball.",
                "1. Hold medicine ball overhead with both hands. 2. Engage core and slam ball down forcefully. 3. Squat down to pick up ball. 4. Return to standing and repeat.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MEDICINE_BALL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.CORE, MuscleGroup.SHOULDERS),
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.GLUTES),
                systemUser
            ),

            // ADVANCED EXERCISES
            createExercise(
                "Turkish Get-up",
                "Complex full-body movement requiring coordination and stability.",
                "1. Lie on back holding kettlebell in right hand overhead. 2. Sit up, keeping weight overhead. 3. Move through half-kneeling to standing. 4. Reverse the movement back to lying position.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.KETTLEBELL,
                ExerciseDifficulty.EXPERT,
                Arrays.asList(MuscleGroup.FULL_BODY, MuscleGroup.CORE),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.GLUTES),
                systemUser
            ),

            createExercise(
                "Pistol Squat",
                "Single-leg squat requiring balance, flexibility, and strength.",
                "1. Stand on one leg, extend other leg forward. 2. Lower body by bending standing leg. 3. Descend as low as possible while keeping extended leg off ground. 4. Drive through heel to return to standing.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.EXPERT,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CORE, MuscleGroup.CALVES),
                systemUser
            ),

            createExercise(
                "Plank",
                "Isometric core strengthening exercise.",
                "1. Start in push-up position. 2. Lower to forearms, keeping body straight. 3. Engage core, glutes, and legs. 4. Hold position while breathing normally.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CORE),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.GLUTES),
                systemUser
            )
        );

        exerciseRepository.saveAll(exercises);
    }

    private Exercise createExercise(
            String name,
            String description,
            String instructions,
            ExerciseCategory category,
            ExerciseEquipment equipment,
            ExerciseDifficulty difficulty,
            List<MuscleGroup> primaryMuscles,
            List<MuscleGroup> secondaryMuscles,
            User createdBy
    ) {
        Exercise exercise = new Exercise();
        exercise.setName(name);
        exercise.setDescription(description);
        exercise.setInstructions(instructions);
        exercise.setCategory(category);
        exercise.setEquipment(equipment);
        exercise.setDifficulty(difficulty);
        exercise.setPrimaryMuscles(primaryMuscles);
        exercise.setSecondaryMuscles(secondaryMuscles);
        exercise.setActive(true);
        exercise.setCreatedBy(createdBy);
        return exercise;
    }

    private User getOrCreateSystemUser() {
        return userRepository.findByUsername("system")
                .orElseGet(() -> {
                    User systemUser = new User();
                    systemUser.setUsername("system");
                    systemUser.setEmail("system@fitnessapp.com");
                    systemUser.setFirstName("System");
                    systemUser.setLastName("User");
                    systemUser.setPassword("N/A"); // System user doesn't need a real password
                    return userRepository.save(systemUser);
                });
    }
}