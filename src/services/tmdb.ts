const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_TOKEN =
  import.meta.env.VITE_TMDB_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNDkyOTMzOGFhOGM5MjhlYmZkYmI4MmE3YzgzYTMwNyIsIm5iZiI6MTc2NzAxNDU1OS42NjgsInN1YiI6IjY5NTI4MDlmZGYyMWExYmJiNGNiZDVlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VdP4-3qszFIR5-TJq77j324dMTO3uKb871Q4iU8yiU0";

// Genre ID mapping from TMDB
export const GENRE_MAP: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

// TV Genre IDs (some differ from movies)
export const TV_GENRE_MAP: Record<string, number> = {
  Action: 10759, // Action & Adventure
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 10765, // Sci-Fi & Fantasy
  Horror: 9648, // Mystery for TV
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 10765,
  Thriller: 80, // Crime for TV
  War: 10768, // War & Politics
  Western: 37,
};

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MediaItem {
  id: number;
  title: string;
  year: number;
  rating: string;
  poster: string;
  genres: string[];
  description: string;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Reverse genre lookup
const getGenreNames = (genreIds: number[], isTV: boolean = false): string[] => {
  const genreMap = isTV ? TV_GENRE_MAP : GENRE_MAP;
  const reverseMap = Object.entries(genreMap).reduce((acc, [name, id]) => {
    acc[id] = name;
    return acc;
  }, {} as Record<number, string>);

  return genreIds
    .map((id) => reverseMap[id])
    .filter((name): name is string => !!name)
    .slice(0, 3);
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export async function fetchMovies(
  genres: string[] = [],
  page: number = 1
): Promise<MediaItem[]> {
  const genreIds = genres
    .map((g) => GENRE_MAP[g])
    .filter((id): id is number => !!id);

  const params = new URLSearchParams({
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: page.toString(),
    "release_date.lte": getTodayDate(),
    sort_by: "popularity.desc",
    "vote_average.gte": "7",
    "vote_count.gte": "5000",
  });

  if (genreIds.length > 0) {
    params.append("with_genres", genreIds.join(","));
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  const data: TMDBResponse<TMDBMovie> = await response.json();

  return data.results
    .filter((movie) => movie.poster_path) // Only movies with posters
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 0,
      rating: movie.vote_average.toFixed(1),
      poster: `${TMDB_IMAGE_BASE}${movie.poster_path}`,
      genres: getGenreNames(movie.genre_ids, false),
      description:
        movie.overview.length > 150
          ? movie.overview.slice(0, 150) + "..."
          : movie.overview,
    }));
}

export async function fetchTVShows(
  genres: string[] = [],
  page: number = 1
): Promise<MediaItem[]> {
  const genreIds = genres
    .map((g) => TV_GENRE_MAP[g])
    .filter((id): id is number => !!id);

  const params = new URLSearchParams({
    include_adult: "false",
    language: "en-US",
    page: page.toString(),
    "first_air_date.lte": getTodayDate(),
    sort_by: "popularity.desc",
    "vote_average.gte": "7",
    "vote_count.gte": "1000",
  });

  if (genreIds.length > 0) {
    params.append("with_genres", genreIds.join(","));
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/discover/tv?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  const data: TMDBResponse<TMDBTVShow> = await response.json();

  return data.results
    .filter((show) => show.poster_path) // Only shows with posters
    .map((show) => ({
      id: show.id,
      title: show.name,
      year: show.first_air_date
        ? parseInt(show.first_air_date.split("-")[0])
        : 0,
      rating: show.vote_average.toFixed(1),
      poster: `${TMDB_IMAGE_BASE}${show.poster_path}`,
      genres: getGenreNames(show.genre_ids, true),
      description:
        show.overview.length > 150
          ? show.overview.slice(0, 150) + "..."
          : show.overview,
    }));
}

export async function fetchMedia(
  mediaType: "movie" | "series",
  genres: string[] = [],
  page: number = 1
): Promise<MediaItem[]> {
  let res = [];
  if (mediaType === "movie") {
    res = await fetchMovies(genres, page);
  } else {
    res = await fetchTVShows(genres, page);
  }
  if (res.length === 0) {
    const custoGenres = genres.slice(0, 1); // Limit to top 1 genres
    res =
      mediaType === "movie"
        ? await fetchMovies(custoGenres, page)
        : await fetchTVShows(custoGenres, page);
  }
  if (res.length < 5) {
    const custoGenres = genres.slice(0, 1); // Limit to top 1 genres
    const mergeRes =
      mediaType === "movie"
        ? await fetchMovies(custoGenres, page)
        : await fetchTVShows(custoGenres, page);
    res = [...res, ...mergeRes];
  }
  return res;
}

export async function fetchMediaById(
  id: number,
  mediaType: "movie" | "series"
): Promise<MediaItem | null> {
  const endpoint = mediaType === "movie" ? "movie" : "tv";

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}/${id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (mediaType === "movie") {
      return {
        id: data.id,
        title: data.title,
        year: data.release_date ? parseInt(data.release_date.split("-")[0]) : 0,
        rating: data.vote_average.toFixed(1),
        poster: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : "",
        genres:
          data.genres?.map((g: { name: string }) => g.name).slice(0, 3) || [],
        description:
          data.overview?.length > 150
            ? data.overview.slice(0, 150) + "..."
            : data.overview || "",
      };
    } else {
      return {
        id: data.id,
        title: data.name,
        year: data.first_air_date
          ? parseInt(data.first_air_date.split("-")[0])
          : 0,
        rating: data.vote_average.toFixed(1),
        poster: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : "",
        genres:
          data.genres?.map((g: { name: string }) => g.name).slice(0, 3) || [],
        description:
          data.overview?.length > 150
            ? data.overview.slice(0, 150) + "..."
            : data.overview || "",
      };
    }
  } catch (error) {
    console.error(`Failed to fetch ${mediaType} ${id}:`, error);
    return null;
  }
}

export async function fetchMediaByIds(
  ids: number[],
  mediaType: "movie" | "series"
): Promise<MediaItem[]> {
  const results = await Promise.all(
    ids.map((id) => fetchMediaById(id, mediaType))
  );
  return results.filter((item): item is MediaItem => item !== null);
}
