import { getTrending, getPopular, getTopAiring } from '../lib/anilist.fs';

export async function loader() {
  const [trending, popular, airing] = await Promise.all([
    getTrending(1, 10),
    getPopular(1, 18),
    getTopAiring(1, 18)
  ]);
  
  return { trending, popular, airing };
}

function AnimeCard({ anime }) {
  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? Math.round(anime.averageScore / 10) / 10 : null;
  
  return (
    <a href={`/anime/${anime.id}`} class="anime-card">
      <div class="anime-card-poster">
        <img 
          src={anime.coverImage.large} 
          alt={title}
          loading="lazy"
        />
        
        {score && (
          <div class="badge badge-score">
            ⭐ {score}
          </div>
        )}
        
        {anime.format && (
          <div class="badge badge-format">
            {anime.format}
          </div>
        )}
        
        {anime.isAdult && (
          <div class="badge badge-adult">
            18+
          </div>
        )}
        
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

export default function Home({ data }) {
  const { trending, popular, airing } = data;
  const heroAnime = trending.slice(0, 5);
  
  return (
    <>
      <section class="hero">
        {heroAnime.map((anime, index) => {
          const title = anime.title.english || anime.title.romaji;
          const desc = anime.description?.replace(/<[^>]*>/g, '').slice(0, 200) + '...';
          const score = anime.averageScore ? Math.round(anime.averageScore / 10) / 10 : null;
          
          return (
            <div class={index === 0 ? 'hero-slide active' : 'hero-slide'} data-index={index}>
              <div 
                class="hero-bg" 
                data-bg={anime.bannerImage || anime.coverImage.extraLarge}
              />
              <div class="hero-overlay" />
              
              <div class="container">
                <div class="hero-content">
                  <div class="hero-badge">
                    #{index + 1} Trending
                  </div>
                  
                  <h1 class="hero-title">{title}</h1>
                  
                  <div class="hero-meta">
                    {score && <span>⭐ {score}</span>}
                    {anime.episodes && <span>📺 {anime.episodes} Episodes</span>}
                    {anime.seasonYear && <span>📅 {anime.seasonYear}</span>}
                    {anime.format && <span>🎬 {anime.format}</span>}
                  </div>
                  
                  {desc && <p class="hero-desc">{desc}</p>}
                  
                  {anime.genres && anime.genres.length > 0 && (
                    <div class="hero-meta">
                      <span>🏷️ {anime.genres.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                  
                  <div class="hero-actions">
                    <a href={`/anime/${anime.id}`} class="btn btn-primary">
                      ▶️ Watch Now
                    </a>
                    <a href={`/anime/${anime.id}`} class="btn btn-secondary">
                      ℹ️ More Info
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div class="hero-controls">
          <button class="hero-nav-btn" onclick="prevSlide()">‹</button>
          <button class="hero-nav-btn" onclick="nextSlide()">›</button>
        </div>
      </section>

      <div class="container">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">🔥 Trending Now</h2>
            <a href="/trending" class="section-link">View All →</a>
          </div>
          
          <div class="anime-grid">
            {trending.slice(5).map(anime => <AnimeCard anime={anime} />)}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">⭐ Most Popular</h2>
            <a href="/popular" class="section-link">View All →</a>
          </div>
          
          <div class="anime-grid">
            {popular.map(anime => <AnimeCard anime={anime} />)}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">📺 Top Airing</h2>
            <a href="/airing" class="section-link">View All →</a>
          </div>
          
          <div class="anime-grid">
            {airing.map(anime => <AnimeCard anime={anime} />)}
          </div>
        </section>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        // Set background images
        document.querySelectorAll('.hero-bg[data-bg]').forEach(el => {
          el.style.backgroundImage = 'url(' + el.dataset.bg + ')';
        });
        
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const totalSlides = slides.length;
        
        function showSlide(index) {
          slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
          });
        }
        
        function nextSlide() {
          currentSlide = (currentSlide + 1) % totalSlides;
          showSlide(currentSlide);
        }
        
        function prevSlide() {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          showSlide(currentSlide);
        }
        
        // Auto-advance every 5 seconds
        setInterval(nextSlide, 5000);
      `}} />
    </>
  );
}
