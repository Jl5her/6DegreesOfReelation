import fetch from 'node-fetch-cache'
import type { Cast, Movie, PagedResult, Solution } from "reel-ation";

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZlZDgzNDI3NjkzYWIwMjZhMTZhMjhiMDIwY2QxNCIsInN1YiI6IjYwYzgyZGYyNDgzMzNhMDA0MWJkYzBjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7HIjQvsvJmUfAQQBPlBJ2l9aDYoAOqDCufWsi8teRnM"

const filters = {
  'primary_release_date.gte': '1980-01-01',
  'primary_release_date.lte': '2020-01-01',
  'sort_by': 'popularity.desc',
  'language': 'en-US',
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


export const checkCredit = async (movie_id: number, cast_id: number) => {
  const credits = await movie_credits(movie_id)
  return credits.find(c => c.id == cast_id) !== undefined
}

export const checkAnswer = async (movie1: number, movie2: number) => {
  const credits1 = await movie_credits(movie1)
  const credits2 = await movie_credits(movie2)

  const common = credits1.filter(c1 => credits2.find(c2 => c2.name == c1.name) != undefined)
  return { correct: common.length > 0, cast: common }
}

export const searchMovie = async (query: string): Promise<Movie[]> => {
  const q = new URLSearchParams({
    query,
    'include_adult': 'false',
    'language': 'en-US'
  })
  const res = await fetch(`${url}/search/movie?${q}`, options)
  const data = await res.json() as { page: number, results: Movie[] }
  return data.results
}

export const searchPerson = async (query: string): Promise<Cast[]> => {
  const q = new URLSearchParams({
    query,
    'include_adult': 'false',
    'language': 'en-US'
  })
  const res = await fetch(`${url}/search/person?${q}`, options)
  const data = await res.json() as { page: number, results: Cast[] }
  return data.results
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

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array;
}

export const make_solution = async (): Promise<Solution | undefined> => {
  let movies = shuffle(await filtered_top())

  const previous_cast: string[] = []
  const previous_movies: string[] = []

  for (let firstMovie of movies) {
    console.log(`Starting with ${firstMovie.title} (${previous_movies.join(',')})`)
    previous_movies.push(firstMovie.id.toString())

    const firstMovieCast = shuffle(await get_top_cast(firstMovie.id))
    for (let firstCastMember of firstMovieCast) {

      const firstCastMovies = shuffle(await get_top_appearances(firstCastMember.id))
        .filter(movie => !previous_movies.includes(movie.id.toString()))

      if (firstCastMovies.length < 3) continue;
      console.log(`Going with ${firstCastMember.name} (${previous_cast.join(',')})`)
      previous_cast.push(firstCastMember.id.toString())

      // Second iteration
      for (let secondMovie of firstCastMovies) {
        console.log(`Trying 2nd movie: ${secondMovie.title} (${previous_movies.join(',')})`)
        previous_movies.push(secondMovie.id.toString())

        const secondMovieCast = shuffle(await get_top_cast(secondMovie.id))
          .filter(cast => !previous_cast.includes(cast.id.toString()))

        for (let secondCastMember of secondMovieCast) {

          const secondCastMovies = shuffle(await get_top_appearances(secondCastMember.id))
            .filter(movie => !previous_movies.includes(movie.id.toString()))

          if (secondCastMovies.length < 3) continue;
          console.log(`Going with ${secondCastMember.name} for second (${previous_cast.join(',')})`)
          previous_cast.push(secondCastMember.id.toString())

          // Third iteration
          for (let thirdMovie of secondCastMovies) {
            console.log(`Trying 3rd movie: ${thirdMovie.title} (${previous_movies.join(',')})`)
            previous_movies.push(thirdMovie.id.toString())

            const thirdMovieCast = shuffle(await get_top_cast(thirdMovie.id))
              .filter(cast => !previous_cast.includes(cast.id.toString()))

            for (let thirdCastMember of thirdMovieCast) {

              const thirdCastMovies = shuffle(await get_top_appearances(thirdCastMember.id))
                .filter(movie => !previous_movies.includes(movie.id.toString()))

              if (thirdCastMovies.length < 3) continue;
              console.log(`Going with ${thirdCastMember.name} for third (${previous_cast.join(',')})`)
              previous_cast.push(thirdCastMember.id.toString())

              // Fourth iteration
              for (let fourthMovie of thirdCastMovies) {
                console.log(`Trying 4th movie: ${fourthMovie.title} (${previous_movies.join(',')})`)
                previous_movies.push(fourthMovie.id.toString())

                const fourthMovieCast = shuffle(await get_top_cast(fourthMovie.id))
                  .filter(cast => !previous_cast.includes(cast.id.toString()))

                for (let fourthCastMember of fourthMovieCast) {
                  const fourthCastMovies = shuffle(await get_top_appearances(fourthCastMember.id))
                    .filter(movie => !previous_movies.includes(movie.id.toString()))

                  if (fourthCastMovies.length < 3) continue;
                  console.log(`Going with ${fourthCastMember.name} for fourth (${previous_cast.join(',')})`)
                  previous_cast.push(fourthCastMember.id.toString())

                  // Fifth iteration
                  for (let fifthMovie of fourthCastMovies) {
                    console.log(`Trying 5th movie: ${fifthMovie.title} (${previous_movies.join(',')})`)
                    previous_movies.push(fifthMovie.id.toString())

                    const fifthMovieCast = shuffle(await get_top_cast(fifthMovie.id))
                      .filter(cast => !previous_cast.includes(cast.id.toString()))

                    for (let fifthCastMember of fifthMovieCast) {
                      const fifthCastMovies = shuffle(await get_top_appearances(fifthCastMember.id))
                        .filter(movie => !previous_movies.includes(movie.id.toString()))

                      if (fifthCastMovies.length < 3) continue;
                      console.log(`Going with ${fifthCastMember.name} for fifth (${previous_cast.join(',')})`)

                      // Sixth iteration
                      console.log('Finished!')
                      return [
                        { movie: firstMovie, cast: undefined },
                        { movie: secondMovie, cast: firstCastMember },
                        { movie: thirdMovie, cast: secondCastMember },
                        { movie: fourthMovie, cast: thirdCastMember },
                        { movie: fifthMovie, cast: fourthCastMember },
                        { movie: randomChoice(fifthCastMovies), cast: fifthCastMember }
                      ]
                    }
                    previous_movies.pop()
                  }
                  previous_cast.pop();
                }
                previous_movies.pop()
              }
              previous_cast.pop();
            }
            previous_movies.pop()
          }
          previous_cast.pop();
        }
        previous_movies.pop();
      }
      previous_cast.pop();
    }
    previous_movies.pop()
  }
}
