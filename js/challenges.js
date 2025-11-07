const API_KEY = "0cefd7764121a70764185523e70202ae";
const BASE_URL = "https://api.themoviedb.org/3";

const challenges = [
  {
    id: 1,
    title: "Oscar Winners 2024",
    movieIds: [693134, 872585, 940721],
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

const friendChallenges = [
  {
    id: 4,
    title: "Wong Kar-Wai",
    movieIds: [11104, 11105, 11106], // example IDs
    progress: 20,
  },
];

async function fetchMoviePoster(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const data = await res.json();
  return data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : "../assets/placeholder.png"; // fallback if no poster
}

async function renderChallengeList(containerId, challengeList) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // clear before rendering

  for (const ch of challengeList) {
    const poster = await fetchMoviePoster(ch.movieIds[0]);

    const li = document.createElement("li");
    li.classList.add("challengeCard");
    li.innerHTML = `
      <img src="${poster}" alt="${ch.title}">
      <p class="challengeTitle">${ch.title}</p>
      <div class="progressBar">
        <div class="progressFill" style="width: ${ch.progress}%"></div>
      </div>
      <small>${ch.progress}% complete</small>
    `;
    li.addEventListener("click", () => {
      location.href = `challenges.html?id=${ch.id}`;
    });

    container.appendChild(li);
  }
}

async function renderChallenges() {
  await renderChallengeList("featuredChallenges", challenges);
  await renderChallengeList("friendChallenges", friendChallenges);
}

renderChallenges();
