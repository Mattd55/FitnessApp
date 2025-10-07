# RepBase - Fitness Tracking Application

A comprehensive full-stack fitness tracking application that helps users manage workouts, track progress, and achieve their fitness goals.

## Features

### 🏋️ Core Functionality
- **Exercise Library**: Browse 49+ exercises with detailed instructions, muscle groups, and difficulty levels
- **Workout Management**: Create, track, and complete custom workouts with real-time progress monitoring
- **Set Tracking**: Log actual reps, weight, and RPE (Rate of Perceived Exertion) for each exercise
- **Progress Tracking**: Monitor your fitness journey with comprehensive progress analytics
- **User Profiles**: Manage personal information and view fitness statistics

### 🔐 Security Features
- JWT-based authentication with secure token management
- Role-based access control (USER, ADMIN, TRAINER)
- Password reset functionality via email
- BCrypt password encryption
- Account deletion and data export capabilities

### 📧 Email Integration
- Password reset emails via SendGrid
- Beautifully designed HTML email templates
- Responsive email layout

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 21
- **Database**: PostgreSQL with JPA/Hibernate
- **Security**: Spring Security with JWT
- **Email**: SendGrid SMTP
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

## Project Structure

```
FitnessApp/
├── src/main/java/com/fitnessapp/
│   ├── controller/       # REST API controllers
│   ├── service/          # Business logic layer
│   ├── repository/       # Data access layer
│   ├── entity/           # JPA entities
│   ├── dto/              # Data transfer objects
│   ├── security/         # JWT and security configuration
│   ├── validator/        # Custom validators
│   └── event/            # Event-driven components
├── src/main/resources/
│   └── application.properties
├── fitness-frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── context/      # React context (Auth)
│   │   └── types/        # TypeScript types
│   └── public/
└── src/test/             # Unit and integration tests
```

## Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18+ and npm
- PostgreSQL 14+
- Maven 3.8+

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FitnessApp.git
   cd FitnessApp
   ```

2. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE fitnessdb;
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE fitnessdb TO your_username;
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   # Database Configuration
   DB_URL=jdbc:postgresql://localhost:5432/fitnessdb
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_generated_jwt_secret_here_at_least_256_bits
   JWT_EXPIRATION=86400000

   # Email Configuration (SendGrid)
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=your_verified_email@example.com
   EMAIL_FROM_NAME=RepBase
   FRONTEND_URL=http://localhost:3000

   # Spring Configuration
   SPRING_PROFILES_ACTIVE=development
   LOG_LEVEL=DEBUG
   ```

   Create `fitness-frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. **Generate a secure JWT secret** (optional but recommended)
   ```bash
   openssl rand -base64 64
   ```

### Running the Application

#### Backend (Spring Boot)
```bash
# From project root
./mvnw spring-boot:run
```
The backend will start on http://localhost:8080

#### Frontend (React)
```bash
# Navigate to frontend directory
cd fitness-frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start
```
The frontend will start on http://localhost:3000

### Building for Production

#### Backend
```bash
./mvnw clean package
java -jar target/fitnessapp-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd fitness-frontend
npm run build
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Exercise Endpoints
- `GET /api/exercises` - Get all exercises (with filtering)
- `GET /api/exercises/{id}` - Get exercise by ID
- `POST /api/exercises` - Create exercise (TRAINER/ADMIN)
- `PUT /api/exercises/{id}` - Update exercise (TRAINER/ADMIN)
- `DELETE /api/exercises/{id}` - Deactivate exercise (ADMIN)

### Workout Endpoints
- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/{id}` - Get workout details
- `PUT /api/workouts/{id}` - Update workout
- `DELETE /api/workouts/{id}` - Delete workout
- `POST /api/workouts/{id}/exercises` - Add exercise to workout
- `POST /api/workouts/{id}/start` - Start workout
- `POST /api/workouts/{id}/complete` - Complete workout

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account
- `GET /api/users/data-export` - Export user data

## Testing

### Backend Tests
```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest
```

### Frontend Tests
```bash
cd fitness-frontend
npm test
```

## Database Schema

The application uses JPA with automatic DDL updates. Key entities include:
- **User**: User accounts with roles
- **Exercise**: Exercise library with categories, equipment, and muscle groups
- **Workout**: User workout plans
- **WorkoutExercise**: Exercises added to workouts with parameters
- **ExerciseSet**: Actual set performance tracking
- **UserProgress**: Fitness progress over time

## Configuration

### Application Profiles
- `development`: Local development with debug logging
- `production`: Production-ready configuration

### Key Configuration Properties
See `src/main/resources/application.properties` for all configurable properties.

## Security Considerations

- All passwords are encrypted using BCrypt
- JWT tokens expire after 24 hours (configurable)
- CORS is configured to allow localhost during development
- Sensitive data is managed via environment variables
- Rate limiting and input validation on all endpoints

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Project Link: [https://github.com/yourusername/FitnessApp](https://github.com/yourusername/FitnessApp)

## Acknowledgments

- Exercise data curated for comprehensive fitness coverage
- SendGrid for email delivery services
- Spring Boot and React communities for excellent documentation
