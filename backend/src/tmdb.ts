type PagedResult<T> = {
  page: number,
  results: [T],
  total_pages: number,
  total_results: number
}

type Movie = {
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

type Cast = {
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

import fetch from 'node-fetch-cache'

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZlZDgzNDI3NjkzYWIwMjZhMTZhMjhiMDIwY2QxNCIsInN1YiI6IjYwYzgyZGYyNDgzMzNhMDA0MWJkYzBjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7HIjQvsvJmUfAQQBPlBJ2l9aDYoAOqDCufWsi8teRnM"

const filters = {
  'primary_release_date.gte': '1980-01-01',
  'primary_release_date.lte': '2020-01-01',
  'sort_by': 'popularity.desc',
  'vote_count.gte': '1000',
  'vote_average.gte': '7'
}

const url = 'https://api.themoviedb.org/3/'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const discover_movies = async (additional_filters: { [key: string]: string }): Promise<Movie[]> => {
  const q = new URLSearchParams({
    ...additional_filters,
    ...filters
  })

  const res = await fetch(`${url}/discover/movie?${q}`, options)

  const data = await res.json() as PagedResult<Movie>
  return data.results
}

const movie_credits = async (movie_id: number): Promise<Cast[]> => {
  const res = await fetch(`${url}/movie/${movie_id}/credits`, options)
  const data = await res.json() as { id: number, cast: Cast[] }
  return data.cast
}

const get_top = async () => {
  const movies = []
  for (let page = 1; page <= 10; page++) {
    const m = await discover_movies({
      ...filters,
      page: `${page}`
    })
    movies.push(...m)
  }
  return movies
}

const get_top_appearances = async (cast_id: number): Promise<Movie[]> => {
  const movies: Movie[] = []
  for (let page = 1; page <= 3; page++) {
    const m = await discover_movies({
      ...filters,
      with_cast: `${cast_id}`
    })
    movies.push(...m)
  }
  return movies
}

const get_top_cast = async (movie_id: number): Promise<Cast[]> => {
  const cast = await movie_credits(movie_id)
  return cast.filter(c => c.popularity > 40)
}

const filtered_top = async () => {
  return (await get_top()).filter(async (movie) => {
    return (await get_top_cast(movie.id)).length >= 3
  })
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(arr.length * Math.random())]
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const make_game = async (): Promise<{ movie: Movie, cast: Cast }[]> => {
  let movies = await filtered_top()

  console.log(`Get ${movies.length} movie(s)`)
  let movie = randomChoice(movies)

  const previous_movies = [movie.id]
  const previous_cast: number[] = []

  console.log("DELAY")
  await delay(1000)

  console.log(`Starting with ${movie.title}`)

  var game = []

  let cast: Cast;
  for (let i = 0; i < 7; i++) {
    let top_cast = await get_top_cast(movie.id)
    while (true) {
      cast = randomChoice(top_cast)
      movies = await get_top_appearances(cast.id)
      while (previous_cast.includes(cast.id) && movies.length < 3) {
        cast = randomChoice(top_cast)
        movies = await get_top_appearances(cast.id)
        console.log(`Random cast: ${cast.name}`)
      }

      if (movies.length == 1) {
        continue;
      }
      
      console.log(`  Trying ${cast.name}...`)

      movie = randomChoice(movies)
      while (previous_movies.includes(movie.id)) {
        movie = randomChoice(movies)
        console.log(`Random movie: ${movie.title} (${movie.id})`)
      }

      previous_movies.push(movie.id)
      previous_cast.push(cast.id)
      break;
    }

    console.log(`Moving on with ${cast.name}`)
    console.log(`Moving on with ${movie.title}`)

    game.push({
      cast,
      movie
    })
  }

  console.log("Done")

  return game
}

export { make_game }