const API_KEY = "0cefd7764121a70764185523e70202ae";
const BASE_URL = "https://api.themoviedb.org/3";

// --- User Logs (localStorage) ---
function logMovie(movieId) {
  let logs = JSON.parse(localStorage.getItem("userLogs")) || [];
  if (!logs.includes(movieId)) {
    logs.push(movieId);
    localStorage.setItem("userLogs", JSON.stringify(logs));
  }
}

function getUserLogs() {
  return JSON.parse(localStorage.getItem("userLogs")) || [];
}

// --- Challenges Data ---
const challenges = [
  {
    id: 1,
    title: "Oscar Winners 2024",
    movieIds: [693134, 872585, 940721], // example TMDB IDs
  },
  {
    id: 2,
    title: "Animated Classics",
    movieIds: [129, 8587, 12],
  },
];

const friendChallenges = [
  {
    id: 3,
    title: "Wong Kar-Wai",
    movieIds: [11104, 11105, 11106], // example IDs
  },
];

//  Progress Calculation 
function calculateProgress(challenge, logs) {
  const loggedCount = challenge.movieIds.filter(id => logs.includes(id)).length;
  return Math.round((loggedCount / challenge.movieIds.length) * 100);
}

//  Rendering 
async function fetchMoviePosters(movieIds, count = 4) {
  const posters = [];
  for (let i = 0; i < Math.min(count, movieIds.length); i++) {
    const src = await fetchMoviePoster(movieIds[i]);
    posters.push(src);
  }
  return posters;
}


async function renderChallengeList(containerId, challengeList) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const logs = getUserLogs();

  for (const ch of challengeList) {
    const posters = await fetchMoviePosters(ch.movieIds, 4);
    const progress = calculateProgress(ch, logs);

    const li = document.createElement("li");
    li.classList.add("challengeCard");

    const collageHTML = posters.map((src,i) => `<img src="${src} class="poster poster-${i} alt=${ch.title}">`
    ).join("");

    li.innerHTML = `
      <div class="posterCollage">${collageHTML}</div>
      <p class="challengeTitle">${ch.title}</p>
      <div class="progressBar">
        <div class="progressFill" style="width: ${progress}%"></div>
      </div>
      <small>${progress}% complete</small>
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
