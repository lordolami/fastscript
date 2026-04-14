export default function Layout({ children, url }) {
  const currentPath = url?.pathname || '/';
  
  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Yomiru - Watch Anime Online</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <header class="header">
          <div class="header-inner">
            <a href="/" class="logo">
              <div class="logo-icon">Y</div>
              <span>Yomiru</span>
            </a>
            
            <nav class="nav">
              <a href="/" class={isActive('/') ? 'nav-link active' : 'nav-link'}>
                Home
              </a>
              <a href="/trending" class={isActive('/trending') ? 'nav-link active' : 'nav-link'}>
                Trending
              </a>
              <a href="/popular" class={isActive('/popular') ? 'nav-link active' : 'nav-link'}>
                Popular
              </a>
              <a href="/tv" class={isActive('/tv') ? 'nav-link active' : 'nav-link'}>
                TV Series
              </a>
              <a href="/movies" class={isActive('/movies') ? 'nav-link active' : 'nav-link'}>
                Movies
              </a>
            </nav>
            
            <a href="/search" class="search-btn">
              🔍 Search
            </a>
          </div>
        </header>

        <main>
          {children}
        </main>

        <footer class="footer">
          <div class="container">
            <div class="footer-content">
              <div class="footer-brand">
                <div class="logo">
                  <div class="logo-icon">Y</div>
                  <span>Yomiru</span>
                </div>
                <p class="footer-desc">
                  Your ultimate destination for streaming anime online. Watch thousands of anime series and movies with high-quality video and subtitles.
                </p>
              </div>
              
              <div class="footer-col">
                <h3>Browse</h3>
                <a href="/trending">Trending Now</a>
                <a href="/popular">Most Popular</a>
                <a href="/tv">TV Series</a>
                <a href="/movies">Movies</a>
              </div>
              
              <div class="footer-col">
                <h3>Info</h3>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
                <a href="/terms">Terms of Service</a>
                <a href="/privacy">Privacy Policy</a>
              </div>
            </div>
            
            <div class="footer-bottom">
              <p>© 2026 Yomiru. All anime content is provided by AniList API. This site does not host any files.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
