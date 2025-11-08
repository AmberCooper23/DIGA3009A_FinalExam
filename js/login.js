function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(username) {
  localStorage.setItem("currentUser", username);
}

const loginBtn = document.getElementById("showLogin");
const signupBtn = document.getElementById("showSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginBtn.addEventListener("click", () => {
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  loginBtn.classList.add("active");
  signupBtn.classList.remove("active");
});

signupBtn.addEventListener("click", () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  signupBtn.classList.add("active");
  loginBtn.classList.remove("active");
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const email = document.getElementById("signupEmail").value.trim();

  let users = getUsers();

  // Check for duplicate username or email
  if (users.find(u => u.username === username)) {
    alert("Username already exists. Please choose another.");
    return;
  }
  if (users.find(u => u.email === email)) {
    alert("Email already registered. Please use another.");
    return;
  }

  users.push({ username, password, email });
  saveUsers(users);
  setCurrentUser(username);

  emailjs.send("service_0984bwn", "template_437ihss", {
    username: username,
    to_email: email
  })
  .then(() => {
    console.log("Confirmation email sent!");
    window.location.href = "../index.html";
  })
  .catch((err) => {
    console.error("Email failed:", err);
    alert("Account created, but email could not be verified.");
    window.location.href = "../index.html";
  });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  let users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Invalid username or password.");
    return;
  }

  setCurrentUser(username);
  alert(`Welcome back, ${username}!`);
  window.location.href = "../index.html";
});
