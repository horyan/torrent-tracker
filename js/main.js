function toggleTheme() {
  const theme = document.getElementById("btn-switch");
  if (document.body.classList.toggle("dark") === true) {
    theme.innerHTML = "Light Mode";
  }
  else {
    theme.innerHTML = "Dark Mode";
  }
}
