const API_KEY = "0cefd7764121a70764185523e70202ae";
const BASE_URL = "https://api.themoviedb.org/3";

const challenges = [
  {
    id: 1,
    title: "Oscar Winners 2024",
    movieIds: [693134, 872585, 940721], // TMDb IDs
    progress: 65,
  },
  {
    id: 2,
    title: "Animated Classics",
    movieIds: [129, 8587, 12],
    progress: 40,
  },
  {
    id: 3,
    title: "Global Cinema: Africa Edition",
    movieIds: [845111, 678512, 808188],
    progress: 80,
  },
];

async function fetchMoviePoster(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const data = await res.json();
  return `https://image.tmdb.org/t/p/w500${data.poster_path}`;
}

async function renderChallenges() {
  const featuredContainer = document.getElementById("featuredChallenges");

  for (const ch of challenges) {
    // Fetch the first movie’s poster as the challenge thumbnail
    const poster = await fetchMoviePoster(ch.movieIds[0]);

    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${poster}" alt="${ch.title}">
      <p>${ch.title}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${ch.progress}%"></div>
      </div>
      <small>${ch.progress}% complete</small>
    `;
    li.addEventListener("click", () => {
      location.href = `challenge-info.html?id=${ch.id}`;
    });

    featuredContainer.appendChild(li);
  }
}

renderChallenges();
