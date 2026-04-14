import { getAnimeDetails } from '../../lib/anilist.fs';

export async function loader({ params }) {
  const anime = await getAnimeDetails(params.id);
  if (!anime) {
    throw new Error('Anime not found');
  }
  
  // Strip HTML from description
  if (anime.description) {
    anime.description = anime.description.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '');
  }
  
  return { anime };
}

export default function AnimeDetails({ data }) {
  const { anime } = data;
  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? Math.round(anime.averageScore / 10) / 10 : null;
  const desc = anime.description || 'No description available.';
  
  return (
    <div class="anime-details">
      {anime.bannerImage && (
        <div class="anime-banner" data-bg={anime.bannerImage}>
          <div class="anime-banner-overlay" />
        </div>
      )}
      
      <div class="container">
        <div class="anime-details-content">
          <div class="anime-poster">
            <img src={anime.coverImage.extraLarge || anime.coverImage.large} alt={title} />
            {anime.isAdult && <div class="badge badge-adult">18+</div>}
          </div>
          
          <div class="anime-info">
            <h1 class="anime-title">{title}</h1>
            {anime.title.native && (
              <p class="anime-title-native">{anime.title.native}</p>
            )}
            
            <div class="anime-meta-grid">
              {score && (
                <div class="anime-meta-item">
                  <span class="meta-label">Score</span>
                  <span class="meta-value">⭐ {score}/10</span>
                </div>
              )}
              
              {anime.format && (
                <div class="anime-meta-item">
                  <span class="meta-label">Format</span>
                  <span class="meta-value">{anime.format}</span>
                </div>
              )}
              
              {anime.episodes && (
                <div class="anime-meta-item">
                  <span class="meta-label">Episodes</span>
                  <span class="meta-value">{anime.episodes}</span>
                </div>
              )}
              
              {anime.status && (
                <div class="anime-meta-item">
                  <span class="meta-label">Status</span>
                  <span class="meta-value">{anime.status}</span>
                </div>
              )}
              
              {anime.seasonYear && (
                <div class="anime-meta-item">
                  <span class="meta-label">Year</span>
                  <span class="meta-value">{anime.seasonYear}</span>
                </div>
              )}
              
              {anime.duration && (
                <div class="anime-meta-item">
                  <span class="meta-label">Duration</span>
                  <span class="meta-value">{anime.duration} min</span>
                </div>
              )}
            </div>
            
            <div class="anime-actions">
              <button class="btn btn-primary">▶️ Watch Now</button>
              <button class="btn btn-secondary">+ Add to List</button>
              <button class="btn btn-secondary">❤️ Favorite</button>
            </div>
            
            <div class="anime-desc">
              <h3>Synopsis</h3>
              <p>{desc}</p>
            </div>
            
            {anime.genres && anime.genres.length > 0 && (
              <>
                <h3>Genres</h3>
                <div class="genre-tags">
                  {anime.genres.map(genre => (
                    <a href={`/genre/${genre.toLowerCase()}`} class="genre-tag">
                      {genre}
                    </a>
                  ))}
                </div>
              </>
            )}
            
            {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
              <>
                <h3>Studios</h3>
                <p class="studios-text">
                  {anime.studios.nodes.map(s => s.name).join(', ')}
                </p>
              </>
            )}
            
            {anime.trailer && (
              <>
                <h3>Trailer</h3>
                <div class="trailer-container">
                  <iframe 
                    src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                    frameborder="0"
                    allowfullscreen
                  />
                </div>
              </>
            )}
            
            {anime.characters?.nodes && anime.characters.nodes.length > 0 && (
              <>
                <h3>Characters</h3>
                <div class="characters-grid">
                  {anime.characters.nodes.slice(0, 12).map(char => (
                    <div class="character-item">
                      <img 
                        src={char.image.large} 
                        alt={char.name.full}
                        class="character-img"
                      />
                      <p class="character-name">{char.name.full}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {anime.recommendations?.nodes && anime.recommendations.nodes.length > 0 && (
              <>
                <h3>Recommendations</h3>
                <div class="recommendations-grid">
                  {anime.recommendations.nodes.slice(0, 12).map(rec => {
                    const media = rec.mediaRecommendation;
                    if (!media) return null;
                    return (
                      <a href={`/anime/${media.id}`} class="recommendation-link">
                        <img 
                          src={media.coverImage.large} 
                          alt={media.title.romaji}
                          class="recommendation-img"
                        />
                        <p class="recommendation-title">
                          {media.title.romaji}
                        </p>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{__html: `
        const banner = document.querySelector('.anime-banner[data-bg]');
        if (banner) {
          banner.style.backgroundImage = 'url(' + banner.dataset.bg + ')';
        }
      `}} />
    </div>
  );
}
