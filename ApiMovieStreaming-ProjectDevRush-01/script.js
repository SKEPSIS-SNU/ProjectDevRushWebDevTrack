document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    const videoPlayer = document.getElementById('videoPlayer');
    const playerContainer = document.getElementById('player-container');
    const mediaGrid = document.getElementById('mediaGrid');

    const OMDB_API_KEY = '4d2697a5';
    let debounceTimer;
    let currentMedia = null;

    async function searchMovies(query) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`);
            const data = await response.json();
            return data.Search || [];
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    async function getMovieDetails(imdbID) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }

    function createSeasonSelector(totalSeasons) {
        const container = document.createElement('div');
        container.className = 'season-selector';
        
        const select = document.createElement('select');
        select.id = 'seasonSelect';
        for (let i = 1; i <= totalSeasons; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Season ${i}`;
            select.appendChild(option);
        }
        
        container.appendChild(select);
        return container;
    }

    async function loadEpisodes(imdbID, season) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&Season=${season}&apikey=${OMDB_API_KEY}`);
            const data = await response.json();
            return data.Episodes || [];
        } catch (error) {
            console.error('Error loading episodes:', error);
            return [];
        }
    }

    function createEpisodesList(episodes) {
        const container = document.createElement('div');
        container.className = 'episodes-list';
        
        episodes.forEach(episode => {
            const episodeItem = document.createElement('div');
            episodeItem.className = 'episode-item';
            episodeItem.innerHTML = `
                <div class="episode-number">Episode ${episode.Episode}</div>
                <div class="episode-title">${episode.Title}</div>
                <div class="episode-rating">⭐ ${episode.imdbRating}</div>
            `;
            episodeItem.addEventListener('click', () => {
                loadEpisode(currentMedia.imdbID, episode.Episode);
            });
            container.appendChild(episodeItem);
        });
        
        return container;
    }

    async function loadSeriesContent(media) {
        const details = await getMovieDetails(media.imdbID);
        currentMedia = details;
        
        const seriesContainer = document.createElement('div');
        seriesContainer.className = 'series-container';
        
        const infoContainer = document.createElement('div');
        infoContainer.className = 'series-info';
        infoContainer.innerHTML = `
            <h2>${details.Title}</h2>
            <p>${details.Plot}</p>
            <div class="series-meta">
                <span>⭐ ${details.imdbRating}</span>
                <span>${details.Year}</span>
                <span>${details.Genre}</span>
            </div>
        `;
        seriesContainer.appendChild(infoContainer);
        
        const seasonSelector = createSeasonSelector(details.totalSeasons);
        seriesContainer.appendChild(seasonSelector);
        
        const episodesContainer = document.createElement('div');
        episodesContainer.id = 'episodesContainer';
        seriesContainer.appendChild(episodesContainer);
        
        const episodes = await loadEpisodes(media.imdbID, 1);
        episodesContainer.appendChild(createEpisodesList(episodes));
        
        seasonSelector.querySelector('select').addEventListener('change', async (e) => {
            const episodes = await loadEpisodes(media.imdbID, e.target.value);
            episodesContainer.innerHTML = '';
            episodesContainer.appendChild(createEpisodesList(episodes));
        });
        
        return seriesContainer;
    }

    function loadEpisode(imdbID, episodeNumber) {
        const season = document.getElementById('seasonSelect').value;
        videoPlayer.src = `https://vidsrc.xyz/embed/tv/${imdbID}/${season}-${episodeNumber}`;
    }

    function displaySuggestions(results) {
        suggestions.innerHTML = '';
        
        results.forEach(async movie => {
            const details = await getMovieDetails(movie.imdbID);
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <img class="suggestion-poster" 
                     src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" 
                     alt="${movie.Title}">
                <div class="suggestion-details">
                    <div class="suggestion-title">${movie.Title}</div>
                    <div class="suggestion-info">
                        ${movie.Type.toUpperCase()} · ${movie.Year}
                        ${details?.imdbRating ? `· ⭐ ${details.imdbRating}` : ''}
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => loadMedia(movie));
            suggestions.appendChild(item);
        });
        
        suggestions.style.display = results.length ? 'block' : 'none';
    }

    async function loadMedia(media) {
        const details = await getMovieDetails(media.imdbID);
        playerContainer.classList.remove('hidden');
        
        if (details.Type === 'series') {
            const existingSeriesContainer = document.querySelector('.series-container');
            if (existingSeriesContainer) {
                existingSeriesContainer.remove();
            }
            const seriesContent = await loadSeriesContent(media);
            document.getElementById('featured').insertBefore(seriesContent, mediaGrid);
            videoPlayer.src = `https://vidsrc.xyz/embed/tv?imdb=${media.imdbID}`;
        } else {
            videoPlayer.src = `https://vidsrc.xyz/embed/movie?imdb=${media.imdbID}`;
            const existingSeriesContainer = document.querySelector('.series-container');
            if (existingSeriesContainer) {
                existingSeriesContainer.remove();
            }
        }
        
        suggestions.style.display = 'none';
        searchInput.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = e.target.value.trim();
            if (query.length >= 3) {
                const results = await searchMovies(query);
                displaySuggestions(results);
            } else {
                suggestions.style.display = 'none';
            }
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!suggestions.contains(e.target) && e.target !== searchInput) {
            suggestions.style.display = 'none';
        }
    });

    // Load featured content
    async function loadFeaturedContent() {
        const featuredImdbIDs = [
            'tt0944947', // Game of Thrones
            'tt0903747', // Breaking Bad
            'tt1475582', // Sherlock
            'tt0108778', // Friends
            'tt0455275', // Prison Break
            'tt0773262'  // Dexter
        ];
        
        for (const imdbID of featuredImdbIDs) {
            const movie = await getMovieDetails(imdbID);
            if (movie) {
                const card = document.createElement('div');
                card.className = 'media-card';
                card.innerHTML = `
                    <img class="media-poster" 
                         src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" 
                         alt="${movie.Title}">
                    <div class="media-info">
                        <div>${movie.Title}</div>
                        <div>${movie.Year} · ⭐ ${movie.imdbRating}</div>
                    </div>
                `;
                card.addEventListener('click', () => loadMedia({...movie, imdbID}));
                mediaGrid.appendChild(card);
            }
        }
    }

    loadFeaturedContent();
});