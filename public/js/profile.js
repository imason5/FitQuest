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
  card.addEventListener("click", (event) => {
    const deleteButton = event.target.closest('button[type="submit"]');

    if (!deleteButton) {
      console.log("Workout card clicked");
      const workoutModal = document.getElementById("workout-modal");
      if (workoutModal) {
        workoutModal.showModal();
      }
    } else {
      console.log("Delete button clicked");
      confirmDelete(event);
    }
  });
});

const workoutModalCloseButton = document.getElementById("workout-modal-close");
workoutModalCloseButton.addEventListener("click", () => {
  const workoutModal = document.getElementById("workout-modal");
  if (workoutModal) {
    workoutModal.close();
  }
});
