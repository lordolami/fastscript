import { getByFormat } from '../lib/anilist.fs';

export async function loader({ url }) {
  const page = parseInt(url.searchParams.get('page') || '1');
  const anime = await getByFormat('TV', page, 24);
  return { anime, page };
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

export default function TV({ data }) {
  const { anime, page } = data;
  
  return (
    <div class="page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">📺 TV Series</h1>
          <p class="page-subtitle">Binge-worthy anime TV series</p>
        </div>
        
        <div class="anime-grid">
          {anime.map(a => <AnimeCard anime={a} />)}
        </div>
      </div>
    </div>
  );
}
