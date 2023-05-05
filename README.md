# FitQuest

<b>[Click here to see deployed project](https://fitness-tracker.adaptable.app/)</b>

<p align="center">
<img  src="/public/images/forReadme.png" style=" width:400x ; height:600px "  >
</p>
<hr>

## Description

FitQuest is a fitness tracker app that allows users to create and track daily workouts. As a full CRUD application, users can log multiple exercises in a workout on a given day. They can track the name, sets, weights and reps of their exercises, and these are assigned a points value based on their difficulty.

On their profile page, users can edit a number of details about themselves like profile pictures and weight, and they can see a summary of their workout history.

Technologies used include JS ES6, Express, MongoDB, Mongoose, and Bootstrap. Styled with a mobile first approach.

This app utilizes the [API Ninjas](https://api-ninjas.com/api/exercises) Exercise API to provide a list of exercises to choose from, complete with difficulty levels, equipment needed, and instructions. It also uses the [Cloudinary](https://cloudinary.com/) API to allow users to upload profile pictures.

Developed at the end of Module Two of the [Ironhack](https://www.ironhack.com/uk/en/web-development/remote) Web Development Bootcamp.

This project was completed with a partner, [Tzu-Yun](https://github.com/gongtzuuuu).

<hr>

## MVP

- A working fitness tracker app that will allow users to:
  1. Sign up and log in
  2. Create a workout
  3. Add exercises to a workout
  4. Edit a workout
  5. Delete a workout
  6. View their workout history
- Authentication for routes
- At least 2 models and 1 relationship
<hr>

## Models

- <b>User model</b>: Represents a user in the application. Each user can have multiple workouts.

- <b>Workout model</b>: Represents a workout session created by a user. Each workout session can have multiple exercise logs.

- <b>ExerciseLog model</b>: Represents an individual exercise performed within a workout session. Each exercise log references a specific exercise from the Exercise model.

- <b>Exercise model</b>: Represents a predefined exercise available in the app. This model doesn't have any direct relationship with other models, but it's referenced by the ExerciseLog model.

- <b>SetSchema model</b>: Represents a set within an exercise log (used in exerciseLogSchema). It doesn't have direct relationships with other models, but it's embedded within the ExerciseLog model in the sets array.

To summarize:

- A User has a one-to-many relationship with Workout.
- A Workout has a one-to-many relationship with ExerciseLog.
- An ExerciseLog has a many-to-one relationship with Exercise.
- An ExerciseLog has a one-to-many relationship (embedded) with SetSchema.

## Data structure

#### server.js

- Entry point to start the server and connect to the database

#### app.js

- Sets up a Node.js web application using the Express framework and loads necessary middleware and configurations. It defines routes for the main page, authentication, session management, protected routes, and API routes for workout data. It also sets up error-handling middleware

#### routes/

- Contains the routes for the application, separated by concern.

- auth.routes.js: authentication (sign up, log in, log out).
- profile.routes.js: routes for user profile page
- session.routes.js: routes for session management (check if user is logged in, redirect to login page if not).
- workout.routes.js: routes for workout data (create, edit, delete, view).

#### middleware/

- route-guard.js: Checks if a user is logged in before allowing access to protected routes.
- inputValidation.js: Validates user input for the sign up and edit profile forms.
- cloudinary.config.js: Configures the Cloudinary API for uploading profile pictures.

#### utils/

- Helper functions for the backend, like storeExercise() which converts the API Ninjas exercise data into a format that can be stored in the database.

#### config/

- session.config.js: Configures the express-session middleware for session management.

#### views/

- auth/: Contains views for authentication (sign up, log in, log out).
- protected/: Contains views for protected routes (user profile page and create workout page).
- index.ejs and layout.ejs

#### js/

- Contains the JavaScript files for the application, separated by concern.
- <b>workout.js</b>: Contains the bulk of the logic for handling the functionality of the workout page. The main features include:

  1. Creating a new workout.
  2. Searching for exercises using an input field and displaying the results.
  3. Adding or removing exercises to/from the current workout.
  4. Showing more information about an exercise, such as equipment needed and instructions.
  5. Displaying a workout summary upon completion, including the total score.

- <b>profile.js</b>: Contains logic for handling the functionality of the profile page. The main features include:

  1. Editing user details such as profile picture, weight, and height.
  2. Displaying a summary of the user's workout history.

- exerciseCard.js: Provides helper logic for handling interactivity on the exercise cards on the workout page.

<hr>

## Backlog

- [ ] Add functionality for recording time and distance for cardio exercises
- [ ] Assign points for 0kg sets with reps (e.g. pushups)

<hr>

## Links

- [Figma Planning](https://www.figma.com/file/vCEEt3DaIejm6TgjVrKNCQ/Project-2--Fitness-Tracker?node-id=0-1&t=HwiKiNRbAhDta7CA-0)
- [Trello Link](https://trello.com/b/c5HyXBKN/fitness-tracker)
- [Slides Link](https://docs.google.com/presentation/d/1vtWyc9qhIkNVNhLna_6XMRuG0zeLyOb4n0h1UxaZfaw/edit?usp=sharing)
- [Github repository Link](https://github.com/imason5/FitQuest)
- [Deployment Link](https://fitness-tracker.adaptable.app/)
