// Functionality for button to search for exercises
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const search = document.getElementById("search").value;
  const response = await fetch(
    `/api/search?search=${encodeURIComponent(search)}`
  );
  const exercises = await response.json();
  displaySearchResults(exercises);
});

// Display search results
function displaySearchResults(exercises) {
  console.log("Exercises array:", exercises);
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  for (const exercise of exercises) {
    if (!exercise) {
      console.error("No exercises found");
      continue;
    }

    const div = document.createElement("div");
    div.innerHTML = `
      <span>${exercise.name}</span>
      <button class="add-exercise" data-id="${exercise._id}">Add to workout</button>
    `;
    searchResults.appendChild(div);
  }
}

// Event listener for button to add exercise to workout
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("add-exercise")) {
    const exerciseId = e.target.dataset.id;
    const sets = 3;
    const reps = 10;
    const weight = 100;

    const response = await fetch("/api/exercise-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workoutId,
        exerciseId,
        sets,
        reps,
        weight,
      }),
    });

    if (response.ok) {
      console.log("Exercise added to current workout");
    } else {
      console.error("Error adding exercise to current workout");
    }
  }
});

let workoutId;

async function createWorkout(name) {
  const response = await fetch("/api/create-workout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workoutName: name,
    }),
  });

  if (response.ok) {
    const workout = await response.json();
    workoutId = workout._id;
    console.log("Workout ID:", workoutId);
    return true;
  } else {
    console.error("Error creating workout");
    return false;
  }
}

// Event listener for button to finish workout ----- NOT WORKING
document
  .getElementById("finish-workout")
  .addEventListener("click", async () => {
    const response = await fetch(`/api/finish-workout/${workoutId}`, {
      method: "PUT",
    });

    if (response.ok) {
      console.log("Workout finished");
    } else {
      console.error("Error finishing workout");
    }
  });

const workoutName = "My Workout";

(async () => {
  await createWorkout(workoutName);
})();
