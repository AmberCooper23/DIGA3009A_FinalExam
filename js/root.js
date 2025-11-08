// ===== Nav Bar Rendering =====
const navItems = [
  { label: "home", href: "../index.html" },
  { label: "movies", href: "../pages/movies.html" },
  { label: "musicals", href: "../pages/musicals.html" },
  { label: "challenges", href: "../pages/challenges.html" },
  { label: "diary", href: "../pages/diary.html" }
];

function renderNavBar() {
  const container = document.getElementById("navBarContainer");
  if (!container) return;

  const aside = document.createElement("aside");
  aside.className = "navLinks";

  const ul = document.createElement("ul");
  ul.className = "navBar";

  const currentPath = window.location.pathname;

  navItems.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "nav-u-url";
    a.href = item.href;

    const btn = document.createElement("button");
    btn.className = "navButton";
    btn.textContent = item.label;

    if (currentPath.includes(item.href.split("/").pop())) {
      btn.classList.add("active");
    }

    a.appendChild(btn);
    li.appendChild(a);
    ul.appendChild(li);
  });

  const logBtn = document.createElement("button");
  logBtn.textContent = "Log+";
  logBtn.onclick = () => {
    window.location.href = "../pages/addLog.html";
  };

  aside.appendChild(ul);
  aside.appendChild(logBtn);
  container.appendChild(aside);
}

renderNavBar();

// ===== GSAP Page Entrance =====
document.addEventListener("DOMContentLoaded", () => {
  const intro = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

  intro
    .from("header", { y: -80, opacity: 0 })
    .from("aside", { x: -100, opacity: 0 }, "-=0.6")
    .from(".filters", { y: 40, opacity: 0 }, "-=0.4")
    .from("main section:first-of-type h2", { y: 40, opacity: 0 });

  gsap.utils.toArray("main section").forEach((section, i) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      delay: i * 0.05
    });
  });

  gsap.registerPlugin(MotionPathPlugin);
  gsap.to(".logo", {
    duration: 2,
    ease: "power1.inOut",
    motionPath: {
      path: [{ x: 0, y: 0 }, { x: 100, y: -50 }, { x: 200, y: 0 }],
      autoRotate: true
    }
  });
  
});

// ===== Auth Logic =====
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

if (loginBtn && signupBtn && loginForm && signupForm) {
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
    if (users.find(u => u.username === username)) {
      alert("Username already exists.");
      return;
    }

    users.push({ username, password, email });
    saveUsers(users);
    setCurrentUser(username);

    emailjs.send("service_0984bwn", "template_437ihss", {
      username,
      to_email: email
    })
    .then(() => {
      console.log("Confirmation email sent!");
      window.location.href = "../index.html";
    })
    .catch(() => {
      alert("Account created, but email failed.");
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
      alert("Invalid login.");
      return;
    }

    setCurrentUser(username);
    alert(`Welcome back, ${username}!`);
    window.location.href = "../index.html";
  });
}

// ===== Header Dropdown =====
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
