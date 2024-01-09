import dotenv from 'dotenv'
import Elysia from "elysia";
import * as mongoose from 'mongoose'
import { Service } from "./service";

dotenv.config()

await mongoose.connect('mongodb://localhost:27017/mongoose-app')

const service = new Service()

// await mongoose.disconnect()

const app = new Elysia()

app.get('/generate', service.generateGame)
app.get('/game/:id', (context) => {
  return service.getGame(context.params.id)
})
app.get('/game/:id/solution', (context) => {
  return service.getSolution(context.params.id)
})


app.listen(80, () => {
  console.log("Server is running at port :80")
})
