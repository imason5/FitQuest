// Create input elements with specific styles and attributes
function createInput(colClass, inputClass, type, placeholder) {
  const col = document.createElement("div");
  col.classList.add("col", colClass);
  const input = document.createElement("input");
  input.classList.add("form-control", inputClass);
  input.setAttribute("type", type);
  input.setAttribute("placeholder", placeholder);
  col.appendChild(input);
  return [col, input];
}

// Creates a new row element for a set of an exercise in the workout
function createSetRow(setNumber) {
  const setRow = document.createElement("div");
  setRow.classList.add("row", "mb-3", "set-row");

  const setNumberCol = document.createElement("div");
  setNumberCol.classList.add("col");
  setNumberCol.textContent = setNumber;
  setRow.appendChild(setNumberCol);

  const [weightInputCol] = createInput(
    "weight-input-col",
    "weight-input",
    "number",
    "kg"
  );
  setRow.appendChild(weightInputCol);

  const [repsInputCol] = createInput(
    "reps-input-col",
    "reps-input",
    "number",
    "reps"
  );
  setRow.appendChild(repsInputCol);

  const addButtonCol = document.createElement("div");
  addButtonCol.classList.add("col");
  if (setNumber > 1) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "delete-set-button");
    deleteButton.textContent = "-";
    deleteButton.addEventListener("click", (event) => {
      setRow.remove();
    });
    addButtonCol.appendChild(deleteButton);
  }
  setRow.appendChild(addButtonCol);

  return setRow;
}

// Adds the set to the exercise card
function addSet(event) {
  if (event.target.matches(".add-set-button")) {
    const addButton = event.target;
    const setsRow = addButton.parentElement.querySelector(".sets-row");
    const newSetNumber = setsRow.children.length + 1;
    const setRow = createSetRow(newSetNumber);
    setsRow.appendChild(setRow);
  }
}

document.getElementById("currentWorkout").addEventListener("click", addSet);
