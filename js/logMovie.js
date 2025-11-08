const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
console.log("logMovie.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const type = params.get("type") || "movie"; // default to movie

  const movieDetails = document.getElementById("movieDetails");
  const logForm = document.getElementById("logForm");
  const starsContainer = document.getElementById("stars");

  // Guard: if elements missing, stop
  if (!id || !movieDetails || !logForm || !starsContainer) {
    console.warn("Required elements not found on page.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    const media = await res.json();

    let director = "";
    try {
      const creditsRes = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
      const creditsData = await creditsRes.json();
      if (creditsData.crew) {
        const directorObj = creditsData.crew.find(person => person.job === "Director");
        if (directorObj) director = directorObj.name;
      }
    } catch (err) {
      console.warn("Credits fetch error:", err);
    }

    const title = media.title || media.name;
    const year = media.release_date?.slice(0,4) || media.first_air_date?.slice(0,4) || "N/A";

    movieDetails.innerHTML = `
      <img src="${media.poster_path ? IMG_BASE + media.poster_path : ''}" alt="${title}" style="height:200px">
      <h2>${title} (${year}) ${director ? "- " + director : ""}</h2>
    `;
  } catch (err) {
    console.error("Details error:", err);
    movieDetails.textContent = "Error loading media details.";
  }

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
      id,
      type,
      platform,
      review,
      friends,
      rating,
      date: new Date().toISOString(),
    });
    localStorage.setItem("movieLogs", JSON.stringify(logs));

    alert("Media logged!");
    window.location.href = "diary.html";
  });
});
