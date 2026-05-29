const API_KEY = "44450ac";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("moviesContainer");

const modal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");

const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const modalRating = document.getElementById("modalRating");
const modalGenre = document.getElementById("modalGenre");
const modalPlot = document.getElementById("modalPlot");

const favoritesContainer =
  document.getElementById("favoritesContainer");

searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    searchMovies();
  }

});

async function searchMovies() {

  const query = searchInput.value;

  if (!query) return;

  const url =
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;

  const response = await fetch(url);

  const data = await response.json();

  moviesContainer.innerHTML = "";

  if (data.Response === "False") {

    moviesContainer.innerHTML =
      "<h2>Фильмы не найдены 😢</h2>";

    return;
  }

  data.Search.forEach(movie => {

    const card = document.createElement("div");

    card.classList.add("movie-card");

    card.innerHTML = `

      <button class="favorite-btn">
        ❤️
      </button>

      <img src="${movie.Poster}" alt="">

      <div class="movie-info">

        <h2>${movie.Title}</h2>

        <p>${movie.Year}</p>

        <div class="rating ${getRatingClass(movie.imdbID)}">
          ⭐ IMDb
        </div>

      </div>
    `;

    const favoriteBtn =
      card.querySelector(".favorite-btn");

    favoriteBtn.addEventListener("click", (e) => {

      e.stopPropagation();

      addToFavorites(movie);

    });

    card.addEventListener("click", () => {

      getMovieDetails(movie.imdbID);

    });

    moviesContainer.appendChild(card);

  });

}

async function getMovieDetails(id) {

  const url =
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`;

  const response = await fetch(url);

  const movie = await response.json();

  modalPoster.src = movie.Poster;

  modalTitle.textContent = movie.Title;

  modalYear.textContent = movie.Year;

  modalRating.textContent = movie.imdbRating;

  modalGenre.textContent =
    translateGenre(movie.Genre);

  translateText(movie.Plot)
    .then(translated => {

      modalPlot.textContent = translated;

    });

  modal.classList.remove("hidden");

}

closeModal.addEventListener("click", () => {

  modal.classList.add("hidden");

});

window.addEventListener("click", (e) => {

  if (e.target === modal) {

    modal.classList.add("hidden");

  }

});

function translateGenre(genre) {

  return genre
    .replace("Action", "Боевик")
    .replace("Adventure", "Приключения")
    .replace("Comedy", "Комедия")
    .replace("Drama", "Драма")
    .replace("Horror", "Ужасы")
    .replace("Sci-Fi", "Фантастика")
    .replace("Thriller", "Триллер")
    .replace("Crime", "Криминал")
    .replace("Fantasy", "Фэнтези")
    .replace("Animation", "Анимация");

}

async function translateText(text) {

  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);

  const data = await response.json();

  return data[0][0][0];

}

function getRatingClass(id) {

  const lastNumber =
    Number(id[id.length - 1]);

  if (lastNumber >= 7) {
    return "green";
  }

  if (lastNumber >= 4) {
    return "orange";
  }

  return "red";

}

function addToFavorites(movie) {

  let favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  const exists = favorites.find(fav =>
    fav.imdbID === movie.imdbID
  );

  if (exists) return;

  favorites.push(movie);

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  renderFavorites();

}

function renderFavorites() {

  let favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  favoritesContainer.innerHTML = "";

  favorites.forEach(movie => {

    favoritesContainer.innerHTML += `

      <div class="movie-card">

        <img src="${movie.Poster}" alt="">

        <div class="movie-info">

          <h2>${movie.Title}</h2>

          <p>${movie.Year}</p>

        </div>

      </div>

    `;

  });

}

renderFavorites();