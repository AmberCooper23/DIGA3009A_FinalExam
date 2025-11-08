const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w200';

async function fetchMediaDetails(log) {
  try {
    const res = await fetch(`${BASE_URL}/${log.type}/${log.id}?api_key=${API_KEY}`);
    const data = await res.json();
    return {
      title: data.title || data.name || "Untitled",
      poster: data.poster_path ? IMG_BASE + data.poster_path : ""
    };
  } catch (err) {
    console.error("Error fetching media details:", err);
    return { title: "Unknown", poster: "" };
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const diaryContainer = document.getElementById("diaryContainer");
  let logs = JSON.parse(localStorage.getItem("movieLogs")) || [];

  // sort by watchDate (or loggedAt if missing)
  logs.sort((a, b) => new Date(a.watchDate || a.loggedAt) - new Date(b.watchDate || b.loggedAt));

  if (logs.length === 0) {
    diaryContainer.textContent = "No logs yet.";
    return;
  }

  for (const log of logs) {
    const { title, poster } = await fetchMediaDetails(log);

    const card = document.createElement("div");
    card.className = "logCard";

    const posterImg = document.createElement("img");
    posterImg.src = poster;
    posterImg.alt = title;

    const details = document.createElement("div");
    details.className = "logDetails";

    const titleEl = document.createElement("h2");
    titleEl.textContent = title;

    const platformEl = document.createElement("p");
    platformEl.textContent = `Platform: ${log.platform}`;

    const reviewEl = document.createElement("p");
    reviewEl.textContent = `Review: ${log.review}`;

    const ratingEl = document.createElement("p");
    ratingEl.className = "rating";
    ratingEl.textContent = "★".repeat(log.rating);

    const dateEl = document.createElement("p");
    dateEl.textContent = `Watched: ${log.watchDate || "N/A"}`;

    details.append(titleEl, platformEl, reviewEl, ratingEl, dateEl);
    card.append(posterImg, details);
    diaryContainer.appendChild(card);
  }
});
