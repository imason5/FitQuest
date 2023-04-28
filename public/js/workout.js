document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const search = document.getElementById("search").value;
  const response = await fetch(
    `/api/search?search=${encodeURIComponent(search)}`
  );
  const exercises = await response.json();
  displaySearchResults(exercises);
});

function displaySearchResults(exercises) {
  console.log("Exercises array:", exercises); // Add this line
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  const exercise = exercises[0];
  if (!exercise) {
    console.error("No exercises found");
    return;
  }

  const div = document.createElement("div");
  div.innerHTML = `<span>${exercise.name}</span>`;
  searchResults.appendChild(div);
}
