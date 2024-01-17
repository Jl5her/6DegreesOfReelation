import { checkAnswer, checkCredit, makeSolution, randomMovie } from "./game.ts";
import { Game, SearchResults, Solution } from "./schema";
import { getGenres, movieCredits, searchMovie, searchPerson } from './tmdb'

const CACHE_TIME = 1000 * 60 * 30

export class Service {
  constructor() {

  }

  async getGame(include_animation: boolean = true, id: number) {
    let game = await Game.findOne({ id })
    if (!game) {
      game = await this.generateGame(include_animation, id)
    }
    return game;
  }

  async getGenres() {
    return await getGenres()
  }

  async generateGame(include_animation: boolean = true, id: number | undefined = undefined) {
    let steps = await makeSolution(include_animation)

    while (steps == undefined) {
      steps = await makeSolution(include_animation);
    }

    id = 0;
    var doc = await Game.findOne({}).sort("-id")
    if(doc) {
      id = doc.id + 1
    }

    const game = new Game({
      id,
      start: steps[0].movie,
      end: steps[steps.length - 1].movie
    })

    const solution = new Solution({
      id,
      steps
    })

    await game.save();
    await solution.save();

    console.log(game)
    return game
  }

  async getSolution(id: string) {
    return Solution.findOne({ id })
  }

  async searchMovie(query: string) {
    var searchResults = await SearchResults.findOne({ query, type: 'movie' })

    if (!searchResults || searchResults.time > new Date(Date.now() + CACHE_TIME)) {

      const results = await searchMovie(query);
      searchResults = new SearchResults({
        query,
        type: 'movie',
        results,
        time: new Date()
      })

      await searchResults.save()
    }

    return searchResults.results
  }

  async searchPerson(query: string) {
    var searchResults = await SearchResults.findOne({ query, type: 'person' })

    if (!searchResults || searchResults.time > new Date(Date.now() + CACHE_TIME)) {

      const results = await searchPerson(query);
      searchResults = new SearchResults({
        query,
        type: 'person',
        results,
        time: new Date()
      })

      await searchResults.save()
    }

    return searchResults.results
  }

  async checkCredit(movie_id: number, cast_id: number) {
    return { correct: await checkCredit(movie_id, cast_id) }
  }

  async checkAnswer(movie1: number, movie2: number) {
    return await checkAnswer(movie1, movie2)
  }

  async getCast(id: number) {
    return await movieCredits(id)
  }

  async randomMovie(include_animation: boolean = true) {
    return await randomMovie(include_animation);
  }
}