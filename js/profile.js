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
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    const data = await res.json();
    return {
      title: data.title || data.name || "Untitled",
      poster: data.poster_path ? IMG_BASE + data.poster_path : ""
    };
  } catch {
    return { title: "Unknown", poster: "" };
  }
}

async function renderList(container, items, type) {
  container.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const slot = items[i];
    const li = document.createElement("li");

    if (editMode) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = slot?.id || "";
      input.addEventListener("change", () => {
        const profiles = getProfiles();
        const profile = profiles[currentUser] || { bio: "", movies: [], series: [] };
        const arr = type === "movie" ? profile.movies : profile.series;
        arr[i] = input.value ? { id: input.value, type } : undefined;
        profiles[currentUser] = profile;
        saveProfiles(profiles);
      });
      li.appendChild(input);
    } else {
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
      }
    }

    container.appendChild(li);
  }
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
