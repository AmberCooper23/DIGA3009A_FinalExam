const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

async function loadMovie() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (!movieId) return;

    try {
        const movieRes = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
        const movie = await movieRes.json();

        const creditsRes = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`);
        const credits = await creditsRes.json();

        const director = credits.crew.find(person => person.job === 'Director')?.name || 'Unknown';
        const mainCast = credits.cast.slice(0,5).map(c => c.name).join(',');

        const container = document.getElementById('movieDetails');
        container.innerHTML = `
        <h1>${movie.title} (${new Date(movie.release_date).getFullYear()})</h1>
        <img src = "${IMG_BASE}${movie.poster_path}" alt="${movie.title}" class = "filmList">
        <div class="movieInfo">
        <p> <strong> Director: </strong> ${director}<?p>
        <p> <strong> Main Cast: </strong> ${mainCast}</p>
        <p> <strong> Rating: </strong> ${movie.vote_average}/10 </p>
        <p> <strong> Overview: </strong> ${movie.overview} </p>
       </div>
        `;
        
    } catch (err) {
        console.error('Error loading movie:', err);
    }
}

loadMovie();
