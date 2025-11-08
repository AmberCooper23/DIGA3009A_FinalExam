const navItems = [
  { label: "Home", href: "index.html" },
  { label: "Movies", href: "movies.html" },
  { label: "Challenges", href: "challenges.html" },
  { label: "Diary", href: "diary.html" }
];

//merp

function renderNavBar() {
  const container = document.getElementById("navBarContainer");
  if (!container) return;

  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  navItems.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = item.label;
    a.href = item.href;
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  container.appendChild(nav);
}

if (window.location.pathname.includes(item.href)) {
  a.classList.add("active");
}


document.addEventListener("DOMContentLoaded", renderNavBar);

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
// merp 
function setCurrentUser(username) {
  localStorage.setItem("currentUser", username);
}

const loginBtn = document.getElementById("showLogin");
const signupBtn = document.getElementById("showSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (loginBtn && signupBtn && loginForm && signupForm) {
  // Toggle between login and signup forms
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

  // Signup form submit
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const email = document.getElementById("signupEmail").value.trim();

    let users = getUsers();

    if (users.find(u => u.username === username)) {
      alert("Username already exists. Please choose another.");
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

  // Login form submit
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
}

// ===== Header Dropdown Logic =====
document.addEventListener("DOMContentLoaded", () => {
  const headerUser = document.getElementById("headerUser");
  const dropdown = document.getElementById("userDropdown");
  const logOut = document.getElementById("logOut");
  const currentUser = localStorage.getItem("currentUser");

  if (headerUser) {
    if (currentUser) {
      headerUser.textContent = `@${currentUser}`;
      headerUser.href = "#";
    } else {
      headerUser.textContent = "Log In";
      headerUser.href = "pages/login.html";
    }
  }

  if (headerUser && dropdown) {
    headerUser.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!headerUser.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  if (logOut) {
    logOut.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "pages/login.html";
    });
  }
});
