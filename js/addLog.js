const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
console.log("logMovie.js loaded");


document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("mediaSearchForm");
  const searchInput = document.getElementById("mediaSearchInput");
  const searchResults = document.getElementById("searchResults");
  const suggestionsBox = document.getElementById("suggestions");

  const searchSection = document.getElementById("searchSection");
  const resultsSection = document.getElementById("resultsSection");
  const backBtn = document.getElementById("backToSearchBtn");

  if (!searchForm || !searchInput) return;

  searchInput.addEventListener("input", () => {
    clearTimeout(window.debounceTimer);
    const query = searchInput.value.trim();
    if (!query) { suggestionsBox.innerHTML = ""; return; }

    window.debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        suggestionsBox.innerHTML = "";

        if (data.results && data.results.length > 0) {
          data.results.slice(0, 5).forEach(item => {
            const title = item.title || item.name;
            const year = item.release_date?.slice(0,4) || item.first_air_date?.slice(0,4) || "N/A";
            const type = item.media_type; // "movie" or "tv"

            const li = document.createElement("li");
            li.textContent = `${title} (${year}) [${type}]`;
            li.addEventListener("click", () => {
              window.location.href = `logMovie.html?id=${item.id}&type=${type}`;
            });
            suggestionsBox.appendChild(li);
          });
        }
      } catch (err) { console.error("Suggestion error:", err); }
    }, 300);
  });

  document.addEventListener("click", e => {
    if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
      suggestionsBox.innerHTML = "";
    }
  });

  searchForm.addEventListener("submit", async e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        searchResults.innerHTML = "";
        data.results.forEach(item => {
          const title = item.title || item.name;
          const year = item.release_date?.slice(0,4) || item.first_air_date?.slice(0,4) || "N/A";
          const type = item.media_type;

          const li = document.createElement("li");
          li.textContent = `${title} (${year}) [${type}]`;
          li.style.cursor = "pointer";
          li.addEventListener("click", () => {
            window.location.href = `logMovie.html?id=${item.id}&type=${type}`;
          });
          searchResults.appendChild(li);
        });
      } else {
        searchResults.innerHTML = "<li>No results found</li>";
      }

      searchSection.style.display = "none";
      resultsSection.style.display = "block";
    } catch (err) {
      console.error("Search error:", err);
      searchResults.innerHTML = "<li>Error fetching media</li>";
    }
  });

  backBtn.addEventListener("click", () => {
    resultsSection.style.display = "none";
    searchSection.style.display = "block";
    searchResults.innerHTML = "";
    searchInput.value = "";
  });
});
