document.addEventListener("DOMContentLoaded", () => {
  console.log("fitness-tracker JS imported successfully!");
});

const dialogTriggers = document.querySelectorAll("[data-trigger-dialog]");
dialogTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    const dialog = document.getElementById(trigger.dataset.triggerDialog);
    if (dialog) {
      dialog.showModal();
    }
  });
});

function confirmDelete(event, workoutDate) {
  event.preventDefault();
  const form = event.target.form;
  const workoutId = form.action.split("/").pop();
  const confirmDelete = confirm(
    `Are you sure you want to delete this workout?`
  );
  if (confirmDelete) {
    document.getElementById(`delete-workout-form-${workoutId}`).submit();
  }
}

// -------------- SHOW WORKOUT MODAL --------------

const workoutCards = document.querySelectorAll(".workout-card");
workoutCards.forEach((card) => {
  card.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest('button[type="submit"]');

    if (!deleteButton) {
      console.log("Workout card clicked");
      const workoutModal = document.getElementById("workout-modal");
      const workoutId = card.dataset.workoutId;

      try {
        const workoutResponse = await fetch(`workout/get-workout/${workoutId}`);
        const workout = await workoutResponse.json();

        const exerciseLogsResponse = await fetch(
          `workout/exercise-log/${workoutId}`
        );
        const exerciseLogs = await exerciseLogsResponse.json();

        updateWorkoutModal(workout, exerciseLogs);
      } catch (error) {
        console.error("Error fetching workout details:", error);
      }

      if (workoutModal) {
        workoutModal.showModal();
      }
    } else {
      console.log("Delete button clicked");
      confirmDelete(event);
    }
  });
});

document
  .getElementById("workout-modal")
  .addEventListener("show.bs.modal", async function (event) {
    // Get the workoutId from the data-workout-id attribute of the element that triggered the modal
    const workoutId = event.relatedTarget.dataset.workoutId;

    // Fetch the workout data
    try {
      const workoutResponse = await fetch(`workout/get-workout/${workoutId}`);
      const workout = await workoutResponse.json();

      // Fetch the exercise logs for the workout
      const exerciseLogsResponse = await fetch(
        `workout/exercise-log/${workoutId}`
      );
      const exerciseLogs = await exerciseLogsResponse.json();

      // Update the workout modal's content with the fetched data
      updateWorkoutModal(workout, exerciseLogs);
    } catch (error) {
      console.error("Error fetching workout details:", error);
    }
  });

function updateWorkoutModal(workout, exerciseLogs) {
  const workoutModalContent = document.getElementById("workout-modal-content");

  // Clear the modal content
  workoutModalContent.innerHTML = "";

  // Create an element to display the workout's name
  const workoutName = document.createElement("h4");
  workoutName.textContent = `Workout: ${workout.name}`;
  workoutModalContent.appendChild(workoutName);

  // Create an element to display the workout's date
  const workoutDate = document.createElement("p");
  const formattedDate = new Date(workout.date).toLocaleDateString();
  workoutDate.textContent = `Date: ${formattedDate}`;
  workoutModalContent.appendChild(workoutDate);

  // Create an element to display the workout's total weight
  const workoutTotalWeight = document.createElement("p");
  workoutTotalWeight.textContent = `Total weight: ${workout.totalWeight} lbs`;
  workoutModalContent.appendChild(workoutTotalWeight);

  // Create an element to display the workout's notes
  const workoutNotes = document.createElement("p");
  workoutNotes.textContent = `Notes: ${workout.notes}`;
  workoutModalContent.appendChild(workoutNotes);

  // Create a list to display the exercise logs
  const exerciseLogList = document.createElement("ul");
  workoutModalContent.appendChild(exerciseLogList);

  // Loop through the exercise logs and display their details
  exerciseLogs.forEach((log) => {
    const exerciseLogItem = document.createElement("li");

    const exerciseName = document.createElement("h5");
    exerciseName.textContent = log.exerciseId.name;
    exerciseLogItem.appendChild(exerciseName);

    const setsList = document.createElement("ul");
    log.sets.forEach((set, index) => {
      const setItem = document.createElement("li");
      setItem.textContent = `Set ${index + 1}: ${set.reps} reps, ${
        set.weight
      } lbs`;
      setsList.appendChild(setItem);
    });

    exerciseLogItem.appendChild(setsList);
    exerciseLogList.appendChild(exerciseLogItem);
  });
}

const workoutModalCloseButton = document.getElementById("workout-modal-close");
workoutModalCloseButton.addEventListener("click", () => {
  const workoutModal = document.getElementById("workout-modal");
  if (workoutModal) {
    workoutModal.close();
  }
});
