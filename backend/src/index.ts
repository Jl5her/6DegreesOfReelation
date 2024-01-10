import dotenv from 'dotenv'
import Elysia from "elysia";
import * as mongoose from 'mongoose'
import { Service } from "./service";

dotenv.config()

await mongoose.connect('mongodb://localhost:27017/mongoose-app')


const app = new Elysia()

const service = new Service()

app.get('/generate', service.generateGame)
app.get('/game/:id', (context) => {
  return service.getGame(context.params.id)
})
app.get('/game/:id/solution', (context) => {
  return service.getSolution(context.params.id)
})

app.get('/search_movie', (context) => {
  if(context.query.q) {
    return service.searchMovie(context.query.q)
  }
  
  context.set.status = 400
  return null;
})
app.get('/search_person', (context) => {
  if(context.query.q) {
    return service.searchPerson(context.query.q)
  }

  context.set.status = 400
  return null;
})


app.listen(80, () => {
  console.log("Server is running at port :80")
})
