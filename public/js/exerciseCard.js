document.getElementById("currentWorkout").addEventListener("click", (event) => {
  if (event.target.matches(".add-set-button")) {
    const addButton = event.target;
    const setsRow = addButton.parentElement.querySelector(".sets-row");
    const newSetNumber = setsRow.children.length + 1;
    const setRow = createSetRow(newSetNumber);
    setsRow.appendChild(setRow);
  }
});

function displayCurrentWorkoutExercise(exerciseId, exerciseName) {
  const currentWorkout = document.getElementById("currentWorkout");
  const template = document.getElementById("exercise-card-template");

  // Create a copy of the template
  const card = template.content.cloneNode(true).querySelector(".card");

  // Update the card title with exercise name
  const title = card.querySelector(".card-title");
  title.textContent = `${exerciseName}`;

  // Set the data-exercise-id attribute
  card.setAttribute("data-exercise-id", exerciseId);

  // Update the card content with sets, reps, and weight
  const content = card.querySelector(".card-content");

  // Append the card to the current workout container
  currentWorkout.appendChild(card);
}

function createSetRow(setNumber) {
  const setRow = document.createElement("div");
  setRow.classList.add("row", "mb-3", "set-row");

  const setNumberCol = document.createElement("div");
  setNumberCol.classList.add("col");
  setNumberCol.textContent = setNumber;
  setRow.appendChild(setNumberCol);

  const weightInputCol = document.createElement("div");
  weightInputCol.classList.add("col");
  const weightInput = document.createElement("input");
  weightInput.classList.add("form-control", "weight-input");
  weightInput.setAttribute("type", "number");
  weightInput.setAttribute("step", "0.5");
  weightInput.setAttribute("placeholder", "kg");
  weightInputCol.appendChild(weightInput);
  setRow.appendChild(weightInputCol);

  const repsInputCol = document.createElement("div");
  repsInputCol.classList.add("col");
  const repsInput = document.createElement("input");
  repsInput.classList.add("form-control", "reps-input");
  repsInput.setAttribute("type", "number");
  repsInput.setAttribute("placeholder", "reps");
  repsInputCol.appendChild(repsInput);
  setRow.appendChild(repsInputCol);

  const addButtonCol = document.createElement("div");
  addButtonCol.classList.add("col");
  if (setNumber > 1) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "delete-set-button");
    deleteButton.textContent = "Delete Set";
    deleteButton.addEventListener("click", (event) => {
      setRow.remove();
    });
    addButtonCol.appendChild(deleteButton);
  }
  setRow.appendChild(addButtonCol);

  return setRow;
}
