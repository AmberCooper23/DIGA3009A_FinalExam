const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("mediaSearchForm");
  const searchInput = document.getElementById("mediaSearchInput");
  const searchResults = document.getElementById("searchResults");
  const suggestionsBox = document.getElementById("suggestions");

  if (!searchForm || !searchInput) {
    console.error("Search form or input not found in DOM");
    return;
  }

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
        const [movieRes, tvRes] = await Promise.all([
          fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
          fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        ]);
        const movies = (await movieRes.json()).results || [];
        const series = (await tvRes.json()).results || [];
        const results = [...movies, ...series];

        suggestionsBox.innerHTML = "";
        results.slice(0, 5).forEach(item => {
          const li = document.createElement("li");
          const title = item.title || item.name;
          const year = item.release_date?.slice(0,4) || item.first_air_date?.slice(0,4) || "N/A";
          const type = item.title ? "Movie" : "Series";
          li.textContent = `${title} (${year}) [${type}]`;
          li.addEventListener("click", () => {
            searchInput.value = title;
            suggestionsBox.innerHTML = "";
            window.location.href = `logMedia.html?id=${item.id}&type=${type.toLowerCase()}`;
          });
          suggestionsBox.appendChild(li);
        });
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
      const [movieRes, tvRes] = await Promise.all([
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
      ]);
      const movies = (await movieRes.json()).results || [];
      const series = (await tvRes.json()).results || [];
      const results = [...movies, ...series];

      if (results.length > 0) {
        searchResults.innerHTML = results.map(item => {
          const title = item.title || item.name;
          const year = item.release_date?.slice(0,4) || item.first_air_date?.slice(0,4) || "N/A";
          const type = item.title ? "Movie" : "Series";
          return `<li>${title} (${year}) [${type}]</li>`;
        }).join("");
      } else {
        searchResults.innerHTML = "<li>No results found</li>";
      }
    } catch (err) {
      console.error("Search error:", err);
      searchResults.innerHTML = "<li>Error fetching media</li>";
    }
  });
});
