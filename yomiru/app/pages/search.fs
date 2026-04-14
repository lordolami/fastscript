import { searchAnime } from '../lib/anilist.fs';

export async function loader({ url }) {
  const query = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  
  let anime = [];
  if (query) {
    anime = await searchAnime(query, page, 24);
  }
  
  return { anime, query, page };
}

function AnimeCard({ anime }) {
  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? Math.round(anime.averageScore / 10) / 10 : null;
  
  return (
    <a href={`/anime/${anime.id}`} class="anime-card">
      <div class="anime-card-poster">
        <img src={anime.coverImage.large} alt={title} loading="lazy" />
        {score && <div class="badge badge-score">⭐ {score}</div>}
        {anime.format && <div class="badge badge-format">{anime.format}</div>}
        {anime.isAdult && <div class="badge badge-adult">18+</div>}
        <div class="anime-card-overlay">
          <div class="anime-card-overlay-title">{title}</div>
          <div class="anime-card-overlay-meta">
            {anime.episodes && <span>{anime.episodes} eps</span>}
            {anime.format && <span>{anime.format}</span>}
          </div>
        </div>
      </div>
      <div class="anime-card-info">
        <div class="anime-card-title">{title}</div>
        <div class="anime-card-meta">
          {anime.episodes && <span>{anime.episodes} eps</span>}
          {anime.seasonYear && <span>{anime.seasonYear}</span>}
        </div>
      </div>
    </a>
  );
}

export default function Search({ data }) {
  const { anime, query } = data;
  
  return (
    <div class="page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">🔍 Search Anime</h1>
          <p class="page-subtitle">Find your favorite anime</p>
        </div>
        
        <form method="get" action="/search" class="search-form">
          <input 
            type="text" 
            name="q" 
            value={query}
            placeholder="Search for anime..."
            class="search-input"
          />
        </form>
        
        {query && anime.length === 0 && (
          <div class="search-empty">
            <p>No results found for "{query}"</p>
          </div>
        )}
        
        {anime.length > 0 && (
          <>
            <p class="search-results-count">
              Found {anime.length} results for "{query}"
            </p>
            <div class="anime-grid">
              {anime.map(a => <AnimeCard anime={a} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
