const ANILIST_API = 'https://graphql.anilist.co';

async function query(gql, variables = {}) {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: gql, variables })
    });
    
    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`);
    }
    
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('AniList query failed:', error);
    return null;
  }
}

export async function getTrending(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          title { romaji english }
          coverImage { large extraLarge color }
          bannerImage
          description
          genres
          averageScore
          episodes
          season
          seasonYear
          format
          status
          isAdult
        }
      }
    }
  `;
  
  const data = await query(gql, { page, perPage });
  return data?.Page?.media || [];
}

export async function getPopular(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME) {
          id
          title { romaji english }
          coverImage { large extraLarge }
          averageScore
          episodes
          format
          status
          isAdult
        }
      }
    }
  `;
  
  const data = await query(gql, { page, perPage });
  return data?.Page?.media || [];
}

export async function getTopAiring(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: SCORE_DESC, type: ANIME, status: RELEASING) {
          id
          title { romaji english }
          coverImage { large extraLarge }
          averageScore
          episodes
          format
          nextAiringEpisode { episode }
          isAdult
        }
      }
    }
  `;
  
  const data = await query(gql, { page, perPage });
  return data?.Page?.media || [];
}

export async function getByFormat(format, page = 1, perPage = 20) {
  const gql = `
    query ($format: MediaFormat, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(format: $format, type: ANIME, sort: TRENDING_DESC) {
          id
          title { romaji english }
          coverImage { large extraLarge }
          averageScore
          episodes
          format
          status
          isAdult
        }
      }
    }
  `;
  
  const data = await query(gql, { format, page, perPage });
  return data?.Page?.media || [];
}

export async function searchAnime(searchTerm, page = 1, perPage = 20) {
  const gql = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME) {
          id
          title { romaji english }
          coverImage { large extraLarge }
          averageScore
          episodes
          format
          status
          isAdult
        }
      }
    }
  `;
  
  const data = await query(gql, { search: searchTerm, page, perPage });
  return data?.Page?.media || [];
}

export async function getByGenre(genre, page = 1, perPage = 20) {
  const gql = `
    query ($genre: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(genre: $genre, type: ANIME, sort: TRENDING_DESC) {
          id
          title { romaji english }
          coverImage { large extraLarge }
          averageScore
          episodes
          format
          status
          isAdult
        }
      }
    }
  `;
  
  const data = await query(gql, { genre, page, perPage });
  return data?.Page?.media || [];
}

export async function getAnimeDetails(id) {
  const gql = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large extraLarge }
        bannerImage
        description
        genres
        averageScore
        episodes
        duration
        season
        seasonYear
        format
        status
        startDate { year month day }
        endDate { year month day }
        studios { nodes { name } }
        trailer { id site }
        isAdult
        characters(perPage: 12, sort: ROLE) {
          nodes {
            id
            name { full }
            image { large }
          }
        }
        recommendations(perPage: 12, sort: RATING_DESC) {
          nodes {
            mediaRecommendation {
              id
              title { romaji }
              coverImage { large }
            }
          }
        }
      }
    }
  `;
  
  const data = await query(gql, { id: parseInt(id) });
  return data?.Media || null;
}
