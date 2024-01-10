import { Game, SearchResults, Solution } from "./schema";
import { checkCredit, make_solution, searchMovie, searchPerson } from './tmdb'

const CACHE_TIME = 1000 * 60 * 30

export class Service {
  constructor() {

  }

  async getGame(id: number) {
    let game = await Game.findOne({ id })
    if (!game) {
      game = await this.generateGame(id)
    }
    return game;
  }

  async generateGame(id: number | undefined = undefined) {
    let steps = await make_solution()

    while (steps == undefined) {
      steps = await make_solution();
    }

    id ??= (await Game.findOne({}).sort("-id"))?.id + 1 ?? 0

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
}