// =====================
// Content Data (Dynamic)
// =====================
const exploreContent = {
  hero: {
    title: "Explore Pahari Maggie Point",
    subtitle: "Where the hills meet flavors 🌲☕",
    background: "hero.mp4",
    type: "video"
  },
  about: {
    title: "About Our Café",
    text: "Nestled in the Jaunpur, Pahari Maggie Point blends forest vibes with cozy wood interiors, serving soul-warming Maggi and coffee for everyone.",
    image: "six.jpg"
  },
  gallery: [
    {
      type: "image",
      category: "Food",
      src: "butter-cheese-maggie.png",
      caption: "Cheesy Maggi 🍜"
    },
    {
      type: "image",
      category: "Interior",
      src: "two.jpg",
      caption: "Warm interiors"
    },
    {
      type: "video",
      category: "Vibes",
      src: "videos/cafe-night.mp4",
      poster: "ten.jpg"
    },
    {
      type: "image",
      category: "Events",
      src: "one.jpg",
      caption: "Live Music Night 🎶"
    }
    
  ]
};

// =====================
// Rendering Functions
// =====================

// Hero Section
function renderHero(heroData) {
  const hero = document.createElement("section");
  hero.className = "hero";

  if (heroData.type === "video") {
    hero.innerHTML = `
      <video autoplay muted loop playsinline class="hero-bg">
        <source src="${heroData.background}" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>
      <div class="hero-text">
        <h1>${heroData.title}</h1>
        <p>${heroData.subtitle}</p>
      </div>
    `;
  } else {
    hero.style.backgroundImage = `url(${heroData.background})`;
    hero.innerHTML = `
      <div class="hero-overlay"></div>
      <div class="hero-text">
        <h1>${heroData.title}</h1>
        <p>${heroData.subtitle}</p>
      </div>
    `;
  }

  return hero;
}

// About Section
function renderAbout(aboutData) {
  const about = document.createElement("section");
  about.className = "about";

  about.innerHTML = `
    <div class="about-content">
      <div class="about-text">
        <h2>${aboutData.title}</h2>
        <p>${aboutData.text}</p>
      </div>
      <div class="about-image">
        <img src="${aboutData.image}" alt="About Café">
      </div>
    </div>
  `;

  return about;
}

// Gallery Section
function renderGallery(galleryData) {
  const gallery = document.createElement("section");
  gallery.className = "gallery";

  gallery.innerHTML = `
    <h2>Our Gallery</h2>
    <div class="gallery-filters">
      <button class="filter-btn active" data-category="All">All</button>
      <button class="filter-btn" data-category="Food">Food</button>
      <button class="filter-btn" data-category="Interior">Interior</button>
      <button class="filter-btn" data-category="Vibes">Vibes</button>
      <button class="filter-btn" data-category="Events">Events</button>
    </div>
    <div class="gallery-grid"></div>
  `;

  const grid = gallery.querySelector(".gallery-grid");

  function loadGallery(category = "All") {
    grid.innerHTML = "";
    const items = category === "All"
      ? galleryData
      : galleryData.filter(item => item.category === category);

    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "gallery-item";

      if (item.type === "image") {
        div.innerHTML = `
          <img src="${item.src}" alt="${item.caption || item.category}">
          <p>${item.caption || ""}</p>
        `;
      } else if (item.type === "video") {
        div.innerHTML = `
          <video controls poster="${item.poster || ""}">
            <source src="${item.src}" type="video/mp4">
          </video>
        `;
      }

      // Lightbox trigger
      div.addEventListener("click", () => openLightbox(item));
      grid.appendChild(div);
    });
  }

  // Filter Buttons
  gallery.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      gallery.querySelector(".filter-btn.active").classList.remove("active");
      btn.classList.add("active");
      loadGallery(btn.dataset.category);
    });
  });

  loadGallery(); // default

  return gallery;
}

// =====================
// Lightbox Function
// =====================
function openLightbox(item) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox active"; // active shows + blur

  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="close">&times;</span>
      ${
        item.type === "image"
          ? `<img src="${item.src}" alt="${item.caption || ""}">`
          : `<video controls autoplay poster="${item.poster || ""}">
               <source src="${item.src}" type="video/mp4">
             </video>`
      }
      <p>${item.caption || ""}</p>
    </div>
  `;

  document.body.appendChild(lightbox);

  // Close button
  lightbox.querySelector(".close").addEventListener("click", () => {
    lightbox.remove();
  });

  // Click outside closes
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.remove();
  });
}

// =====================
// Init Page
// =====================
function renderExplorePage() {
  const root = document.getElementById("explorePage");

  const hero = renderHero(exploreContent.hero);
  const about = renderAbout(exploreContent.about);
  const gallery = renderGallery(exploreContent.gallery);

  root.appendChild(hero);
  root.appendChild(about);
  root.appendChild(gallery);
}

document.addEventListener("DOMContentLoaded", renderExplorePage);
