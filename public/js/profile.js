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

const cancelBtn = document.querySelector("#cancel");
cancelBtn.addEventListener("click", () => {
  dialog.close;
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
