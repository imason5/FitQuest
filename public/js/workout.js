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

  // Select the first exercise in the array
  const exercise = exercises[0];
  if (!exercise) {
    console.error("No exercises found");
    return;
  }

  // Display the exercise name
  const div = document.createElement("div");
  div.innerHTML = `<span>${exercise.name}</span>`;
  searchResults.appendChild(div);
}
