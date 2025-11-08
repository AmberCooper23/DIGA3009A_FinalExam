// TMDb constants
const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
console.log("addLog.js loaded");


document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("movieSearchForm");
  const searchInput = document.getElementById("movieSearchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchForm || !searchInput || !searchResults) return;

  // Handle search
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        searchResults.innerHTML = data.results.map(movie => `
          <li>
            <img src="${movie.poster_path ? IMG_BASE + movie.poster_path : ''}" alt="${movie.title}" style="height:100px">
            ${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : "N/A"})
            <button class="chooseMovieBtn" data-id="${movie.id}">Choose</button>
          </li>
        `).join("");
      } else {
        searchResults.innerHTML = "<li>No results found</li>";
      }
    } catch (err) {
      console.error("Search error:", err);
      searchResults.innerHTML = "<li>Error fetching movies</li>";
    }
  });

  // Handle choosing a movie
  searchResults.addEventListener("click", (e) => {
    if (e.target.classList.contains("chooseMovieBtn")) {
      const movieId = e.target.dataset.id;
      window.location.href = `logMovie.html?id=${movieId}`;
    }
  });
});
