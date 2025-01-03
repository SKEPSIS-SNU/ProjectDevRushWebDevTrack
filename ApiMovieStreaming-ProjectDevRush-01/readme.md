# API Movie Streaming Project - DevRush Session 01
## Web Development Track - Project Dev Rush by Skepsis

A vanilla JavaScript project demonstrating API integration, DOM manipulation, and async programming through a movie streaming platform interface.

## Project Overview
Build a streaming platform interface that allows users to:
- Search movies and TV shows
- View search suggestions with posters
- Stream content using embedded players
- Browse TV show seasons and episodes

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## APIs Used
1. OMDB API (Open Movie Database)
   - Provides movie/TV show data
   - Endpoints used:
     - Search: `https://www.omdbapi.com/?s={query}`
     - Details: `https://www.omdbapi.com/?i={imdbID}`
     - Season info: `https://www.omdbapi.com/?i={imdbID}&Season={number}`

2. Vidsrc API
   - Provides video streaming links
   - Endpoints:
     - Movies: `https://vidsrc.xyz/embed/movie?imdb={imdbID}`
     - TV Shows: `https://vidsrc.xyz/embed/tv/{imdbID}/{season}-{episode}`

## Step-by-Step Build Guide

### 1. HTML Structure
```html
Key elements used:
- <nav> for navigation bar
- <input> for search functionality
- <iframe> for video player
- <div> containers for content organization
```

### 2. CSS Styling Highlights
```css
Key concepts demonstrated:
- Flexbox layout
- Grid layout for media cards
- Position fixed/absolute for search suggestions
- CSS transitions for hover effects
- CSS variables for theme colors
```

### 3. JavaScript Concepts & Functions Explained

#### Event Handling and Debouncing
The search functionality uses debouncing to prevent excessive API calls. When a user types in the search box, instead of making an API call for every keystroke, we wait for a brief pause in typing (300ms) before sending the request.

```javascript
searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        // Search logic
    }, 300);
});
```

#### Asynchronous API Calls
The project uses modern async/await syntax for handling API calls. This makes asynchronous code more readable and manageable compared to traditional promise chains.

```javascript
async function getMovieDetails(imdbID) {
    try {
        const response = await fetch(`${API_URL}${imdbID}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
```

#### Dynamic Content Creation
The project extensively uses DOM manipulation to create elements dynamically. For example, creating episode lists for TV shows:

```javascript
function createEpisodesList(episodes) {
    const container = document.createElement('div');
    episodes.forEach(episode => {
        // Create episode elements
    });
}
```

#### Function Types Used:

1. **Event Handler Functions**
   - Handle user interactions
   - Example: Search input handler, episode selection handler

2. **Async Functions**
   - Make API calls
   - Load content asynchronously
   - Example: searchMovies(), getMovieDetails()

3. **Helper Functions**
   - Create UI elements
   - Format data
   - Example: createSeasonSelector(), createEpisodesList()

4. **State Management Functions**
   - Handle media player state
   - Manage current selection
   - Example: loadMedia(), loadEpisode()

#### Key JavaScript Features Demonstrated:

1. **Error Handling**
   ```javascript
   try {
       const response = await fetch(url);
       // Handle response
   } catch (error) {
       console.error('Error:', error);
   }
   ```

2. **Template Literals**
   ```javascript
   `https://vidsrc.xyz/embed/tv/${imdbID}/${season}-${episode}`
   ```

3. **Array Methods**
   ```javascript
   episodes.forEach(episode => {
       // Process each episode
   });
   ```

4. **Object Destructuring**
   ```javascript
   const { Title, Year, imdbRating } = movieDetails;
   ```

5. **Optional Chaining**
   ```javascript
   details?.imdbRating ? `· ⭐ ${details.imdbRating}` : ''
   ```

#### State Management
The project maintains state for:
- Current media playing
- Selected season/episode for TV shows
- Search results
- UI state (suggestions visible/hidden)

Functions work together to create a seamless user experience:
1. User searches for content
2. Debounced search triggers API call
3. Results display as suggestions
4. User selects content
5. Content loads in player
6. For TV shows, season/episode selection becomes available

For any issues contact team Skepsis