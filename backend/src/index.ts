import { cors } from "@elysiajs/cors";
import dotenv from 'dotenv'
import Elysia from "elysia";
import * as mongoose from 'mongoose'
import { Service } from "./service";

dotenv.config()

await mongoose.connect('mongodb://localhost:27017/mongoose-app')


const app = new Elysia()

app.use(cors())

const service = new Service()

app.get('/generate', () => {
  return service.generateGame()
})
app.get('/game/:id', (context) => {
  return service.getGame(parseInt(context.params.id))
})
app.get('/game/:id/solution', (context) => {
  return service.getSolution(context.params.id)
})

app.get('/search_movie', (context) => {
  if (context.query.q) {
    return service.searchMovie(context.query.q)
  }

  context.set.status = 400
  return null;
})
app.get('/search_person', (context) => {
  if (context.query.q) {
    return service.searchPerson(context.query.q)
  }

  context.set.status = 400
  return null;
})

app.get('/check_credit', (context) => {
  if (context.query.cast && context.query.movie) {
    const movie_id = parseInt(context.query.movie)
    const cast_id = parseInt(context.query.cast)
    return service.checkCredit(movie_id, cast_id)
  }
  return null;
})

app.get('/check_answer', (context) => {
  if(context.query.movie1 == undefined || context.query.movie2 == undefined) {
    return null;
  }
  const movie1 = parseInt(context.query.movie1)
  const movie2 = parseInt(context.query.movie2)
  
  return service.checkAnswer(movie1, movie2)
})


app.listen(80, () => {
  console.log("Server is running at port :80")
})
