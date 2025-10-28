const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

async function fetchFilms(endpoint, listId) {
    try{
  const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();

    const list = document.querySelector(listId);

    list.innerHTML = "";

    data.results.slice(0,6).forEach(film=>{
        const item = document.createElement('ul');
        const img = document.createElement('img');
        const title = document.createElement('p');

        img.src = `${IMG_BASE}${movie.poster_path}`;
        img.alt = film.title;

        list.append(img, title);
        list.appendChild(li);
    });

} catch (err) {
    console.error('Error fetching films:', err);
  }
}

fetchFilms('film/popular', '#featuredFilms');
fetchFilms('film/top_rated', '#friendFilms');
