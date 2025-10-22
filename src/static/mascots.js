// List of mascot image URLs (Octodex as suggested in the issue)
const mascots = [
  {
    name: "Original Octocat",
    url: "https://octodex.github.com/images/original.png"
  },
  {
    name: "Supportcat",
    url: "https://octodex.github.com/images/supportcat.png"
  },
  {
    name: "Professortocat",
    url: "https://octodex.github.com/images/Professortocat_v2.png"
  }
];

function renderMascots() {
  const mascotContainer = document.getElementById("mascot-container");
  mascots.forEach(mascot => {
    const img = document.createElement("img");
    img.src = mascot.url;
    img.alt = mascot.name;
    img.title = mascot.name;
    img.className = "mascot-img";
    mascotContainer.appendChild(img);
  });
}

document.addEventListener("DOMContentLoaded", renderMascots);
