const part1 = 'ODhiNjNmMGNmYzQ1'; 
const part2 = 'MmE2NDdjYzM5NGQ3ZTNhNTIyMTQ='; 
const apiKey = atob(part1 + part2);
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');

// Function to fetch popular or trending movies/TV shows
async function fetchRecommendations() {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  // Clear previous results
  movieGrid.innerHTML = '';

  if (data.results.length === 0) {
    movieGrid.innerHTML = '<p>No recommendations available</p>';
    return;
  }

  // Display the recommended movies/TV shows
  data.results.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average || 0;
      const id = item.id; // Unique ID of the movie or TV show
      const mediaType = item.media_type; // "movie" or "tv"

      // Create a link that points to the correct details page based on media type
      const link = document.createElement('a');
      link.href = mediaType === 'movie' 
        ? `movie-details.html?movie_id=${id}` // Movie details page
        : `tvshows-details.html?id=${id}`; // TV Show details page

      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      
      movieItem.innerHTML = `
        <div class="rating-container">
          <div class="rating">
            <span class="star">&#9733;</span><span class="rating-number">${rating.toFixed(1)}</span>
          </div>
        </div>
        <img src="${posterUrl}" alt="${title}" />
      `;

      // Append the movie item to the link and the link to the movie grid
      link.appendChild(movieItem);
      movieGrid.appendChild(link);
    }
  });
}

// Function to fetch movies/TV shows based on search query
async function fetchMovies(query) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;

  const response = await fetch(url);
  const data = await response.json();

  movieGrid.innerHTML = '';

  if (data.results.length === 0) {
    movieGrid.innerHTML = '<p>No results found</p>';
    return;
  }

  data.results.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average || 0;
      const id = item.id; // Unique ID of the movie or TV show
      const mediaType = item.media_type; // "movie" or "tv"

      // Create a link that points to the correct details page based on media type
      const link = document.createElement('a');
      link.href = mediaType === 'movie' 
        ? `movie-details.html?movie_id=${id}` // Movie details page
        : `tvshows-details.html?id=${id}`; // TV Show details page

      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      
      movieItem.innerHTML = `
        <div class="rating-container">
          <div class="rating">
            <span class="star">&#9733;</span><span class="rating-number">${rating.toFixed(1)}</span>
          </div>
        </div>
        <img src="${posterUrl}" alt="${title}" />
      `;

      // Append the movie item to the link and the link to the movie grid
      link.appendChild(movieItem);
      movieGrid.appendChild(link);
    }
  });
}

// Event listener for search input
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();

  if (query) {
    recommendationText.innerHTML = `<p>Searching for "${query}"...</p>`;
    fetchMovies(query);
  } else {
    recommendationText.innerHTML = '<p>Recommend Movies and TV Shows</p>';
    fetchRecommendations();
  }
});

// Function to initialize the search page based on URL query
function initializeSearchPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('query'); // Get the 'query' parameter from the URL

    if (queryFromUrl) {
        // If there's a query in the URL, set the search input value and fetch movies
        searchInput.value = queryFromUrl;
        recommendationText.innerHTML = `<p>Searching for "${queryFromUrl}"...</p>`;
        fetchMovies(queryFromUrl);
    } else {
        // If no query in the URL, show recommendations
        recommendationText.innerHTML = '<p>Recommend Movies and TV Shows</p>';
        fetchRecommendations();
    }
}

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', initializeSearchPage);
