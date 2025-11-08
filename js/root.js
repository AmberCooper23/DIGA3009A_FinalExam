document.addEventListener("DOMContentLoaded", () => {
  const headerUser = document.getElementById("headerUser");
  const currentUser = localStorage.getItem("currentUser");

  if (headerUser) {
    if (currentUser) {
      // Show the username instead of "Log In"
      headerUser.textContent = `@${currentUser}`;
      // Make it link to their profile page
      headerUser.href = `pages/profile.html?user=${encodeURIComponent(currentUser)}`;
    } else {
      // Fallback if no one is logged in
      headerUser.textContent = "Log In";
      headerUser.href = "pages/login.html";
    }
  }
});
