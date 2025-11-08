function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(username) {
  localStorage.setItem("currentUser", username);
}

document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
});

document.getElementById("showSignup").addEventListener("click", () => {
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
});

document.getElementById("signupForm").addEventListener("submit", (e) => {
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

  //  Send confirmation email 
  emailjs.send("service_0984bwn", "YOUR_TEMPLATE_ID", {
    username: username,
    to_email: email
  })
  .then(() => {
    console.log("Confirmation email sent!");
    alert(`Account created! Welcome, ${username}. A confirmation email has been sent.`);
    window.location.href = "../index.html";
  })
  .catch((err) => {
    console.error("Email failed:", err);
    alert("Account created, but email could not be sent.");
    window.location.href = "../index.html";
  });
});
