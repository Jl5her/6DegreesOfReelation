import fetch from 'node-fetch-cache'
import type { Cast, Movie, PagedResult } from "reel-ation";

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZlZDgzNDI3NjkzYWIwMjZhMTZhMjhiMDIwY2QxNCIsInN1YiI6IjYwYzgyZGYyNDgzMzNhMDA0MWJkYzBjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7HIjQvsvJmUfAQQBPlBJ2l9aDYoAOqDCufWsi8teRnM"

const url = 'https://api.themoviedb.org/3/'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const filters = {
  'primary_release_date.gte': '1980-01-01',
  'primary_release_date.lte': '2020-01-01',
  'sort_by': 'popularity.desc',
  'language': 'en-US',
  'vote_count.gte': '1000',
  'vote_average.gte': '7'
}

export const discoverMovies = async (additional_filters: { [key: string]: string }): Promise<Movie[]> => {
  const q = new URLSearchParams({
    ...additional_filters,
    ...filters
  });

  const res = await fetch(`${url}/discover/movie?${q}`, options)
  return (await res.json() as PagedResult<Movie>).results
}

export const movieCredits = async (movie_id: number): Promise<Cast[]> => {
  const res = await fetch(`${url}/movie/${movie_id}/credits`, options)
  return (await res.json() as { id: number, cast: Cast[] }).cast
}

export const getGenres = async (): Promise<{ genres: { id: number, name: string } }> => {
  const res = await fetch(`${url}/genre/movie/list`, options)
  return await res.json() as { genres: { id: number, name: string } }
}

export const searchMovie = async (query: string): Promise<Movie[]> => {
  const q = new URLSearchParams({
    query,
    'include_adult': 'false',
    'language': 'en-US'
  });

  const res = await fetch(`${url}/search/movie?${q}`, options)
  return (await res.json() as { page: number, results: Movie[] }).results;
}

export const searchPerson = async (query: string): Promise<Cast[]> => {
  const q = new URLSearchParams({
    query,
    'include_adult': 'false',
    'language': 'en-US'
  });

  const res = await fetch(`${url}/search/person?${q}`, options)
  return (await res.json() as { page: number, results: Cast[] }).results
}
