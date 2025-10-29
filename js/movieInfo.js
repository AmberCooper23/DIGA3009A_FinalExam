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

        const countryCode = 'SA';

        const providersRes = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}&language=en-US`);
        const providersData = await providersRes.json();

        let providerHTML = '';
        if(providersData.results[countryCode]) {
            const countryProviders = providersData.results[countryCode];

        if (countryProviders.flatrate) {
            providerHTML += '<p> <strong> Streaming: </strong>' + 
            countryProviders.flatrate.map ( p => p.provider_name).join(',');
        }
        if (countryProviders.rent) {
            providerHTML += '<p> <strong> Rent: </strong>' + 
            countryProviders.rent.map(p => p.provider_name).join(',') + '</p>';
        }

        if (countryProviders.buy) {
            providerHTML += '<p> <strong> Buy: </strong>' + 
            countryProviders.b87.map (p => provider_name).join(',') + '</p>';
        }

    }else {
        providerHTML = '<p> No streaming information available for your region. </p>';
    }
        const container = document.getElementById('movieDetails');

        container.innerHTML = `
        <img src = "${IMG_BASE}${movie.poster_path}" alt="${movie.title}" class = "filmList">
        <div class="movieInfo">
        <h1>${movie.title} (${new Date(movie.release_date).getFullYear()})</h1>
        <p> <strong> Director: </strong> ${director}<?p>
        <p> <strong> Main Cast: </strong> ${mainCast}</p>
        <p> <strong> Rating: </strong> ${movie.vote_average.toFixed(1)}/10 </p>
        <p> <strong> Overview: </strong> ${movie.overview} </p>
        ${providerHTML}
       </div>
        `;
        
    } catch (err) {
        console.error('Error loading movie:', err);
    }
}

loadMovie();
