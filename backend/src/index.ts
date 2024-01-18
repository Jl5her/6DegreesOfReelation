import { cors } from "@elysiajs/cors";
import dotenv from "dotenv";
import Elysia from "elysia";
import * as mongoose from "mongoose";
import { Service } from "./service";

dotenv.config();

await mongoose.connect("mongodb://localhost:27017/mongoose-app");

const app = new Elysia();

app.use(cors());

const service = new Service();

// GAMES

// LINK GAME

app.get("/link-game/today", () => {});

app.get("/link-game/random", (context) => {
  if (context.query.include_animation !== undefined) {
    const include_animation = context.query.include_animation == "true";
    return service.generateGame(include_animation);
  }
  return service.generateGame();
});

app.get("/link-game/id/:id", (context) => {
  const gameId = parseInt(context.params.id);

  if (context.query.include_animation !== undefined) {
    const include_animation = context.query.include_animation == "true";
    return service.getGame(include_animation, gameId);
  }

  service.getGame(true, gameId);
});

app.get("/link-game/id/:id/solution", (context) =>
  service.getSolution(context.params.id)
);

// Guessing game
app.get("/guessing-game/today", (context) => {
});


app.get("/guessing-game/random", (context) => {
  if (context.query.include_animation !== undefined) {
    const include_animation = context.query.include_animation == "true";
    return service.randomMovie(include_animation);
  }
  return service.randomMovie();
});

app.get("/guessing-game/id/:id", (context) => {
  if (context.query.include_animation !== undefined) {
    const include_animation = context.query.include_animation == "true";
    return service.randomMovie(include_animation);
  }
  return service.randomMovie();
});


// UTILITY

app.get("/genres", () => service.getGenres());

app.get("/search_movie", (context) => {
  if (context.query.q) {
    return service.searchMovie(context.query.q);
  }

  context.set.status = 400;
  return null;
});
app.get("/search_person", (context) => {
  if (context.query.q) {
    return service.searchPerson(context.query.q);
  }

  context.set.status = 400;
  return null;
});

app.get("/check_credit", (context) => {
  if (context.query.cast && context.query.movie) {
    const movie_id = parseInt(context.query.movie);
    const cast_id = parseInt(context.query.cast);
    return service.checkCredit(movie_id, cast_id);
  }
  return null;
});

app.get("/check_answer", (context) => {
  if (context.query.movie1 == undefined || context.query.movie2 == undefined) {
    return null;
  }
  const movie1 = parseInt(context.query.movie1);
  const movie2 = parseInt(context.query.movie2);

  return service.checkAnswer(movie1, movie2);
});

app.get("/cast", (context) => {
  if (!context.query.id) {
    return null;
  }

  return service.getCast(parseInt(context.query.id));
});

app.listen(80, () => {
  console.log("Server is running at port :80");
});
