package com.fitnessapp.service;

import com.fitnessapp.entity.Exercise;
import com.fitnessapp.entity.User;
import com.fitnessapp.enums.ExerciseCategory;
import com.fitnessapp.enums.ExerciseEquipment;
import com.fitnessapp.enums.ExerciseDifficulty;
import com.fitnessapp.enums.MuscleGroup;
import com.fitnessapp.repository.ExerciseRepository;
import com.fitnessapp.repository.UserRepository;
import com.fitnessapp.repository.WorkoutExerciseRepository;
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
    private final WorkoutExerciseRepository workoutExerciseRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        long currentCount = exerciseRepository.count();
        if (currentCount < 49) {
            log.info("Database contains {} exercises. Clearing and reseeding with 49 exercises...", currentCount);
            // Delete workout exercises first to avoid foreign key constraint violations
            workoutExerciseRepository.deleteAll();
            exerciseRepository.deleteAll();
            seedExercises();
            log.info("49 sample exercises seeded successfully!");
        } else {
            log.info("Database already contains {} exercises. Skipping seeding.", currentCount);
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
            ),

            // ADDITIONAL STRENGTH EXERCISES - BODYWEIGHT
            createExercise(
                "Lunges",
                "Lower body exercise targeting legs and glutes.",
                "1. Stand tall with feet hip-width apart. 2. Step forward with one leg, lowering hips until both knees are at 90 degrees. 3. Push back to starting position. 4. Alternate legs.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Dips",
                "Bodyweight exercise for triceps and chest using parallel bars or bench.",
                "1. Support yourself on parallel bars or bench edge. 2. Lower body by bending elbows to 90 degrees. 3. Push back up to starting position. 4. Keep core tight throughout.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.TRICEPS, MuscleGroup.CHEST),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            createExercise(
                "Bicycle Crunches",
                "Dynamic core exercise targeting obliques and abs.",
                "1. Lie on back with hands behind head. 2. Bring opposite elbow to opposite knee while extending other leg. 3. Alternate sides in a pedaling motion. 4. Keep lower back pressed to floor.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CORE),
                Arrays.asList(),
                systemUser
            ),

            // ADDITIONAL DUMBBELL EXERCISES
            createExercise(
                "Dumbbell Shoulder Press",
                "Overhead pressing exercise targeting shoulders.",
                "1. Sit or stand with dumbbell in each hand at shoulder height. 2. Press weights overhead until arms are extended. 3. Lower back to shoulder level with control. 4. Keep core engaged.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.DUMBBELL,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS),
                Arrays.asList(MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Dumbbell Bicep Curls",
                "Classic arm exercise targeting biceps.",
                "1. Stand with dumbbell in each hand, arms fully extended. 2. Curl weights up toward shoulders. 3. Squeeze biceps at top. 4. Lower back down with control.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.DUMBBELL,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.BICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            createExercise(
                "Dumbbell Lateral Raises",
                "Isolation exercise for shoulder development.",
                "1. Stand with dumbbell in each hand at sides. 2. Raise arms out to sides until parallel to floor. 3. Pause at top, then lower with control. 4. Keep slight bend in elbows.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.DUMBBELL,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.SHOULDERS),
                Arrays.asList(),
                systemUser
            ),

            createExercise(
                "Dumbbell Lunges",
                "Weighted variation of lunges for increased difficulty.",
                "1. Hold dumbbell in each hand at sides. 2. Step forward into lunge position. 3. Lower until both knees at 90 degrees. 4. Push back to start and alternate legs.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.DUMBBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CORE),
                systemUser
            ),

            // ADDITIONAL BARBELL EXERCISES
            createExercise(
                "Barbell Bench Press",
                "Classic chest exercise performed with barbell.",
                "1. Lie on bench with feet flat on floor. 2. Grip barbell slightly wider than shoulder-width. 3. Lower bar to mid-chest. 4. Press back up to starting position.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.BARBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.CHEST, MuscleGroup.TRICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            createExercise(
                "Barbell Row",
                "Compound back exercise with barbell.",
                "1. Hinge at hips with barbell in hands, back straight. 2. Pull barbell to lower ribcage. 3. Squeeze shoulder blades together. 4. Lower with control.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.BARBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.BICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Overhead Press",
                "Barbell shoulder press performed standing or seated.",
                "1. Start with barbell at shoulder level. 2. Press overhead until arms are fully extended. 3. Lower back to shoulders with control. 4. Keep core tight throughout.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.BARBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS),
                Arrays.asList(MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Romanian Deadlift",
                "Hip-hinge movement targeting hamstrings and glutes.",
                "1. Hold barbell with overhand grip. 2. Hinge at hips, lowering bar along legs. 3. Keep back straight and knees slightly bent. 4. Drive hips forward to return to standing.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.BARBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.CORE),
                systemUser
            ),

            // ADDITIONAL CARDIO EXERCISES
            createExercise(
                "Running",
                "Classic cardiovascular exercise for endurance.",
                "1. Maintain upright posture with relaxed shoulders. 2. Land midfoot and roll through to toes. 3. Swing arms naturally at sides. 4. Keep steady breathing rhythm.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CARDIO, MuscleGroup.QUADRICEPS),
                Arrays.asList(MuscleGroup.HAMSTRINGS, MuscleGroup.CALVES),
                systemUser
            ),

            createExercise(
                "High Knees",
                "Dynamic cardio exercise elevating heart rate.",
                "1. Stand with feet hip-width apart. 2. Quickly drive one knee up to hip level. 3. Alternate legs in rapid succession. 4. Pump arms in running motion.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CARDIO, MuscleGroup.QUADRICEPS),
                Arrays.asList(MuscleGroup.CORE, MuscleGroup.CALVES),
                systemUser
            ),

            createExercise(
                "Rowing Machine",
                "Full-body cardio using rowing machine.",
                "1. Sit on rower with feet secured. 2. Push with legs while pulling handle to chest. 3. Extend arms, then hinge at hips, then bend knees. 4. Maintain strong core throughout.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CARDIO, MuscleGroup.BACK),
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Box Jumps",
                "Plyometric exercise for power and explosiveness.",
                "1. Stand facing sturdy box or platform. 2. Swing arms and jump onto box. 3. Land softly with bent knees. 4. Step down and repeat.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.CALVES, MuscleGroup.CORE),
                systemUser
            ),

            // ADDITIONAL FLEXIBILITY EXERCISES
            createExercise(
                "Cat-Cow Stretch",
                "Spinal mobility exercise from yoga.",
                "1. Start on hands and knees. 2. Arch back, lifting chest and tailbone (cow). 3. Round spine, tucking chin and tailbone (cat). 4. Alternate slowly with breathing.",
                ExerciseCategory.FLEXIBILITY,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.BACK, MuscleGroup.CORE),
                Arrays.asList(),
                systemUser
            ),

            createExercise(
                "Hamstring Stretch",
                "Static stretch for hamstring flexibility.",
                "1. Sit with one leg extended, other bent. 2. Reach toward toes of extended leg. 3. Hold stretch without bouncing. 4. Switch legs and repeat.",
                ExerciseCategory.FLEXIBILITY,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.HAMSTRINGS),
                Arrays.asList(MuscleGroup.BACK),
                systemUser
            ),

            createExercise(
                "Child's Pose",
                "Resting yoga pose that stretches back and hips.",
                "1. Kneel on floor with big toes touching. 2. Sit back on heels and extend arms forward. 3. Lower forehead to ground. 4. Breathe deeply and relax.",
                ExerciseCategory.FLEXIBILITY,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.BACK),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.GLUTES),
                systemUser
            ),

            // ADDITIONAL MACHINE EXERCISES
            createExercise(
                "Cable Chest Fly",
                "Isolation exercise for chest using cable machine.",
                "1. Set cables to chest height, grip handles. 2. Step forward with slight lean. 3. Bring hands together in front of chest. 4. Return to starting position with control.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.CHEST),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            createExercise(
                "Leg Curl",
                "Machine exercise isolating hamstrings.",
                "1. Lie face down on leg curl machine. 2. Curl legs up toward glutes. 3. Squeeze hamstrings at top. 4. Lower with control.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.HAMSTRINGS),
                Arrays.asList(MuscleGroup.CALVES),
                systemUser
            ),

            createExercise(
                "Leg Extension",
                "Machine exercise for quadriceps isolation.",
                "1. Sit in leg extension machine with ankles under pad. 2. Extend legs until straight. 3. Pause and squeeze quads. 4. Lower back down with control.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.QUADRICEPS),
                Arrays.asList(),
                systemUser
            ),

            // CORE-SPECIFIC EXERCISES
            createExercise(
                "Russian Twists",
                "Rotational core exercise targeting obliques.",
                "1. Sit on floor with knees bent, feet lifted. 2. Lean back slightly, holding weight or medicine ball. 3. Rotate torso side to side. 4. Keep core engaged throughout.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MEDICINE_BALL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.CORE),
                Arrays.asList(),
                systemUser
            ),

            createExercise(
                "Hanging Leg Raises",
                "Advanced core exercise using pull-up bar.",
                "1. Hang from pull-up bar with straight arms. 2. Keep legs together, raise them to 90 degrees. 3. Lower with control without swinging. 4. Keep core tight throughout.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.PULL_UP_BAR,
                ExerciseDifficulty.ADVANCED,
                Arrays.asList(MuscleGroup.CORE),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            createExercise(
                "Cable Woodchoppers",
                "Rotational core exercise using cable machine.",
                "1. Set cable to high position, stand sideways. 2. Pull cable diagonally across body. 3. Rotate through core, not just arms. 4. Return to start and repeat both sides.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.CORE),
                Arrays.asList(MuscleGroup.SHOULDERS),
                systemUser
            ),

            // PLYOMETRIC EXERCISES
            createExercise(
                "Jump Squats",
                "Explosive lower body plyometric exercise.",
                "1. Start in squat position. 2. Explode up into a jump. 3. Land softly and immediately lower into next squat. 4. Keep chest up throughout.",
                ExerciseCategory.CARDIO,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.CALVES, MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Clapping Push-ups",
                "Explosive upper body plyometric exercise.",
                "1. Start in push-up position. 2. Lower down, then explosively push up. 3. Clap hands while airborne. 4. Land with control and repeat.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.ADVANCED,
                Arrays.asList(MuscleGroup.CHEST, MuscleGroup.TRICEPS),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.CORE),
                systemUser
            ),

            // FUNCTIONAL TRAINING
            createExercise(
                "Farmer's Walk",
                "Full-body functional exercise carrying heavy weights.",
                "1. Hold heavy dumbbell or kettlebell in each hand. 2. Walk forward with upright posture. 3. Keep shoulders back and core engaged. 4. Maintain controlled breathing.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.DUMBBELL,
                ExerciseDifficulty.INTERMEDIATE,
                Arrays.asList(MuscleGroup.FULL_BODY, MuscleGroup.CORE),
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.BACK),
                systemUser
            ),

            createExercise(
                "Wall Sit",
                "Isometric leg exercise building endurance.",
                "1. Stand with back against wall. 2. Slide down until knees at 90 degrees. 3. Hold position with thighs parallel to floor. 4. Keep core engaged and breathe steadily.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.NONE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES),
                Arrays.asList(MuscleGroup.CORE),
                systemUser
            ),

            createExercise(
                "Face Pulls",
                "Upper back and rear deltoid exercise using cable.",
                "1. Set cable at upper chest height with rope attachment. 2. Pull rope toward face, separating hands. 3. Squeeze shoulder blades together. 4. Return to start with control.",
                ExerciseCategory.STRENGTH,
                ExerciseEquipment.MACHINE,
                ExerciseDifficulty.BEGINNER,
                Arrays.asList(MuscleGroup.SHOULDERS, MuscleGroup.BACK),
                Arrays.asList(MuscleGroup.BICEPS),
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