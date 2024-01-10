declare module 'reel-ation' {
  export type PagedResult<T> = {
    page: number,
    results: [T],
    total_pages: number,
    total_results: number
  }

  export type Movie = {
    adult: boolean,
    backdrop_path: string,
    genre_ids: [number],
    id: number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
  }

  export type Cast = {
    adult: boolean,
    gender: number,
    id: number,
    known_for_department: string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path?: string,
    cast_id: number,
    character: string,
    credit_id: string,
    order: number
  }

  export type Solution = { movie: Movie, cast: Cast | undefined }[]
}