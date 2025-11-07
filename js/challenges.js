const API_KEY = "0cefd7764121a70764185523e70202ae";
const BASE_URL = "https://api.themoviedb.org/3";

// User Logs (localStorage) 
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

//  Challenges Data 
const challenges = [  ];
const friendChallenges = [  ];

//  Progress Calculation 
function calculateProgress(challenge, logs) {
  const loggedCount = challenge.movieIds.filter(id => logs.includes(id)).length;
  return Math.round((loggedCount / challenge.movieIds.length) * 100);
}

// Rendering 
async function fetchMoviePoster(movieId) {  }
async function renderChallengeList(containerId, challengeList) {  }
async function renderChallenges() {  }

renderChallenges();
