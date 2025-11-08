const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("movieSearchForm");
  const searchInput = document.getElementById("movieSearchInput");
  const searchResults = document.getElementById("searchResults");
  const suggestionsBox = document.getElementById("suggestions");

  let debounceTimer;

  // Autocomplete suggestions
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();
    if (!query) {
      suggestionsBox.innerHTML = "";
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();

        suggestionsBox.innerHTML = "";
        if (data.results && data.results.length > 0) {
          data.results.slice(0, 5).forEach(movie => {
            const li = document.createElement("li");
            li.textContent = `${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : "N/A"})`;
            li.addEventListener("click", () => {
              searchInput.value = movie.title;
              suggestionsBox.innerHTML = "";
              window.location.href = `logMovie.html?id=${movie.id}`;
            });
            suggestionsBox.appendChild(li);
          });
        }
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    }, 300);
  });

  // Hide suggestions when clicking elsewhere
  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
      suggestionsBox.innerHTML = "";
    }
  });

  // Full search results
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
    ${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : "N/A"})
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
