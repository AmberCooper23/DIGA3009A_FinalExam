// TMDb constants
const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  const movieDetails = document.getElementById("movieDetails");
  const logForm = document.getElementById("logForm");
  const starsContainer = document.getElementById("stars");

  // Guard: if elements missing, stop
  if (!movieId || !movieDetails || !logForm || !starsContainer) {
    console.warn("Required elements not found on page.");
    return;
  }

  // Fetch movie details
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await res.json();

    movieDetails.innerHTML = `
      <img src="${movie.poster_path ? IMG_BASE + movie.poster_path : ''}" alt="${movie.title}" style="height:200px">
      <h2>${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : "N/A"})</h2>
    `;
  } catch (err) {
    console.error("Details error:", err);
    movieDetails.textContent = "Error loading movie details.";
  }

  // Interactive star rating
  let rating = 0;
  starsContainer.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.dataset.value = i;
    star.style.cursor = "pointer";
    star.style.fontSize = "2rem";
    star.style.color = "#ccc";

    star.addEventListener("click", () => {
      rating = i;
      [...starsContainer.children].forEach((s, idx) => {
        s.style.color = idx < rating ? "gold" : "#ccc";
      });
    });

    starsContainer.appendChild(star);
  }

  // Save log
  logForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const platformEl = document.getElementById("platform");
    const reviewEl = document.getElementById("review");
    const friendsEl = document.getElementById("friends");

    if (!platformEl || !reviewEl) {
      alert("Form elements missing.");
      return;
    }

    const platform = platformEl.value;
    const review = reviewEl.value.trim();
    const friends = friendsEl ? friendsEl.value.trim() : "";

    let logs = JSON.parse(localStorage.getItem("movieLogs")) || [];
    logs.push({
      movieId,
      platform,
      review,
      friends,
      rating,
      date: new Date().toISOString(),
    });
    localStorage.setItem("movieLogs", JSON.stringify(logs));

    alert("Movie logged!");
    window.location.href = "diary.html";
  });
});
