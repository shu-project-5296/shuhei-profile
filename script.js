document.getElementById("year").textContent = new Date().getFullYear();

const heroPhoto = document.querySelector(".hero-photo");
heroPhoto.addEventListener("error", () => {
  heroPhoto.hidden = true;
});
