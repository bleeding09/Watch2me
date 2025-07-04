const part1 = 'ODhiNjNmMGNmYzQ1';
const part2 = 'MmE2NDdjYzM5NGQ3ZTNhNTIyMTQ=';
const apiKey = atob(part1 + part2);
const baseUrl = 'https://api.themoviedb.org/3';

// Helper function to fetch movies and populate the row
const fetchMovies = async (category, rowId) => {
    try {
        let url = '';
        switch (category) {
            case 'popular':
                url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
                break;
            case 'trending':
                url = `${baseUrl}/trending/movie/week?api_key=${apiKey}`;
                break;
            case 'top_rated':
                url = `${baseUrl}/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
                break;
            case 'action':
                url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=28&page=1`;
                break;
            case 'comedy':
                url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=35&page=1`;
                break;
            case 'horror':
                url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=27&page=1`;
                break;
            case 'romance':
                url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=10749&page=1`;
                break;
            case 'documentary':
                url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=99&page=1`;
                break;
            default:
                console.log('Unknown category');
                return;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data); // Log data for debugging

        const movieCards = document.getElementById(rowId);
        movieCards.innerHTML = ''; // Clear existing posters

        if (data.results && data.results.length > 0) {
            data.results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.style.position = 'relative'; // Essential for absolute positioning of the overlay

                // Movie poster
                const moviePoster = document.createElement('img');
                moviePoster.classList.add('row__poster');
                moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                moviePoster.alt = movie.title;

                // Create the overlay div
                const overlay = document.createElement('div');
                overlay.classList.add('poster-overlay');

                // Create and append the play button image
                const playButtonImg = document.createElement('img');
                playButtonImg.src = 'img/play-button.png'; // Make sure you have this image in your img folder
                playButtonImg.alt = 'Play';
                playButtonImg.classList.add('play-button-overlay');

                // Create and append the title
                const overlayTitle = document.createElement('p');
                overlayTitle.classList.add('overlay-title');
                overlayTitle.textContent = movie.title;

                // Create and append the rating and year
                const overlayMeta = document.createElement('p');
                overlayMeta.classList.add('overlay-meta');
                const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
                const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
                overlayMeta.innerHTML = `<i class="fas fa-star" style="color: #f7c400;"></i> ${rating} • ${releaseYear}`; // Font Awesome star and bullet point

                // Append elements to the overlay
                overlay.appendChild(playButtonImg);
                overlay.appendChild(overlayTitle);
                overlay.appendChild(overlayMeta);

                // Add "Add to List" icon (Font Awesome plus icon)
                const addToListIcon = document.createElement('button');
                addToListIcon.classList.add('add-to-list-icon');
                addToListIcon.innerHTML = '<i class="fas fa-plus"></i>'; // Default plus icon

                // Check if the movie is in the local storage list
                let movieList = JSON.parse(localStorage.getItem('movieList')) || [];
                if (movieList.find(m => m.id === movie.id)) {
                    addToListIcon.querySelector('i').classList.remove('fa-plus');
                    addToListIcon.querySelector('i').classList.add('fa-minus'); // Set to minus if already in list
                }

                // Event listener for "Add to List" icon
                addToListIcon.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent movie click event

                    // Toggle between plus and minus icons
                    const icon = addToListIcon.querySelector('i');
                    if (icon.classList.contains('fa-plus')) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');

                        // Add the movie to localStorage
                        movieList.push(movie); // Add the movie to the list
                        localStorage.setItem('movieList', JSON.stringify(movieList)); // Save back to localStorage
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');

                        // Remove movie from localStorage
                        movieList = movieList.filter(m => m.id !== movie.id); // Remove movie by ID
                        localStorage.setItem('movieList', JSON.stringify(movieList)); // Save back to localStorage
                    }
                });

                // Append the poster, overlay, and addToListIcon to the movie card
                movieCard.appendChild(moviePoster);
                movieCard.appendChild(overlay); // Add the overlay here
                movieCard.appendChild(addToListIcon);

                // Add click event to each movie poster to redirect to the movie details page
                movieCard.addEventListener('click', () => {
                    window.location.href = `movie-details.html?movie_id=${movie.id}`;
                });

                movieCards.appendChild(movieCard);
            });
        } else {
            console.log(`No results for category: ${category}`);
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the movie list from localStorage
    let movieList = JSON.parse(localStorage.getItem('movieList')) || [];

    // Get the container where movies will be displayed
    const movieListContainer = document.getElementById('movie-list-container');

    // Check if the list is empty
    if (movieListContainer && movieList.length === 0) { // Added check for movieListContainer
        movieListContainer.innerHTML = '<p>Your movie list is empty!</p>';
        return;
    } else if (movieListContainer) { // Only proceed if container exists
        // Loop through the list of movies and display them
        movieList.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            // Movie poster
            const moviePoster = document.createElement('img');
            moviePoster.classList.add('row__poster'); // Same class as the main page
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            moviePoster.alt = movie.title;

            // Movie title
            const movieTitle = document.createElement('p');
            movieTitle.textContent = movie.title;

            // Append poster and title to the movie card
            movieCard.appendChild(moviePoster);
            movieCard.appendChild(movieTitle);

            // Add the movie card to the movie list container
            movieCard.addEventListener('click', () => {
                window.location.href = `movie-details.html?movie_id=${movie.id}`;
            });

            movieListContainer.appendChild(movieCard);
        });
    }
});

const fetchBanner = async () => {
    try {
        // Fetch popular movies from the API
        const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        const response = await fetch(url);
        const data = await response.json();

        // Select a random movie from the list of popular movies
        const movie = data.results[Math.floor(Math.random() * data.results.length)];
        const movieId = movie.id;

        // ----------------------
        // Update Banner with Movie Data
        // ----------------------

        const banner = document.querySelector('.banner');
        const bannerContents = document.querySelector('.banner__contents');
        const trailerContainer = document.getElementById('trailer-container');
        const trailerIframe = document.getElementById('trailer-iframe');

        // Create and add "TOP 10" label
        let topTenLabel = document.querySelector('.top-ten-label');
        if (!topTenLabel) { // Create only if it doesn't exist
            topTenLabel = document.createElement('div');
            topTenLabel.classList.add('top-ten-label');
            banner.appendChild(topTenLabel);
        }
        topTenLabel.textContent = "TOP 10";

        // Set the banner title to the selected movie's title
        const bannerTitle = document.querySelector('.banner__title');
        bannerTitle.textContent = movie.title;

        // Set the banner description (limit to 150 characters for brevity)
        const bannerDescription = document.querySelector('.banner__description');
        bannerDescription.textContent = movie.overview.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview;

        // Set the banner background image using the movie's backdrop
        banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

        // ----------------------
        // Fetch and Play Trailer
        // ----------------------
        const videosUrl = `${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`;
        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();

        const trailer = videosData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

        if (trailer) {
            // Set the iframe source immediately, but it will be hidden by CSS opacity
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&disablekb=1&rel=0`;

            setTimeout(() => {
                // We no longer hide bannerContents, but play trailer behind it using z-index and opacity.
                // bannerContents.style.display = 'none'; // REMOVED
                trailerContainer.style.display = 'block'; // Make sure the container itself is block
                trailerContainer.classList.add('show-trailer'); // Add class to show trailer (fades in due to CSS transition)
            }, 3000); // 3-second delay
        } else {
            console.log('No trailer found for this movie.');
            // If no trailer, ensure the banner contents are visible and trailer container is hidden.
            // This is already the default state, but explicitly hide the trailer container.
            trailerContainer.style.display = 'none';
            trailerContainer.classList.remove('show-trailer');
            trailerIframe.src = ''; // Clear iframe src
        }

        // ----------------------
        // Play Button Functionality
        // ----------------------
        const playButton = document.getElementById('play-button');
        playButton.addEventListener('click', () => {
            window.location.href = `movie-details.html?movie_id=${movie.id}`;
        });

    } catch (error) {
        console.error('Error fetching banner data:', error);
    }
};

// Load a random movie for the banner when the page loads
fetchBanner();

const initArrowNavigation = () => {
    // Find all rows of posters (e.g., netflixOriginals, topRated, etc.)
    const allRows = document.querySelectorAll('.row__posters');

    // Loop over each row and add the scroll functionality
    allRows.forEach(rowPosters => {
        const prevButton = rowPosters.parentElement.querySelector('.arrow-button.prev');
        const nextButton = rowPosters.parentElement.querySelector('.arrow-button.next');
        let scrollAmount = 0;
        const scrollStep = 220; // Adjust scroll step to your preference

        // Check if both buttons exist
        if (prevButton && nextButton) {
            // Scroll left (previous)
            prevButton.addEventListener('click', () => {
                // Ensure we don't scroll past the start
                if (scrollAmount > 0) {
                    scrollAmount -= scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });

            // Scroll right (next)
            nextButton.addEventListener('click', () => {
                // Ensure we don't scroll past the end
                const maxScroll = rowPosters.scrollWidth - rowPosters.clientWidth;
                if (scrollAmount < maxScroll) {
                    scrollAmount += scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
};


// --- EXPANDING SEARCH ICON LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const searchIconContainer = document.getElementById('search-icon-container'); // The main div for search icon
    const expandedSearchInput = document.getElementById('expanded-search-input');
    const expandedSearchButton = document.getElementById('expanded-search-button');

    // Function to show/hide the expanded search bar
    const toggleExpandedSearchBar = (show) => {
        if (show) {
            searchIconContainer.classList.add('expanded');
            expandedSearchInput.focus(); // Focus the input when expanded
        } else {
            searchIconContainer.classList.remove('expanded');
            expandedSearchInput.value = ''; // Clear input when collapsed
        }
    };

    // Function to handle scroll to show/hide expanded search bar
    const handleScrollForSearch = () => {
        const scrollThreshold = 100; // Adjust this value as needed
        if (window.scrollY > scrollThreshold) {
            // Keep it open if user clicks, otherwise close it when scrolling back up
            if (!searchIconContainer.classList.contains('expanded')) {
                toggleExpandedSearchBar(true);
            }
        } else {
            toggleExpandedSearchBar(false);
        }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScrollForSearch);

    // Initial check in case the page loads scrolled down
    handleScrollForSearch();

    // Event listener for clicking the search icon itself to toggle or redirect
    if (searchIconContainer) {
        searchIconContainer.addEventListener('click', (event) => {
            // Check if the search bar is currently expanded
            const isExpanded = searchIconContainer.classList.contains('expanded');

            // Check if the click was directly on the icon or its immediate container,
            // not on the input field or button inside the expanded bar.
            const clickedOnIconOrContainer = event.target.classList.contains('fas') || event.target.id === 'search-icon-container';

            if (clickedOnIconOrContainer) {
                if (isExpanded) {
                    // If the search bar is already expanded (due to scroll or previous click),
                    // then we just toggle it closed. We don't want to redirect here.
                    toggleExpandedSearchBar(false); // Close the search bar
                } else {
                    // If the search bar is NOT expanded (only icon is visible),
                    // then redirect to search.html when the icon is clicked.
                    window.location.href = `search.html`;
                }
            }
            // If the click was inside the expanded input/button, let their specific handlers manage it.
            // No need to stopPropagation here as the handlers for input/button are specifically added later.
        });
    }

    // Event listener for the expanded search button
    if (expandedSearchButton) {
        expandedSearchButton.addEventListener('click', () => {
            const query = expandedSearchInput.value.trim();
            if (query) {
                window.location.href = `search.html?query=${encodeURIComponent(query)}`;
            } else {
                window.location.href = `search.html`; // Go to search page even if empty
            }
        });
    }

    // Handle pressing Enter key in the search input
    if (expandedSearchInput) {
        expandedSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                expandedSearchButton.click(); // Simulate a click on the search button
            }
        });
    }

    // Close the search bar if clicked outside (but not on the search icon container itself)
    document.addEventListener('click', function(event) {
        if (searchIconContainer &&
            !searchIconContainer.contains(event.target) && // If click is not inside the search bar container
            searchIconContainer.classList.contains('expanded')) { // And if it's currently expanded
            toggleExpandedSearchBar(false);
        }
    });

    // Stop propagation for clicks INSIDE the input/button to prevent them from closing the bar
    if (expandedSearchInput) {
        expandedSearchInput.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
    if (expandedSearchButton) {
        expandedSearchButton.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
});


// --- END EXPANDING SEARCH ICON LOGIC ---


// Array of movie endpoints with custom server names
const MOVIE_ENDPOINTS = [
        { url: 'https://vidsrc.cc/v2/embed/movie/', name: 'Vidsrc.cc (1080p/4K)' },
        { url: 'https://player.videasy.net/movie/', name: 'VidEasy (1080p/4K)' },
        { url: 'https://vidsrc.su/embed/movie/', name: 'Vidsrc.su (1080p/4K)' },
		{ url: 'https://vidlink.pro/movie/', name: 'VidLink Pro (1080p/4K)' },
        { url: 'https://embed.su/embed/movie/', name: 'Embed.su (1080p)' },
        { url: 'https://moviesapi.club/movie/', name: 'MoviesAPI Club (Low-Q/1080p)' },
        { url: 'https://frembed.xyz/api/film.php?id=', name: 'Frembed.live (1080p)' },
        { url: 'https://vidfast.pro/movie/', name: 'VidFast (1080p)' },
        { url: 'https://player.autoembed.cc/embed/movie/', name: 'AutoEmbed (1080p)' },
		{ url: 'https://vidsrc.dev/embed/movie/', name: 'Vidsrc.dev' },
        { url: 'https://vidsrc.io/embed/movie/', name: 'Vidsrc.io' },
        { url: 'https://player.vidsrc.co/embed/movie/', name: 'Vidsrc.co' },
        { url: 'https://vidsrc.icu/embed/movie/', name: 'Vidsrc.icu' },
        { url: 'https://vidsrc.to/embed/movie/', name: 'Vidsrc.to' },
        { url: 'https://vidsrc.xyz/embed/movie/', name: 'Vidsrc.xyz' },
		{ url: 'https://api.hexa.watch/movie/', name: 'Hexa' },
        { url: 'https://111movies.com/movie/', name: '111movies' },
        { url: 'https://rivestream.live/embed?type=movie&id=', name: 'riverstream' },
        { url: 'https://www.2embed.cc/embed/', name: '2emBedcc' },
        { url: 'https://vidjoy.pro/embed/movie/', name: 'VidJoyPro' }
];

// Variable to keep track of the current server index
let currentServerIndex = 0; // To store which server is currently selected

// Fetch movie details based on the movieId
const fetchMovieDetails = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movie_id');

    if (!movieId) {
        console.error('No movie ID found in URL.');
        return;
    }

    try {
        // Fetch the movie details using the movie ID
        const movieUrl = `${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`;
        const response = await fetch(movieUrl);
        const movie = await response.json();

        // Update poster
        const moviePosterElement = document.getElementById('movie-poster');
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/300x450/000000/FFFFFF?text=No+Poster';
        if (moviePosterElement) moviePosterElement.src = posterUrl;

        // Update background
        const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'https://placehold.co/1500x800/000000/FFFFFF?text=No+Backdrop+Available';
        const blurredBackground = document.getElementById('blurred-background');
        if (blurredBackground) blurredBackground.style.backgroundImage = `url(${backdropUrl})`;

        // Update title (above description)
        const movieTitleElement = document.getElementById('movie-title');
        if (movieTitleElement) movieTitleElement.textContent = movie.title || 'Unknown Title';

        // Update description
        const movieDescriptionElement = document.getElementById('movie-description');
        if (movieDescriptionElement) movieDescriptionElement.textContent = movie.overview || 'No description available.';

        // Update rating (above watch now button)
        const movieRating = movie.vote_average; // Rating from 1 to 10
        const starContainer = document.getElementById('movie-rating');
        if (starContainer) {
            starContainer.innerHTML = ''; // Clear existing stars
            const filledStars = Math.round(movieRating / 2); // Convert 10-point rating to 5-point scale
            const emptyStars = 5 - filledStars;

            for (let i = 0; i < filledStars; i++) {
                const star = document.createElement('span');
                star.classList.add('star', 'filled');
                starContainer.appendChild(star);
            }
            for (let i = 0; i < emptyStars; i++) {
                const star = document.createElement('span');
                star.classList.add('star', 'empty');
                starContainer.appendChild(star);
            }
        }

        // Update release year (above watch now button)
        const releaseDateTextElement = document.getElementById('release-date-text');
        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        if (releaseDateTextElement) releaseDateTextElement.textContent = `Year: ${releaseYear}`;

        // Update genres (above watch now button)
        const movieGenresInlineContainer = document.getElementById('movie-genres-inline');
        if (movieGenresInlineContainer) {
            movieGenresInlineContainer.innerHTML = '';
            if (movie.genres && movie.genres.length > 0) {
                movie.genres.forEach(genre => {
                    const genreElement = document.createElement('span');
                    genreElement.classList.add('genre-tag');
                    genreElement.textContent = genre.name;
                    movieGenresInlineContainer.appendChild(genreElement);
                });
            } else {
                const noGenre = document.createElement('span');
                noGenre.classList.add('genre-tag');
                noGenre.textContent = 'No Genres';
                movieGenresInlineContainer.appendChild(noGenre);
            }
        }

        // Fetch movie cast
        const creditsUrl = `${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`;
        const creditsResponse = await fetch(creditsUrl);
        const credits = await creditsResponse.json();
        const castList = document.getElementById('movie-cast');
        if (castList) {
            castList.innerHTML = ''; // Clear existing cast

            if (credits.cast && credits.cast.length > 0) {
                // Display up to 6 cast members
                credits.cast.slice(0, 6).forEach(member => {
                    const castMemberDiv = document.createElement('div');
                    castMemberDiv.classList.add('cast-member');

                    const profilePath = member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : 'https://placehold.co/100x100/CCCCCC/000000?text=No+Image';
                    const castImg = document.createElement('img');
                    castImg.src = profilePath;
                    castImg.alt = member.name;
                    castImg.onerror = function() { this.src = 'https://placehold.co/100x100/CCCCCC/000000?text=No+Image'; }; // Fallback for broken images

                    const castName = document.createElement('p');
                    castName.textContent = member.name;

                    castMemberDiv.appendChild(castImg);
                    castMemberDiv.appendChild(castName);
                    castList.appendChild(castMemberDiv);
                });
            } else {
                const noCast = document.createElement('p');
                noCast.textContent = 'No cast information available.';
                castList.appendChild(noCast);
            }
        }

        // Fetch similar movies
        fetchSimilarMovies(movieId);

        // Add functionality for Watch Now Button
        const watchNowBtn = document.getElementById('watch-now-btn');
        if (watchNowBtn) {
            watchNowBtn.addEventListener('click', () => {
                const iframeContainer = document.getElementById('iframe-container');
                const movieIframe = document.getElementById('movie-iframe');

                if (iframeContainer && movieIframe) {
                    iframeContainer.style.display = 'flex';
                    movieIframe.src = `${MOVIE_ENDPOINTS[currentServerIndex].url}${movieId}`;
                }
            });
        }

        // Add functionality for Change Server Button
        const changeServerBtn = document.getElementById('change-server-btn');
        const serverDropdown = document.getElementById('server-dropdown');
        const serverList = document.getElementById('server-list');

        if (changeServerBtn && serverDropdown && serverList) {

            // Function to change the server
            const changeServer = (index) => {
                currentServerIndex = index;
                const iframe = document.getElementById('movie-iframe');
                const serverListItems = document.querySelectorAll('#server-list li');

                // Alisin ang 'active' class sa lahat ng item
                serverListItems.forEach(item => {
                    item.classList.remove('active');
                });

                // Idagdag ang 'active' class sa piniling item
                const selectedItem = document.querySelector(`#server-list li[data-index='${index}']`);
                if (selectedItem) {
                    selectedItem.classList.add('active');
                }

                // Palitan ang source ng iframe
                if (iframe) {
                    iframe.src = `${MOVIE_ENDPOINTS[currentServerIndex].url}${movieId}`;
                }

                // INAYOS DITO: Itago ang dropdown gamit ang class para maiwasan ang bug
                serverDropdown.classList.remove('show');
                console.log(`Changed to server: ${MOVIE_ENDPOINTS[currentServerIndex].name}`);
            };

            // Populate the server list with custom names
            serverList.innerHTML = ''; // Linisin muna ang listahan
            MOVIE_ENDPOINTS.forEach((endpoint, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = endpoint.name;
                listItem.dataset.index = index;

                if (index === 0) {
                    listItem.classList.add('active');
                }

                listItem.addEventListener('click', (event) => {
                    event.stopPropagation(); // Pigilan ang pag-propagate ng click event
                    changeServer(index);
                });

                serverList.appendChild(listItem);
            });

            // INAYOS DITO: Ito ang tamang paraan para i-toggle ang dropdown
            changeServerBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Pigilan ang click na umabot sa 'window'
                serverDropdown.classList.toggle('show');
            });

            // Idinagdag para isara ang dropdown kapag nag-click sa labas
            window.addEventListener('click', () => {
                if(serverDropdown.classList.contains('show')) {
                    serverDropdown.classList.remove('show');
                }
            });
        }

        // Add functionality for Close Iframe Button
        const closeIframeBtn = document.getElementById('close-iframe-btn');
        if (closeIframeBtn) {
            closeIframeBtn.addEventListener('click', () => {
                const iframeContainer = document.getElementById('iframe-container');
                const movieIframe = document.getElementById('movie-iframe');
                if (iframeContainer) iframeContainer.style.display = 'none';
                if (movieIframe) movieIframe.src = ''; // Clear iframe src to stop playback
            });
        }

    } catch (error) {
        console.error('Error fetching movie details:', error);
        // Display error message to user
        const movieTitleElement = document.getElementById('movie-title');
        if (movieTitleElement) movieTitleElement.textContent = 'Error loading movie details.';
        const movieDescriptionElement = document.getElementById('movie-description');
        if (movieDescriptionElement) movieDescriptionElement.textContent = 'Please try again later.';
        const moviePosterElement = document.getElementById('movie-poster');
        if (moviePosterElement) moviePosterElement.src = 'https://placehold.co/300x450/FF0000/FFFFFF?text=Error';
    }
};

// Fetch More Like This Movies (renamed from fetchMoreLikeThis to avoid conflict)
const fetchSimilarMovies = async (movieId) => {
    try {
        const similarMoviesUrl = `${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`;
        const similarMoviesResponse = await fetch(similarMoviesUrl);
        const similarMoviesData = await similarMoviesResponse.json();

        const similarMoviesContainer = document.getElementById('similar-movies-container');
        if (similarMoviesContainer) {
            similarMoviesContainer.innerHTML = ''; // Clear existing similar movies

            if (similarMoviesData.results && similarMoviesData.results.length > 0) {
                similarMoviesData.results.slice(0, 10).forEach(movie => { // Limit to 10 similar movies
                    const movieItem = document.createElement('div');
                    movieItem.classList.add('similar-movie-item');

                    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/180x270/000000/FFFFFF?text=No+Image';
                    const movieImage = document.createElement('img');
                    movieImage.src = posterPath;
                    movieImage.alt = movie.title;
                    movieImage.onerror = function() { this.src = 'https://placehold.co/180x270/000000/FFFFFF?text=No+Image'; }; // Fallback for broken images

                    const movieTitle = document.createElement('p');
                    movieTitle.textContent = movie.title;

                    movieItem.appendChild(movieImage);
                    movieItem.appendChild(movieTitle);

                    movieItem.addEventListener('click', () => {
                        window.location.href = `movie-details.html?movie_id=${movie.id}`;
                    });
                    similarMoviesContainer.appendChild(movieItem);
                });
            } else {
                const noSimilar = document.createElement('p');
                noSimilar.textContent = 'No similar movies found.';
                similarMoviesContainer.appendChild(noSimilar);
            }
        }
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        const similarMoviesContainer = document.getElementById('similar-movies-container');
        if (similarMoviesContainer) similarMoviesContainer.innerHTML = '<p>Error loading similar movies.</p>';
    }
};

// Fetch data for different categories (keep existing)
fetchMovies('popular', 'netflixOriginals');
fetchMovies('trending', 'trendingNow');
fetchMovies('top_rated', 'topRated');
fetchMovies('action', 'actionMovies');
fetchMovies('comedy', 'comedyMovies');
fetchMovies('horror', 'horrorMovies');
fetchMovies('romance', 'romanceMovies');
fetchMovies('documentary', 'documentaries');

// Initialize arrow buttons functionality after fetching the movie data (keep existing)
document.addEventListener('DOMContentLoaded', initArrowNavigation);

// JavaScript for the Close Button (on movie-details.html, not movies.html)
const closeButton = document.getElementById('close-button');
if (closeButton) { // Check if the close button exists (it's likely on movie-details.html)
    closeButton.addEventListener('click', () => {
        window.location.href = 'movies.html';
    });
}

window.addEventListener("load", function() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) { // Check if loading screen exists
        setTimeout(function() {
            loadingScreen.style.display = "none";
        }, 1000); // 1000ms = 1 second
    }
});
