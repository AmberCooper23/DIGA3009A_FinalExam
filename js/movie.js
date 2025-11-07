const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

async function fetchFilms(endpoint, listId) {
  try {
    const separator = endpoint.includes('?') || endpoint.includes('&') ? '&' : '?';
    const response = await fetch(`${BASE_URL}/${endpoint}${separator}api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();

    const list = document.querySelector(listId);
    if (!list) return;
    list.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      list.innerHTML = "<p>No results found.</p>";
      return;
    }

    data.results.slice(0, 10).forEach(movie => {
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

fetchFilms('movie/popular', '#popularList');
fetchFilms(`discover/movie?sort_by=popularity.desc&primary_release_date.gte=1990-01-01&primary_release_date.lte=2005-12-31`, '#millennialList');
fetchFilms('discover/movie?sort_by=popularity.desc&with_origin_country=ZA', '#saList');

const yearFilter = document.getElementById('yearFilters');
const ratingFilter = document.getElementById('ratingFilters');
const popularFilter = document.getElementById('popularFilter');
const genreFilter = document.getElementById('genreFilters');
const platformFilter = document.getElementById('platformFilters');
const resetButton = document.getElementById('resetFilters');

const filteredSection = document.getElementById('filteredSection');
const filteredList = document.getElementById('filteredList');
const allSections = document.querySelectorAll('main > section:not(.filters)');

[yearFilter, ratingFilter, popularFilter, genreFilter].forEach(select => {
  if (select) select.addEventListener('change', applyFilters);
});

resetButton.addEventListener('click', () => {
  [yearFilter, ratingFilter, popularFilter, genreFilter].forEach(select => select.value = "");
  filteredSection.style.display = "none";
  allSections.forEach(section => section.style.display = 'block');
});

async function applyFilters() {
  const curatedSections = document.querySelectorAll('main > section:not(.filters)');
  curatedSections.forEach(sec => (sec.style.display = 'none'));

  filteredSection.style.display = 'block';
  filteredList.innerHTML = '';

  const year = yearFilter.value;
  const rating = ratingFilter.value;
  const popular = popularFilter.value;
  const genre = genreFilter.value;

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

  if (rating === 'desc' || rating === 'asc') {
    endpoint = `discover/movie?sort_by=vote_average.${rating}`;
  }

  if (genre) endpoint += `&with_genres=${genre}`;

  if (popular === 'week') endpoint = 'trending/movie/week';
  else if (popular === 'year') endpoint = 'discover/movie?sort_by=revenue.desc';
  else if (popular === 'decade') endpoint = 'discover/movie?sort_by=vote_count.desc';

  fetchFilms(endpoint, '#filteredList');
}
