import { Game, Solution } from "./schema";
import { make_game } from './tmdb'

export class Service {
  constructor() {

  }

  async getGame(id: string) {
    return await Game.findOne({ id })
  }

  async generateGame() {
    const steps = await make_game()

    let id = (await Game.findOne({}).sort("-id"))?.id ?? 0

    console.log('max id: ' + id)
    id++;

    const game = new Game({
      id,
      start: steps[0].movie,
      end: steps[1].movie
    })

    const solution = new Solution({
      id,
      steps
    })

    await game.save();
    await solution.save();

    return id
  }
  
  async getSolution(id: string) {
    return Solution.findOne({id})
  }
}