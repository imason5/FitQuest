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
