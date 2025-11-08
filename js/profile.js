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

// Create modal
const modalOverlay = document.createElement("section");
modalOverlay.id = "searchModal";
modalOverlay.innerHTML = `
  <section>
    <input id="searchInputModal" type="text" placeholder="Search TMDb...">
    <ul id="searchResultsModal"></ul>
    <button id="closeModal">Close</button>
  </section>
`;
document.body.appendChild(modalOverlay);
modalOverlay.style.display = "none";

let editMode = false;
let activeSlot = { type: "", index: 0 };

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
      li.addEventListener("click", () => {
        activeSlot = { type, index: i };
        openSearchModal();
      });
    }

    container.appendChild(li);
  }
}

function openSearchModal() {
  modalOverlay.style.display = "flex";
  const modalContent = modalOverlay.querySelector("section");
  modalContent.style.opacity = "0";
  modalContent.style.transform = "scale(0.8)";
  gsap.to(modalContent, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });

  document.getElementById("searchInputModal").value = "";
  document.getElementById("searchResultsModal").innerHTML = "";
}

function closeSearchModal() {
  const modalContent = modalOverlay.querySelector("section");
  gsap.to(modalContent, {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      modalOverlay.style.display = "none";
    }
  });
}

document.getElementById("closeModal").addEventListener("click", closeSearchModal);

document.getElementById("searchInputModal").addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  if (!query) return;

  const results = await searchTMDb(query, activeSlot.type);
  const resultsList = document.getElementById("searchResultsModal");
  resultsList.innerHTML = "";

  results.slice(0, 10).forEach(result => {
    const item = document.createElement("li");
    item.innerHTML = `
      <img src="${result.poster}" alt="${result.title}" />
      <p>${result.title}</p>
    `;
    item.addEventListener("click", () => {
      const profiles = getProfiles();
      const profile = profiles[currentUser] || { bio: "", movies: [], series: [] };
      const arr = activeSlot.type === "movie" ? profile.movies : profile.series;
      arr[activeSlot.index] = { id: result.id, type: activeSlot.type };
      profiles[currentUser] = profile;
      saveProfiles(profiles);
      closeSearchModal();
      renderProfile();
    });
    resultsList.appendChild(item);
  });
});

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
