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

const modalOverlay = document.createElement("section");
modalOverlay.id = "searchModal";
modalOverlay.innerHTML = `
  <section class="modalContent">
    <input id="searchInputModal" type="text" placeholder="Search TMDb..." />
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
    poster: data