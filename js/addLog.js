const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("mediaSearchForm");
  const searchInput = document.getElementById("mediaSearchInput");
  const searchResults = document.getElementById("searchResults");
  const suggestionsBox = document.getElementById("suggestions");

  if (!searchForm || !searchInput) return;

  let debounceTimer;

  // Autocomplete suggestions
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();
    if (!query) { suggestionsBox.innerHTML = ""; return; }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        suggestionsBox.innerHTML = "";

        if (data.results && data.results.length > 0) {
          data.results.slice(0, 5).forEach(item => {
            const title = item.title || item.name;
            const year = item.release_date?.slice(0,4) || item.first_air_date?.slice(0,4) || "N/A";
            const li = document.createElement("li");
            li.textContent = `${title} (${year})`;
            li.addEventListener("click", () => {
              searchInput.value = title;
              suggestionsBox.innerHTML = "";
            });
            suggestionsBox.appendChild(li);
          });
        }
      } catch (err) { console.error("Suggestion error:", err); }
    }, 300);
  });

  // Hide suggestions when clicking elsewhere
  document.addEventListener("click", e => {
    if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
      suggestionsBox.innerHTML = "";
    }
  });

  // Full search results with Director
  searchForm.addEventListener("submit", async e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      searchResults.innerHTML = "";

      if (data.results && data.results.length > 0) {
        for (const item of data.results) {
          const id = item.id;
          const mediaType = item.media_type;
          const title = item.title || item.name;
          const year = item.release_date?.slice(0,4) || item.first_air_date?.slice(0,4) || "N/A";

          let director = "";
          try {
            const creditsRes = await fetch(`${BASE_URL}/${mediaType}/${id}/credits?api_key=${API_KEY}`);
            const creditsData = await creditsRes.json();
            const directorObj = creditsData.crew.find(person => person.job === "Director");
            if (directorObj) director = directorObj.name;
          } catch (err) {
            console.error("Credits fetch error:", err);
          }

          const li = document.createElement("li");
          li.textContent = director ? `${title} (${year}) ${director}` : `${title} (${year})`;
          searchResults.appendChild(li);
        }
      } else {
        searchResults.innerHTML = "<li>No results found</li>";
      }
    } catch (err) {
      console.error("Search error:", err);
      searchResults.innerHTML = "<li>Error fetching media</li>";
    }
  });
});
