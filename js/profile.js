const API_KEY = '0cefd7764121a70764185523e70202ae';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w200';

const currentUser = localStorage.getItem("currentUser");
const handleEl = document.getElementById("profileHandle");
const bioEl = document.getElementById("profileBio");
const editBtn = document.getElementById("editProfileBtn");
const identityEditor = document.getElementById("identityEditor");
const editBio = document.getElementById("editBio");
const topMovies = document.getElementById("topMovies");
const topSeries = document.getElementById("topSeries");

let editMode = false;

function getProfiles() {
  return JSON.parse(localStorage.getItem("profiles")) || {};
}

function saveProfiles(profiles) {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

async function fetchMedia(id, type) {
  const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
  const data = await res.json();
  return {
    id,
    type,
    title: data.title || data.name || "Untitled",
    poster: data.poster_path ? IMG_BASE + data.poster_path : ""
  };
}

async function searchTMDb(query, type) {
  const res = await fetch(`${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.results.map(r => ({
    id: r.id,
    type,
    title: r.title || r.name,
    poster: r.poster_path ? IMG_BASE + r.poster_path : ""
  }));
}

async function renderList(container, items, type) {
  container.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const slot = items[i];
    const li = document.createElement("li");

    if (slot?.id) {
      const media = await fetchMedia(slot.id, type);
      if (media.poster) {
        const img = document.createElement("img");
        img.src = media.poster;
        img.alt = media.title;
        li.appendChild(img);
      }
      const title = document.createElement("p");
      title.textContent = media.title;
      li.appendChild(title);
    } else {
      li.textContent = "Empty slot";
      li.classList.add("emptySlot");

      // Allow user to click and search
      li.addEventListener("click", () => {
        openSearchPrompt(type, i);
      });
    }

    container.appendChild(li);
  }
}

function openSearchPrompt(type, index) {
  const query = prompt(`Search for a ${type === "movie" ? "movie" : "series"}:`);
  if (!query) return;

  searchTMDb(query, type).then(results => {
    if (results.length === 0) {
      alert("No results found.");
      return;
    }

    // Show simple selection prompt
    const choices = results.slice(0, 5).map((r, i) => `${i + 1}. ${r.title}`).join("\n");
    const choice = prompt(`Select a number:\n${choices}`);
    const selected = results[parseInt(choice) - 1];
    if (!selected) return;

    const profiles = getProfiles();
    const profile = profiles[currentUser] || { bio: "", movies: [], series: [] };
    const arr = type === "movie" ? profile.movies : profile.series;
    arr[index] = { id: selected.id, type };
    profiles[currentUser] = profile;
    saveProfiles(profiles);
    renderProfile();
  });
}

async function renderProfile() {
  const profiles = getProfiles();
  const profile = profiles[currentUser] || { bio: "", movies: [], series: [] };

  handleEl.textContent = `@${currentUser}`;
  bioEl.textContent = profile.bio;

  identityEditor.hidden = !editMode;
  if (editMode) {
    editBio.value = profile.bio;
  }

  await renderList(topMovies, profile.movies, "movie");
  await renderList(topSeries, profile.series, "tv");
}

editBtn.addEventListener("click", () => {
  const profiles = getProfiles();
  const profile = profiles[currentUser] || { bio: "", movies: [], series: [] };

  if (!editMode) {
    editMode = true;
    editBtn.textContent = "Save profile";
    renderProfile();
  } else {
    profile.bio = editBio.value.trim();
    profiles[currentUser] = profile;
    saveProfiles(profiles);
    editMode = false;
    editBtn.textContent = "Edit profile";
    renderProfile();
  }
});

renderProfile();
