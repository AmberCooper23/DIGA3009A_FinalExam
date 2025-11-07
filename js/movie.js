const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// ✨ Reworked fetchFilms with all-pages + loading spinner
async function fetchFilms(endpoint, listId, allPages = false) {
  try {
    const list = document.querySelector(listId);
    if (!list) return;

    // add loading spinner
    list.innerHTML = "<p style='text-align:center; padding:20px;'>Loading...</p>";

    let allResults = [];
    const totalPages = allPages ? 10 : 1;

    for (let page = 1; page <= totalPages; page++) {
      const url = `${BASE_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=en-US&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        allResults = allResults.concat(data.results);
      } else {
        break; // stop when there’s no more results
      }
    }

    if (allResults.length === 0) {
      list.innerHTML = "<p>No results found.</p>";
      return;
    }

    list.innerHTML = "";
    allResults.forEach(movie => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      const title = document.createElement('p');

      img.src = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '';
      img.alt = movie.title;
      title.textContent = movie.title;

      li.addEventListener('click', () => {
        window.location.href = `${window.location.origin}/DIGA3009A_FinalExam/pages/movieInfo.html?id=${movie.id}`;
      });

      li.append(img, title);
      list.appendChild(li);
    });

  } catch (err) {
    console.error('Error fetching films:', err);
  }
}

// Initial curated lists
fetchFilms('movie/popular', '#popularList');
fetchFilms('discover/movie?sort_by=popularity.desc&primary_release_date.gte=1990-01-01&primary_release_date.lte=2005-12-31', '#millennialList');
fetchFilms('discover/movie?sort_by=popularity.desc&with_origin_country=ZA', '#saList');

// Filter logic
const yearFilter = document.getElementById('yearFilters');
const ratingFilter = document.getElementById('ratingFilters');
const popularFilter = document.getElementById('popularFilter');
const genreFilter = document.getElementById('genreFilters');
const resetButton = document.getElementById('resetFilters');

const filteredSection = document.getElementById('filterSection');
const filteredList = document.getElementById('filteredList');
const filteredHeader = filteredSection.querySelector('h2');
const allSections = document.querySelectorAll('main > section:not(.filters)');

filteredSection.style.display = "none";

[yearFilter, ratingFilter, popularFilter, genreFilter].forEach(select => {
  if (select) select.addEventListener('change', applyFilters);
});

resetButton.addEventListener('click', () => {
  [yearFilter, ratingFilter, popularFilter, genreFilter].forEach(select => (select.value = ""));
  filteredSection.style.display = "none";
  allSections.forEach(section => (section.style.display = 'block'));
  filteredHeader.textContent = "Filtered Results";
});

async function applyFilters() {
  const year = yearFilter.value;
  const rating = ratingFilter.value;
  const popular = popularFilter.value;
  const genre = genreFilter.value;

  if (!year && !rating && !popular && !genre) {
    filteredSection.style.display = "none";
    allSections.forEach(sec => (sec.style.display = 'block'));
    return;
  }

  allSections.forEach(sec => (sec.style.display = 'none'));
  filteredSection.style.display = 'block';
  filteredList.innerHTML = '';

  let endpoint = 'discover/movie?sort_by=popularity.desc';

  const decadeRanges = {
    '2020s': ['2020-01-01', '2029-12-31'],
    '2010s': ['2010-01-01', '2019-12-31'],
    '2000s': ['2000-01-01', '2009-12-31'],
    '1990s': ['1990-01-01', '1999-12-31'],
    '1980s': ['1980-01-01', '1989-12-31'],
  };

  if (decadeRanges[year]) {
    const [gte, lte] = decadeRanges[year];
    endpoint += `&primary_release_date.gte=${gte}&primary_release_date.lte=${lte}`;
  }

  // Balanced top-rated filter (avoids obscure stuff)
  if (rating === 'desc') {
    endpoint = `discover/movie?sort_by=vote_average.desc&vote_count.gte=2000&vote_average.gte=7.5`;
  } else if (rating === 'asc') {
    endpoint = `discover/movie?sort_by=vote_average.asc&vote_count.gte=2000`;
  }

  if (genre) endpoint += `&with_genres=${genre}`;

  if (popular === 'week') endpoint = 'trending/movie/week';
  else if (popular === 'month') endpoint = 'discover/movie?sort_by=popularity.desc&vote_count.gte=1000';
  else if (popular === 'year') endpoint = 'discover/movie?sort_by=revenue.desc&vote_count.gte=1000';
  else if (popular === 'decade') endpoint = 'discover/movie?sort_by=vote_count.desc&vote_count.gte=1000';

  let headerText = "Filtered Results";
  if (genre) {
    const genreText = genreFilter.options[genreFilter.selectedIndex].text;
    headerText = `${genreText} Movies`;
  }
  if (year) headerText += ` (${year})`;
  if (rating === 'desc') headerText += " – Top Rated (Popular Picks)";
  if (rating === 'asc') headerText += " – Lowest Rated (≥2000 votes)";
  if (popular === 'week') headerText = "Trending This Week";
  if (popular === 'month') headerText = "Trending This Month";
  if (popular === 'year') headerText = "Top Movies of the Year";
  if (popular === 'decade') headerText = "Most Popular This Decade";

  filteredHeader.textContent = headerText;

  // Load multiple pages if rating filter is active
  const allPages = rating !== "";
  await fetchFilms(endpoint, '#filteredList', allPages);
}



